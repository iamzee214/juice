import AirdropPointsEntry from "../../models/airdropPointsEntry.js";

async function createAirdropPointsEntry(query) {
  return await AirdropPointsEntry.create(query);
}

async function getAirdropPointsEntry(query) {
  return await AirdropPointsEntry.find(query);
}

async function getAirdropPointsEntryAggregate(query) {
  return await AirdropPointsEntry.aggregate(query);
}

async function updateAirdropPointsEntry(find, query) {
  return await AirdropPointsEntry.findOneAndUpdate(find, query);
}

async function getAirdropPointsEntryCount(query) {
  return await AirdropPointsEntry.count(query).exec();
}
export {
  createAirdropPointsEntry,
  getAirdropPointsEntry,
  updateAirdropPointsEntry,
  getAirdropPointsEntryAggregate,
  getAirdropPointsEntryCount,
};
