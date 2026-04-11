const ToDo = require("../models/ToDoList");

exports.createToDo = async (req, res) => {
  try {
    const { title, description, userId } = req.body;

    const todo = new ToDo({
      title,
      description,
      createdBy: userId 
    });

    const result = await todo.save();
    res.status(201).send({ message: "Created New Task!", data: result });
  } catch (err) {
    console.error("Create Task Error:", err);
    res.status(500).send({ error: err.message });
  }
};

exports.getAllToDo = async (req, res) => {
  const { userId } = req.params;
  try {
    const result = await ToDo.find({ createdBy: userId });
    res.send(result);
  } catch (err) {
    res.status(400).send(err);
  }
};

exports.updateToDo = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const result = await ToDo.findByIdAndUpdate(id, { $set: data }, { returnOriginal: false });
    res.send({ message: 'ToDo list Updated!', data: result });
  } catch (err) {
    res.status(400).send(err);
  }
};

exports.deleteToDo = async (req, res) => {
  try {
    const { id } = req.params;
    await ToDo.findByIdAndDelete(id);
    res.send({ message: "ToDo Task Deleted" });
  } catch (err) {
    res.status(400).send(err);
  }
};