import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

interface Task {
  _id: string;
  title: string;
  task_owner_address: string;
  options: string[];
  signature: string;
  amount: number;
  total_submissions: number;
  done: boolean;
  createdAt: string;
  __v: number;
  submission: string;
}



export default  function Home  ()  {
  const [task, setTask] = useState<Task | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  // Fetch Task on Component Mount
  const fetchTask = async () => {
   // console.log(`${import.meta.env.VITE_BACKEND_URL}/v1/worker/nextTask`);
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/v1/worker/nextTask`,{
        headers: {
          Authorization : localStorage.getItem("token")},
          params : {
            address : localStorage.getItem("workerAddress")
          }
      });
      setTask(response.data);
   //   console.log(response.data);
    } catch (error) {
      console.error("Error fetching task:", error);
      setMessage("Failed to load task.");
      setTask(null);
    }
  };

  useEffect(() => {
    fetchTask();
  }, []);

  // Handle Submit
  const handleSubmit = async () => {
    if (selectedOption === null || !task) {
      setMessage("Please select an option before submitting.");
      return;
    }

    try {
      setLoading(true);
      const submissionData = {
        address: localStorage.getItem("workerAddress"),
        taskId: task._id,
        votedOption: selectedOption,
      };

      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/v1/worker/submit`, submissionData,{
        headers: {
        Authorization : localStorage.getItem("token")
        }
      });
      setMessage("Task submitted successfully!");
      fetchTask();
      setSelectedOption(null);
    } catch (error) {
      console.error("Submission error:", error);
      setMessage("Failed to submit task.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="flex flex-col items-center justify-center py-14 bg-gray-900 text-white">
        <div className="w-full max-w-4xl p-6 bg-gray-800 rounded-lg shadow-md">
          {/* Task Title or No Task Message */}
          <h1 className="text-2xl font-bold mb-4 text-center">
            {task ? task.title : "No Task Available"}
          </h1>

          {task ? (
            // Render task options if task exists
            <div className="grid grid-cols-2 gap-4 mb-4">
              {task.options.map((url, index) => (
                <div
                  key={index}
                  className={`p-1 rounded-lg cursor-pointer ${
                    selectedOption === index
                      ? "ring-4 ring-purple-500"
                      : "ring-2 ring-gray-700"
                  }`}
                  onClick={() => setSelectedOption(index)}
                >
                  <img
                    src={url}
                    alt={`Option ${index + 1}`}
                    className="w-full h-40 object-cover rounded-lg"
                  />
                </div>
              ))}
            </div>
          ) : (
            // Show this if no task is available
            <p className="text-lg text-center text-gray-400">
              Please check back later for new tasks.
            </p>
          )}

          {/* Submit Button */}
          {task && (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className={`w-full py-2 rounded-lg font-bold text-white ${
                loading
                  ? "bg-purple-600 cursor-not-allowed"
                  : "bg-purple-500 hover:bg-purple-600"
              }`}
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          )}

          {/* Message */}
          {message && (
            <div className="mt-4 text-center text-lg font-semibold text-green-400">
              {message}
            </div>
          )}
        </div>

        {/* Footer */}
        <p className="text-gray-300 text-center mt-8 mx-2 md:mx-auto md:max-w-6xl leading-relaxed">
          ClickMint empowers content creators and data enthusiasts to
          crowdsource valuable insights. Post tasks like thumbnail selection or
          dataset labeling, and let global workers earn micropayments by
          contributing their choices.
        </p>
      </div>
    </div>
  );
};