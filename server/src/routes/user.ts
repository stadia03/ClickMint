import express from "express";
import User from "../models/User";
import 'dotenv/config'
import Task from "../models/Task";
import Submission from "../models/Submission";
import { createPresignedPost } from "@aws-sdk/s3-presigned-post";
const router = express.Router();

import { S3Client } from "@aws-sdk/client-s3";

import verifyTransaction from "../utils/verifyTransaction";


const s3Client = new S3Client({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  },
  region: process.env.AWS_REGION,
});
router.get("/presignedUrl", async (req, res): Promise<any> => {
  const user = await User.findOne({ address: req.query.address });
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  const ex = req.query.fileType as string;
  
  const Key = `clickmint/${req.query.address}/${Math.random()}/image.${ex}`;
  const params = {
    Bucket: process.env.BUCKET_NAME,
    Key,
    ContentType: ex,
    Expires: 3600, // URL validity in seconds
  };

  try {
    //const uploadURL = await s3.getSignedUrlPromise('putObject', params);
    //const command = new PutObjectCommand({ Bucket: process.env.BUCKET_NAME, Key: Key });
    //const uploadURL = await getSignedUrl(s3, command, { expiresIn: 3600});
    const { url, fields } = await createPresignedPost(s3Client, {
      Bucket: process.env.BUCKET_NAME as string,
      Key,
      Conditions: [
        ["content-length-range", 0, 5 * 1024 * 1024], // 5 MB max
      ],
      Expires: 3600,
    });

    res.json({
      preSignedUrl: url,
      fields,
    });
    // res.json({ uploadURL, "key": Key});
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

//create new task
router.post("/task", async (req, res): Promise<void> => {
  try {
    const title = req.body.title;
    const address = req.body.address;
    const options = req.body.options;
    const signature = req.body.signature;
    const total_submissions = req.body.total_submissions;

    if (!title || !address || !options || !signature || !total_submissions) {
      res.status(400).json({ error: "Missing required fields" });
      return;
    }

    //signature verification
   
    // const {status , message} = await  verifyTransaction( 
    //   signature,
    //    address,
    //   process.env.ADMIN_WALLET_PUBLICKEY ?? "",
    //    total_submissions * Number(process.env.CHARGE_PER_CLICK) 
    //  // total_submissions * 2500000
    // );
    // if(status !=200){
    //   console.log(status,message);
    //   res.status(400).json({ error: message });
    //   return;
    // } 

    const newTask = new Task({
      title: title,
      task_owner_address: address,
      options: options,
      signature: signature,
      total_submissions: total_submissions
    });
    const taskResponse = await newTask.save();

    const votedOption = Array(taskResponse.options.length).fill(0);

    //  new Submission
    const newSubmission = new Submission({
      task_id: taskResponse._id,
      voted_option: votedOption,
    });
    const submissionResponse = await newSubmission.save();

    const updatedTask = await Task.findOneAndUpdate(
      { _id: taskResponse._id },
      { submission: submissionResponse._id },
      { new: true } // Ensures the updated document is returned
    );

    res.status(201).json({
      message: "Task created successfully",
      task: updatedTask,
    });
    
  } catch (error) {
    //console.error("Error in /task route:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/alltask", async (req, res): Promise<void> => {
  try {
    const { address } = req.query;
    if (!address) {
      res.status(400).json({ message: "Address is required." });
      return;
    }

    const response = await Task.find({ task_owner_address: address });
    res.json(response);
  } catch (err) {
    console.log(err);
  }
});

router.get("/taskvotes", async (req, res): Promise<void> => {
  try {
    const { address } = req.query;

    if (!address) {
      res.status(400).json({ message: "Address is required." });
      return;
    }

    // Fetch tasks with submissions
    const task = await Task.find({ task_owner_address: address })
      .populate("submission") // Populate the 'submission' field with Submission data
      .exec();
    console.log(task);
    res.json(task);
  } catch (error) {
    console.error("Error fetching tasks and submissions:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

export default router;
