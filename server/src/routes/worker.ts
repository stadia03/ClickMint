import express from "express";
import getNextTask from "../utils/getNextTask";
import Submission from "../models/Submission";
import Worker from "../models/Worker";
import Task from "../models/Task";
import Payouts from "../models/Payouts";
import mongoose from "mongoose";
import updateTaskStatus from "../utils/updateTaskStatus";
import { Connection, Keypair, PublicKey, sendAndConfirmTransaction, SystemProgram, Transaction } from "@solana/web3.js";
import bs58 from "bs58";
const connection = new Connection("https://solana-devnet.g.alchemy.com/v2/DZHbnZioln7-ITlLrhFgZZlcSSiP3yan", "confirmed");

const router = express.Router();

router.get("/", (req, res) => {
  res.json("verified!");
});

router.get("/nextTask", async (req, res): Promise<any> => {
  const address = req.query.address as string;

  try {
    const result = await getNextTask(address);
    res.status(result.status).json(result.data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "internal server error" });
  }
});

router.get('/balance',async(req,res)=>{
  const address = req.query.address as string;
  try{
    const worker = await Worker.findOne({address});
    if(!worker){
      res.status(404).json({message : "Worker not found"});
      return;
    }
    res.status(200).json({balance : worker.balance, lockedBalance : worker.locked_balance});
  }catch(err){
    console.log(err);
  }
});

router.post("/submit", async (req, res): Promise<void> => {
  try {
    const address = req.body.address as string;
    const taskId = req.body.taskId as string;
    const votedOption = req.body.votedOption as number; // Ensure this is the correct type (index for the option)

    // Validate task assignment
   // const result = await getNextTask(address);
    const worker = await  Worker.findOne({address})  ;
    // Convert taskId to ObjectId
    const objectIdTaskId = new mongoose.Types.ObjectId(taskId);
   
    if(worker && worker.completed_tasks.includes(objectIdTaskId)){
      res.status(400).json({ message: "worker can't submit to current task" });
      return;
    }

    //fetching task details and checking 
    const task = await Task.findOne({_id : taskId}) // Use await to fetch the task
    // console.log(task);
     if (!task  || task.total_submissions == null) {
       res.status(400).json({ message: "Invalid task data" });
       return;
     }

     if (task.done == true){
      res.status(400).json({ message: "Sorry, this task has ended!" });
      return;
     }
    // Update the submission to increment vote count for the specific option
    const submissionResponse = await Submission.findOneAndUpdate(
      { task_id: taskId },
      { $inc: { [`voted_option.${votedOption}`]: 1 } }, // Increment the count for the specified option
      { new: true, upsert: true } // Return the updated document, do not create a new one
    );

    if (!submissionResponse) {
      res.status(404).json({ message: "Task not found for submission" });
      return;
    }
    // Add logic to increase worker balance
   
    // Calculate the reward for the worker based on the task's amount and total submissions
    const reward = Number(process.env.CHARGE_PER_CLICK) ;

    // Update the worker's completed tasks and balance
   // console.log(address,"<-->",)
    const response = await Worker.findOneAndUpdate(
      { address: address },
      {
        $inc: { balance: reward }, // Increment worker's balance by calculated reward
        $addToSet: { completed_tasks: taskId }, // Add taskId to completed_tasks array without duplicates
      },
      { new: true, upsert: true } // Create document if it doesn't exist
    );
  //  console.log(response);
    updateTaskStatus(taskId);

    res.status(201).json({ taskId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error!" });
  }
});

router.post('/payout', async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const address = req.query.address;

    // Validate worker existence and balance
    const worker = await Worker.findOne({ address }).session(session);
    if (!worker) {
      res.status(404).json({ message: "Worker not found" });
      return;
    }

    if (Number(worker.balance) <= 0) {
      res.status(400).json({ message: "Insufficient balance for payout." });
      return;
    }

    // Validate admin wallet keys
    if (!process.env.ADMIN_WALLET_PRIVATEKEY || !process.env.ADMIN_WALLET_PUBLICKEY) {
      throw new Error("Admin wallet keys are not configured properly.");
    }

    const privateKey = bs58.decode(process.env.ADMIN_WALLET_PRIVATEKEY);
    const keypair = Keypair.fromSecretKey(privateKey);

    // Construct the transaction
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: keypair.publicKey,
        toPubkey: new PublicKey(address as string),
      lamports: worker.balance as number,
      })
    );

    // Get a recent blockhash
    const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = keypair.publicKey;

    // Sign the transaction
    transaction.sign(keypair);

    // Serialize and send the transaction
    const rawTransaction = transaction.serialize();
    const signature = await connection.sendRawTransaction(rawTransaction);

    // Poll for confirmation
    // const confirmation = await connection.confirmTransaction(
    //   { signature, blockhash, lastValidBlockHeight },
    //   'finalized'
    // );

    // if (confirmation.value.err) {
    //   throw new Error("Transaction failed to finalize.");
    // }

    // Atomically update worker balance
    await Worker.findOneAndUpdate(
      { address, balance: { $gt: 0 } },
      { $set: { balance: 0 } },
      { session, new: true }
    );

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    res.status(200).json({ message: "Payout Success", signature });
  } catch (error) {
    // Rollback MongoDB transaction on error
    await session.abortTransaction();
    session.endSession();
    console.error(error);
    res.status(500).json({ message: "Payout failed.", error });
  }
});



export default router;
