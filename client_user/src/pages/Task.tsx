import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { BACKEND_URL } from "../utils";
import { useUserStore } from "../store";

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
  submission?: {
    _id: string;
    task_id: string;
    voted_option: number[];
  };
}

const AllTasks: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    // Fetch tasks from backend
    const fetchTasks = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/v1/user/taskvotes`, {
          params: {
            address: useUserStore.getState().address,
          },
          headers: {
            Authorization: localStorage.getItem("token"), // Add token if required
          },
        });
        //  console.log("API Response:", response.data); // Log the response
        setTasks(response.data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, []);

  // Function to calculate total votes
  const calculateTotalVotes = (votes: number[]) => {
    // console.log(votes);
    return votes.reduce((sum, count) => sum + count, 0);
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />

      <div className="max-w-7xl mx-auto p-4">
        <h1 className="text-2xl font-bold text-gray-200 mb-6">Your Tasks</h1>

        {tasks.length === 0 ? (
          <p className="text-gray-200 text-center">No tasks available.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {tasks.map((task) => {
              // console.log(task.submission);
              const totalVotes = task.submission
                ? calculateTotalVotes(task.submission.voted_option)
                : 0;

              return (
                <div
                  key={task._id}
                  className="bg-slate-200 shadow-md rounded-lg p-4 border hover:shadow-lg transition-shadow duration-300"
                >
                  {/* Task Title */}
                  <h2 className="text-lg font-semibold text-gray-800 mb-2">
                    {task.title}
                  </h2>

                  {/* Render Task Options */}
                  <div className="grid grid-cols-2 gap-4">
                    {task.options.map((option, index) => {
                      //  console.log(index);
                      const votes = task.submission?.voted_option[index] || 0;
                      const percentage = totalVotes
                        ? ((votes / totalVotes) * 100).toFixed(2)
                        : "0.00";

                      return (
                        <div key={index} className="relative">
                          <img
                            src={option}
                            alt={`Option ${index + 1}`}
                            className="w-full h-28 object-cover rounded-md"
                          />
                          <div className="mt-2 text-gray-950 text-sm">
                            <div className="w-full my-2 bg-gray-300 rounded-full h-2 overflow-hidden">
                              <div
                                className="bg-purple-500 h-full"
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                            <p>
                              <span className="font-medium">Votes:</span>{" "}
                              {votes}
                            </p>
                            <p>
                              <span className="font-medium">Percentage:</span>{" "}
                              {percentage}%
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Task Details */}
                  <div className="text-sm text-gray-600 mt-4">
                    <p>
                      <span className="font-medium">Owner:</span>{" "}
                      {task.task_owner_address}
                    </p>
                    <p>
                      <span className="font-medium">Amount:</span>{" "}
                      {(task.total_submissions * 2500000) / 1_000_000_000} SOL
                    </p>
                    <p>
                      <span className="font-medium">
                        Remaining Submissions:
                      </span>{" "}
                      {task.total_submissions - totalVotes}
                    </p>
                    <p>
                      <span className="font-medium">Total Submissions:</span>{" "}
                      {task.total_submissions}
                    </p>
                    <p>
                      <span className="font-medium">Status:</span>{" "}
                      {task.done ? (
                        <span className="text-green-500 font-semibold">
                          Done
                        </span>
                      ) : (
                        <span className="text-red-500 font-semibold">
                          Pending
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllTasks;
