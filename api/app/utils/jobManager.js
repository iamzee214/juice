// In a new file or in a suitable place in your backend code
import { v4 as uuidv4 } from "uuid";

const jobs = {}; // This will store the job status and results

function createJob() {
  const newJobId = uuidv4();
  jobs[newJobId] = { status: "pending", result: null };
  return newJobId;
}

function setJobResult(jobId, result) {
  if (jobs[jobId]) {
    jobs[jobId] = { status: "completed", result };
  }
}

function getJobStatus(jobId) {
  return jobs[jobId] || null;
}

export { createJob, setJobResult, getJobStatus };
