import express from "express";
import prisma from "../prismaClient.js";

const todosRouter = express.Router();

// GET all todos for logged-in user
todosRouter.get("/", async (req, res) => {
  const todos = await prisma.todo.findMany({
    where: {
      userId: req.userId,
    },
  });
  res.json(todos);
});

// POST - create a new todo
todosRouter.post("/", async (req, res) => {
  const { task } = req.body;

  const todo = await prisma.todo.create({
    data: {
      task,
      userId: req.userId,
    },
  });
  res.status(201).json(todo);
});

// PUT - update a todo
todosRouter.put("/:id", async (req, res) => {
  const { completed } = req.body;
  const { id } = req.params;

  const todo = await prisma.todo.findFirst({
    where: {
      id: parseInt(id),
      userId: req.userId,
    },
  });

  if (!todo) {
    return res.status(404).json({ message: "Todo not found" });
  }

  const updatedTodo = await prisma.todo.update({
    where: { id: todo.id },
    data: {
      completed: !!completed,
    },
  });

  res.status(200).json(updatedTodo);
});

// DELETE - delete a todo
todosRouter.delete("/:id", async (req, res) => {
  const { id } = req.params;

  const todo = await prisma.todo.findFirst({
    where: {
      id: parseInt(id),
      userId: req.userId,
    },
  });

  if (!todo) {
    return res.status(404).json({ message: "Todo not found" });
  }

  await prisma.todo.delete({
    where: { id: todo.id },
  });

  res.status(204).end();
});

export default todosRouter;
