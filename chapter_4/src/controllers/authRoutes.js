import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import prisma from "../prismaClient.js";

const authRouter = express.Router();

// POST /auth/register - register a new user
authRouter.post("/register", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Encrypt the password
    const passwordHash = bcrypt.hashSync(password, 10);

    const user = await prisma.user.create({
      data: {
        username,
        password: passwordHash,
      },
    });

    // Add a default todo for the new user
    const defaultTodo = "Hello :) Add your first todo!";
    await prisma.todo.create({
      // <-- Add await here
      data: {
        task: defaultTodo,
        userId: user.id,
      },
    });

    // Create a token for immediate authentication
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    res.status(201).json({ token });
  } catch (error) {
    console.error(error.message);
    res.status(503).end();
  }
});

// POST /auth/login - login an existing user
authRouter.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find the user in the database
    const user = await prisma.user.findUnique({
      where: {
        username: username,
      },
    });

    // If the user is not found, return a 404 error
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Compare the provided password with the stored hash
    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // Generate a token for the authenticated user
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    res.status(200).json({ token });
  } catch (error) {
    console.error(error.message);
    res.status(503).end();
  }
});

export default authRouter;
