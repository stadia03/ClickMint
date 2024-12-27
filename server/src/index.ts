import express from 'express';
import mongoose from 'mongoose';
import 'dotenv/config' ;
import authRoutes from './routes/auth';
import userRoutes from './routes/user';
import workerRoutes from './routes/worker';
import cors from 'cors';
import verifyToken from './middleware/verifyToken';



const app = express();


app.use(cors());
app.use(express.json());

// app.use((req, res, next) => {
//   console.log("----- Incoming Request -----");
//   console.log("Method:", req.method);
//   console.log("URL:", req.url);
//   console.log("Headers:", JSON.stringify(req.headers, null, 2));
//   console.log("Query Params:", JSON.stringify(req.query, null, 2));
//   console.log("Body:", JSON.stringify(req.body, null, 2));
//   console.log("-----------------------------");

//   next(); // Continue to the next middleware/route handler
// });


app.get('/',async (req,res)=>{

  res.send("Hello from server");

});

app.use('/v1/auth',authRoutes);
app.use('/v1/user',verifyToken('user'),userRoutes);
app.use('/v1/worker',verifyToken('worker'),workerRoutes);

mongoose.connect(process.env.mongo_URL || "ts")
// .then(()=>{
//    app.listen(3500,()=>{
//     console.log("server is running on port 3500");
//    })
// })
.catch((err)=>{
  console.log(err);
})

