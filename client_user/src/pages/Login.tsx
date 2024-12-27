import { useWallet } from "@solana/wallet-adapter-react";
import {WalletMultiButton} from "@solana/wallet-adapter-react-ui";
import axios from "axios";
import { useUserStore } from "../store";
import React, { useState } from "react";

// import { useConnection, useWallet } from "@solana/wallet-adapter-react";


export default  function Login() {
  const {publicKey} = useWallet();
  const [isLoading, setLoading] = useState(false);

  async function handleLogin(){
    try{
      setLoading(true);
      if (!publicKey) {
        alert("Please connect your wallet before logging in.");
        setLoading(false);
        return;
      }
     // console.log(`${import.meta.env.VITE_BACKEND_URL}/v1/auth/userSignin`);
      const res= await axios.post(`${import.meta.env.VITE_BACKEND_URL}/v1/auth/userSignin`,
        {address : publicKey},
        {headers : {"Content-Type" :'application/json'}}
      );
      
      // console.log(res);
      if(res.status != 201 ){
        alert("Error Logging In");
        setLoading(false);
        return;
      }

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('userAddress', publicKey?.toBase58() ?? "");
      useUserStore.getState().setAuth(true);
      useUserStore.getState().setUseraddress(publicKey?.toBase58() ?? ""); 
      setLoading(false);
    }catch(err){
      console.log(err);
      setLoading(false);
    }
  };

  return (
   
       
    <div   className="h-screen flex flex-col justify-between">

     

    <div className="flex flex-col items-center  ">
      
   
      <h1 className="text-7xl font-bold text-center mb-3 mt-20 ">
        Welcome To Click<span className="text-purple-500">Mint</span>
      </h1>


      <p className="text-lg text-center max-w-xl ">
        ClickMint connects creators with global workers for crowdsourced
        insights, rewarding contributions with micropayments.
      </p>

      <div onClick={()=>{
        window.open("https://workerclickmint.vercel.app/", "_blank");
      }} className=" cursor-pointer my-8 bg-purple-500 text-white text-lg py-3 px-10 rounded-full flex items-center justify-center hover:bg-purple-800 ">
        <p >
          Switch to Worker
        </p>
      </div>
      
      <p className="text-sm text-gray-400 my-2">To continue please connect your wallet.</p>
      <div >
      <WalletMultiButton />
      </div>
      <div className="my-4 text-base">
      <p>
          Logging as Client
        </p>
      </div>
      <div className=" bg-purple-500 text-white w-12 h-12 rounded-full flex items-center justify-center hover:bg-purple-800 ">
             
             {isLoading ? (
                       <img
                         src="/assets/loading.svg"
                         alt="Loading..."
                         // className="w-5 h-5 animate-spin mr-2" // Added mr-2 for spacing if needed
                         style={{ width: "30px", height: "30px" }} // Ensure consistent size
                       />
                    
                   ) : (
                     <div onClick={handleLogin} className="my-6 bg-purple-500 text-white w-12 h-12 rounded-full flex items-center justify-center hover:bg-purple-800 ">
                     <img src="./assets/right-arrow.png" className="h-8 "></img>
                    </div>
                   )}
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
