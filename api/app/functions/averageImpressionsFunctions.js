import AverageImpressions from "../../models/averageImpressions.js";

async function createAverageImpressions(query) {
  return await AverageImpressions.create(query);
}

async function getAverageImpressions(query) {
  return await AverageImpressions.find(query);
}

async function getAverageImpressionsAggregate(query) {
  return await AverageImpressions.aggregate(query);
}

async function updateAverageImpressions(find, query) {
  return await AverageImpressions.findOneAndUpdate(find, query);
}

async function getAverageImpressionsCount(query) {
  return await AverageImpressions.count(query).exec();
}
export {
  createAverageImpressions,
  getAverageImpressions,
  updateAverageImpressions,
  getAverageImpressionsAggregate,
  getAverageImpressionsCount,
};
