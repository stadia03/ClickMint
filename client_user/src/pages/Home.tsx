import React, { useState } from "react";
import Upload from "../components/Upload";
import Navbar from "../components/Navbar";
import axios, { AxiosError } from "axios";
import {
  ADMIN_WALLET_PUBLICKEY,
  BACKEND_URL,
  CHARGE_PER_CLICK,
} from "../utils";
import { useUserStore } from "../store";
import {
  Connection,
  LAMPORTS_PER_SOL,
  PublicKey,
  SendTransactionError,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";

const Home: React.FC = () => {
  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);
  const [total_submissions, set_total_submissions] = useState(0);
  const [isLoading, setLoading] = useState(false);

  const handleUploadComplete = (url: string) => {
    setUploadedUrls((prevUrls) => [...prevUrls, url]); // Add new URL to the array
    // console.log(uploadedUrls);
  };

  const validateInputs = (): boolean => {
    const title = (
      document.getElementById("title") as HTMLInputElement
    ).value.trim();
    if (!title) {
      alert("Please provide a title for the task.");
      return false;
    }
    if (uploadedUrls.length < 2) {
      alert("Please upload at least two file.");
      return false;
    }
    if (total_submissions <= 0) {
      alert("Please enter a valid number of submissions.");
      return false;
    }
    return true;
  };

  const handlePublish = async () => {
    setLoading(true);

    if (!validateInputs()) {
      setLoading(false);
      return;}
    console.log()
    const transaction_signature = await sendTnx();
    if (!transaction_signature) {
      alert("Transaction failed");
      setLoading(false);
      return;
    }
    console.log(transaction_signature);
   
    try {


      const response = await axios.post(
        `${BACKEND_URL}/v1/user/task`,
        {
          title: (document.getElementById("title") as HTMLInputElement).value,
          address: useUserStore.getState().address,
          options: uploadedUrls,
          signature: transaction_signature,
          total_submissions: total_submissions,
        },
        {
          
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      await axios.get(
        `${BACKEND_URL}/`,
       
        {
          params : {signature : transaction_signature},
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      alert("Task has been published!");
      setLoading(false);
      return;
    } catch (err ) {
      setLoading(false);
      if (err instanceof AxiosError) {
        
        if (err.response && err.response.data && err.response.data.error) {
          alert(err.response.data.error);  
        } else {
          alert("Error publishing task!");  
        }
      } else {
        
        alert("An unexpected error occurred!");
      }
      
    }
  };

  const sendTnx = async (): Promise<String> => {
    try {
      const transaction = new Transaction();
      transaction.add(
        SystemProgram.transfer({
          fromPubkey: publicKey as PublicKey,
          toPubkey: new PublicKey(ADMIN_WALLET_PUBLICKEY),
          lamports: total_submissions * CHARGE_PER_CLICK ,
        })
      );
      const response = await sendTransaction(transaction, connection);
     // console.log(response);
      return response;
    } catch (err) {
      console.log(err);
      return "";
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <Navbar />

      {/* Main Container */}
      <div className="bg-[#E6D9FF] p-6 rounded-lg mx-4 mt-6 md:mx-auto md:max-w-2xl shadow-lg">
        <h2 className="text-xl font-bold text-center text-gray-800 mb-4">
          Create Task
        </h2>

        {/* Task Content */}
        <div className="bg-[#9C27E9] p-4 rounded-lg">
          {/* Input Field */}
          <input
            type="text"
            placeholder="Title"
            id="title"
            className="text-black w-full p-2 mb-4 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
          <input
            type="text"
            placeholder="Total Submissions"
            id="submissions"
            onChange={(e) => {
              set_total_submissions(parseInt(e.target.value));
            }}
            className="text-black w-full p-2 mb-4 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
          <div className="text-slate-200 flex justify-center mb-2">
            {total_submissions > 0 ? (
              <p>
                You will be charged {(total_submissions * CHARGE_PER_CLICK)/LAMPORTS_PER_SOL} SOL +
                gas fee.
              </p>
            ) : (
              ""
            )}
          </div>

          {/* Render Upload Component */}
          <Upload onUploadComplete={handleUploadComplete} />
           
          {/* Uploaded Images */}
          <div className="mt-6 grid grid-cols-2 gap-4">
            {uploadedUrls.map((url, index) => (
              <img
                key={index}
                src={url}
                alt={`Uploaded file ${index + 1}`}
                className="w-full h-24 object-cover rounded-lg shadow-md"
              />
            ))}
          </div>
        </div>

        {/* Publish Button */}
        <div className=" flex justify-center gap-4">
        <button
              onClick={()=>{
                setUploadedUrls([]);
              }}
              className="w-full mt-6 bg-purple-900 hover:bg-purple-950 text-white font-semibold py-2 rounded transition duration-300"
            >
              Clear
            </button>
          {isLoading ? (
            <div className="mt-6 w-full flex justify-center">
              <img
                src="/assets/loading.svg"
                alt="Loading..."
                // className="" // Added mr-2 for spacing if needed
                style={{ width: "30px", height: "30px" }} // Ensure consistent size
              />
            </div>
          ) : (
            <button
            onClick={handlePublish}
            className="w-full mt-6 bg-purple-900 hover:bg-purple-950 text-white font-semibold py-2 rounded transition duration-300"
          >
            Publish
          </button>
            
          )}
        
        </div>
      </div>

      {/* Description */}
      <p className="text-gray-700 text-center mt-8 mx-4 md:mx-auto md:max-w-4xl leading-relaxed">
        ClickMint empowers content creators and data enthusiasts to crowdsource
        valuable insights. Post tasks like thumbnail selection or dataset
        labeling, and let global workers earn micropayments by contributing
        their choices.
      </p>
    </div>
  );
};

export default Home;
