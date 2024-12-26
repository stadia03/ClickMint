import mongoose from 'mongoose';

const payoutSchema = new mongoose.Schema({
  user_address : String,
  amount : Number,
  signature : String,
  status : String
});

export default mongoose.model('Payout',payoutSchema);