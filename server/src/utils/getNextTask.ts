import mongoose from 'mongoose';
import Task from '../models/Task';
import Worker from '../models/Worker';


export default async function getNextTask(address : string) : Promise<{status: number ,data :any }>{
  try{
    
    const worker = await Worker.findOne({ address }) as { completed_tasks: mongoose.Types.ObjectId[] } | null;

    if(!worker) return {status: 404, data: {message: 'Worker not found'}};

    //finding next task

    const nextTask = await Task.findOne({
      _id : { $nin : worker.completed_tasks },
      done: false
    });

    if(!nextTask){
      return {status: 411, data: {message:"No task avaliable!" }}
    }

    return {status: 200, data: nextTask};
  }
  catch(err){
    console.log(err);
    return {status: 500, data:{message: "Internal server error"}};
  }
};