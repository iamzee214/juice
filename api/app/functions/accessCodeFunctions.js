import AccessCode from "../../models/accessCode.js";

async function createAccessCode(query) {
  return await AccessCode.create(query);
}

async function getAccessCode(query) {
  return await AccessCode.find(query);
}

async function getAccessCodeAggregate(query) {
  return await AccessCode.aggregate(query);
}

async function updateAccessCode(find, query) {
  return await AccessCode.findOneAndUpdate(find, query);
}

async function getAccessCodeCount(query) {
  return await AccessCode.count(query).exec();
}
export {
  createAccessCode,
  getAccessCode,
  updateAccessCode,
  getAccessCodeAggregate,
  getAccessCodeCount,
};
