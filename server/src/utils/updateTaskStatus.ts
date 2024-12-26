import Task from "../models/Task";



export default async function updateTaskStatus(taskId: string): Promise<void> {
  try {
    const task = await Task.findById(taskId).populate({
      path: "submission",
      select: "voted_option", 
    });

    if (!task || !task.submission) {
      console.error("Task or submission not found.");
      return;
    }

    // Use "unknown" as an intermediate step for type assertion
    const submission = task.submission as unknown as { voted_option: number[] };

   
    const total_votes = submission.voted_option.reduce((sum, count) => sum + count, 0);

    if (task.total_submissions === total_votes) {
      task.done = true;
      await task.save();
    }
  } catch (error) {
    console.error("Error updating task status:", error);
  }
}
