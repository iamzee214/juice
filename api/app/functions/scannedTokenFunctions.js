import ScannedTokens from "../../models/scannedTokens.js";

async function createScannedTokens(query) {
  return await ScannedTokens.create(query);
}

async function getScannedTokens(query) {
  return await ScannedTokens.find(query);
}

async function getScannedTokensAggregate(query) {
  return await ScannedTokens.aggregate(query);
}

async function updateScannedTokens(find, query) {
  return await ScannedTokens.findOneAndUpdate(find, query);
}

async function getScannedTokensCount(query) {
  return await ScannedTokens.count(query).exec();
}
export {
  createScannedTokens,
  getScannedTokens,
  updateScannedTokens,
  getScannedTokensAggregate,
  getScannedTokensCount,
};
