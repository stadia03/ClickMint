import mongoose, { Schema } from "mongoose";


const userSchema = new Schema({
  name : String,
  address : String,
  task: [{ type: Schema.Types.ObjectId, ref: "Task" }]
});

export default mongoose.model('User',userSchema);

