import express from 'express';
import User from '../models/User';
const router = express.Router();
import jwt from 'jsonwebtoken';
import Worker from '../models/Worker';



router.post('/userSignin', async (req, res): Promise<any>  => {

  try {
    
    const { address } = req.body;
   
    const currentUser = await User.findOne({ address });
    if (!currentUser) {
      const user = new User({address});
      await user.save();
      } 
    
    const token = jwt.sign({ _id: address }, process.env.JWT_SECRET_USER ?? "");

    res.status(201).json({token});
    
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/workerSignin', async (req, res): Promise<any>  => {

  try {
    
    const { address } = req.body;
    
    const currentUser = await Worker.findOne({ address });
    if (!currentUser) {
      const worker = new Worker({address,
        balance : 0,
        locked_balance: 0
      });
      await worker.save();
      } 
    
    const token = jwt.sign({ _id: address }, process.env.JWT_SECRET_WORKER ?? "");

    res.status(201).json({token});
    
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;