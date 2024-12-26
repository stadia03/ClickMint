import mongoose, { Schema } from "mongoose";


const workerSchema = new Schema({
  name : String,
  address : String,
  balance : Number,
  locked_balance : Number,
  completed_tasks: [{ type: Schema.Types.ObjectId, ref: "Task" }]
});

export default mongoose.model('Worker',workerSchema);

