const mongoose = require('mongoose');

const missionLogSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now, index: true },
  time: { type: String, required: true },
  message: { type: String, required: true, trim: true },
  type: { type: String, required: true, uppercase: true, trim: true },
  scenario: { type: String, default: 'normal', trim: true },
  battery: { type: Number, min: 0, max: 100 },
  target: { type: String, default: '07', trim: true },
}, { versionKey: false });

const MissionLog = mongoose.model('MissionLog', missionLogSchema);

async function getMissionLogs(limit = 20) {
  return MissionLog.find().sort({ timestamp: -1 }).limit(limit).lean();
}

async function addMissionLog(log) {
  return MissionLog.create(log);
}

module.exports = { getMissionLogs, addMissionLog };
