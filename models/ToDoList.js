const mongoose = require('mongoose');
const { Schema } = mongoose;

const toDoSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  isCompleted: { type: Boolean, default: false }, // Changed to Boolean with default
  completedOn: { type: Date }, // Changed to Date type
  createdBy: {
    ref: "User",
    type: mongoose.Schema.Types.ObjectId,
    required: true // Added required to ensure every task has an owner
  }
}, {
  timestamps: true
});

const ToDo = mongoose.model("ToDo", toDoSchema);
module.exports = ToDo;