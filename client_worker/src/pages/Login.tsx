import { useWallet } from "@solana/wallet-adapter-react";
import {WalletMultiButton} from "@solana/wallet-adapter-react-ui";
import axios from "axios";
import { useUserStore } from "../store";


// import { useConnection, useWallet } from "@solana/wallet-adapter-react";


export default  function Login() {
  const {publicKey} = useWallet();

  async function handleLogin(){
    try{
      if (!publicKey) {
        alert("Please connect your wallet before logging in.");
        return;
      }
     // console.log(`${import.meta.env.VITE_BACKEND_URL}/v1/auth/workerSignin`);
      const res= await axios.post(`${import.meta.env.VITE_BACKEND_URL}/v1/auth/workerSignin`,
        {address : publicKey},
        {headers : {"Content-Type" :'application/json'}}
      );
      
      // console.log(res);
      if(res.status != 201 ){
        alert("Error Logging In");
        return;
      }

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('workerAddress', publicKey?.toBase58() ?? "");
      useUserStore.getState().setAuth(true);
      useUserStore.getState().setWorkeraddress(publicKey?.toBase58() ?? ""); 

    }catch(err){
      console.log(err);
    }
  };

  return (
   
       
      <div   className="h-screen flex flex-col justify-between">

     

    <div className="flex flex-col items-center  ">
      
   
      <h1 className="text-7xl font-bold text-center mb-6 mt-20 ">
        Welcome To Click<span className="text-purple-500">Mint</span>
      </h1>


      <p className="text-lg text-center max-w-xl mb-10">
        ClickMint connects creators with global workers for crowdsourced
        insights, rewarding contributions with micropayments.
      </p>

      
      <p className="text-sm text-gray-400 m-4 mt-8">To continue please connect your wallet.</p>
      <div >
      <WalletMultiButton />
      </div>

      <div onClick={handleLogin} className="my-6 bg-purple-500 text-white w-12 h-12 rounded-full flex items-center justify-center hover:bg-purple-800 ">
       <img src="./assets/right-arrow.png" className="h-8 "></img>
      </div>

   
    </div>
    <div className="flex flex-col items-center mx-8">
 <p className="text-s text-gray-400 my-10 max-w-5xl text-center">
        ClickMint empowers content creators and data enthusiasts to crowdsource
        valuable insights. Post tasks like thumbnail selection or dataset
        labeling, and let global workers earn micropayments by contributing
        their choices.
      </p>
    </div>
    
    
    </div>
    
  )
}
