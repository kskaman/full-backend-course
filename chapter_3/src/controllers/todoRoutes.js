import express from "express";
import db from "../db.js";

const todosRouter = express.Router();

// GET all todos for logged in user
todosRouter.get("/", (req, res) => {
  const getTodos = db.prepare(`SELECT * FROM todos WHERE user_id = ?`);
  const todos = getTodos.all(req.userId);
  res.json(todos);
});

// POST - create a new todo
todosRouter.post("/", (req, res) => {
  const { task } = req.body;
  const insertTodo = db.prepare(`
    INSERT INTO todos (user_id, task)
    VALUES (?, ?)
  `);
  const result = insertTodo.run(req.userId, task);

  res.status(201).json({ id: result.lastInsertRowid, task, completed: 0 });
});

// PUT - update a todo
todosRouter.put("/:id", (req, res) => {
  const { completed } = req.body;
  const { id } = req.params;

  const updateTodo = db.prepare(`
    UPDATE todos 
    SET completed = ?
    WHERE id = ?
  `);

  updateTodo.run(completed, id);

  res.status(200).json({ message: "Todo updated" });
});

// DELETE - delete a todo
todosRouter.delete("/:id", (req, res) => {
  const { id } = req.params;
  const userId = req.userId;

  const deleteTodo = db.prepare(`
    DELETE FROM todos
    WHERE id = ? AND user_id = ?
  `);
  deleteTodo.run(id, userId);

  res.status(204).end();
});

export default todosRouter;
