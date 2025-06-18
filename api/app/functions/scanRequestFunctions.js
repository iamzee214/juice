import ScanRequests from "../../models/scanRequests.js";

async function createScanRequest(query) {
  return await ScanRequests.create(query);
}

async function getScanRequests(query) {
  return await ScanRequests.find(query);
}

async function getScanRequestsAggregate(query) {
  return await ScanRequests.aggregate(query);
}

async function updateScanRequests(find, query) {
  return await ScanRequests.findOneAndUpdate(find, query);
}

async function getScanRequestCount(query) {
  return await ScanRequests.count(query).exec();
}
export {
  createScanRequest,
  getScanRequests,
  updateScanRequests,
  getScanRequestCount,
  getScanRequestsAggregate,
};
