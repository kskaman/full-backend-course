import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import db from "../db.js";

const authRouter = express.Router();

// POST /auth/register/ - register a new user
authRouter.post("/register", (req, res) => {
  const { username, password } = req.body;

  // Encrypt the password
  const passwordHash = bcrypt.hashSync(password, 10);

  try {
    // Insert the new user into the database
    const insertUser = db.prepare(`
      INSERT INTO 
        users (username, password) 
      VALUES (?, ?)
    `);
    const result = insertUser.run(username, passwordHash);

    // Add a default todo for the new user
    const defaultTodo = `Hello :) Add your first todo!`;
    const insertTodo = db.prepare(`
      INSERT INTO
        todos (user_id, task)
      VALUES (?, ?)
    `);
    insertTodo.run(result.lastInsertRowid, defaultTodo);

    // Create a token for immediate authentication
    const token = jwt.sign(
      { id: result.lastInsertRowid },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.status(201).json({ token });
  } catch (error) {
    console.error(error.message);
    res.status(503).end();
  }
});

// POST /auth/login - login an existing user
authRouter.post("/login", (req, res) => {
  const { username, password } = req.body;
  try {
    // Find the user in the database
    const getUser = db.prepare(`SELECT * FROM users WHERE username = ?`);
    const user = getUser.get(username);

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
    return res.status(200).json({ token });
  } catch (error) {
    console.error(error.message);
    res.status(503).end();
  }
});

export default authRouter;
