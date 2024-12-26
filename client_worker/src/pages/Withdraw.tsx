import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import axios from "axios";
import { BACKEND_URL } from "../utils";

const Withdraw: React.FC = () => {
  const [balance, setBalance] = useState(0);
  const [isLoading, setLoading] = useState(false);
  useEffect(() => {
    updateBalance();
  }, []);

  const updateBalance = async () => {
    const response = await axios.get(`${BACKEND_URL}/v1/worker/balance`, {
      headers: {
        Authorization: localStorage.getItem("token"),
      },
      params: {
        address: localStorage.getItem("workerAddress"),
      },
    });
    console.log(response.data.balance);
    setBalance(Number(response.data.balance));
  };

  const handleWithdraw = async () => {
    try {
      setLoading(true);
      if (balance <= 0) {
        alert("Insufficient balance");
        setLoading(false);
        return;
      }
      const response = await axios.post(
        `${BACKEND_URL}/v1/worker/payout`,
        {},
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
          params: {
            address: localStorage.getItem("workerAddress"),
          },
        }
      );
      updateBalance();
      alert(`Payout Signature: ${response.data.signature}`)
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="flex items-center  min-h-screen bg-purple-900 flex-col justify-centre">
        <div className="w-11/12 max-w-md mt-16 bg-purple-300 rounded-md shadow-lg p-6">
          <p className="text-red-600 text-center text-sm mb-4">
            Funds may be temporarily locked until the transaction is verified.
            Processing times can vary depending on current blockchain traffic
            and other conditions. Thank you for your patience.
          </p>

          <div className="space-y-4">
            {isLoading ? (
              <div className="mt-6 w-full py-3   flex justify-center">
                <img
                  src="/assets/loading.svg"
                  alt="Loading..."
                  // className="w-5 h-5 animate-spin mr-2" // Added mr-2 for spacing if needed
                  style={{ width: "30px", height: "30px" }} // Ensure consistent size
                />
              </div>
            ) : (
              <button
                onClick={handleWithdraw}
                className="mt-6 w-full py-2 rounded-md bg-purple-800 text-white font-semibold hover:bg-purple-700 transition"
              >
                Withdraw Funds
              </button>
            )}

            <div className="bg-purple-600 text-white text-center py-2 rounded-md font-semibold">
              Current Balance: {balance / 1_000_000_000} SOL
            </div>

            {/* <input
              type="number"
              placeholder="Enter amount to withdraw"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-2 rounded-md bg-purple-200 text-purple-900 focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-purple-500"
            /> */}
          </div>

          <button
            onClick={updateBalance}
            className="mt-6 w-full py-2 rounded-md bg-purple-800 text-white font-semibold hover:bg-purple-700 transition"
          >
            Refresh Balance
          </button>
        </div>
        {/* Footer */}
        <p className="text-gray-300 mt-32 text-center   md:mx-auto md:max-w-6xl leading-relaxed">
          ClickMint empowers content creators and data enthusiasts to
          crowdsource valuable insights. Post tasks like thumbnail selection or
          dataset labeling, and let global workers earn micropayments by
          contributing their choices.
        </p>
      </div>
    </div>
  );
};

export default Withdraw;
