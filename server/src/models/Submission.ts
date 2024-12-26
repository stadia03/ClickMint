import mongoose, { Schema } from "mongoose";


interface ISubmission extends Document{
  task_id : mongoose.Schema.Types.ObjectId;
  voted_option :  number[];
}

const submissionSchema = new Schema({
  task_id: { type: Schema.Types.ObjectId, ref: "Task", unique: true }, // Reference to a Task
  voted_option: { type: [Number], default: [] } // Array of vote counts for each option
});

export default mongoose.model<ISubmission>('Submission', submissionSchema);
