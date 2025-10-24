const mongoose = require('mongoose');

const roadmapSchema = new mongoose.Schema({
  role: { type: String, required: true }, // e.g., "Data Scientist"
  items: [
    {
      title: String,
      type: String,    // "Course", "Project", "Milestone"
      status: String,  // "Completed", "In Progress", "Up Next"
      color: String    // optional: "green", "blue", "gray"
    }
  ]
});

module.exports = mongoose.model('Roadmap', roadmapSchema);