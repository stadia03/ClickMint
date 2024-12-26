import mongoose, {Schema} from 'mongoose';

interface ITask extends Document {
  title: string;
  task_owner_address: string;
  options: string[]; // Array of option URLs
  signature: string;
  amount: number;
  total_submissions: number;
  createdAt: Date;
  submission: mongoose.Schema.Types.ObjectId; // Reference to Submission model
  done: boolean;
}


const taskSchema = new Schema({
  title: String,
  task_owner_address: String,
  options: [{ type: String }], // Array of option URLs
  signature: String,
  total_submissions: Number,
  createdAt: { type: Date, default: Date.now },
  submission: { type: Schema.Types.ObjectId, ref: "Submission" }, // Reference to one Submission
  done: { type: Boolean, default: false }
});



export default mongoose.model<ITask>('Task',taskSchema);

