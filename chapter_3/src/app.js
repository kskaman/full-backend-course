import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import authRouter from "./controllers/authRoutes.js";
import todosRouter from "./controllers/todoRoutes.js";
import authMiddleware from "./middleware/authMiddleware.js";

const app = express();

// Set up __dirname for ES modules

/*
 * import.meta.url is a property that contains
 * the URL of the current module. It’s similar
 * to the CommonJS __filename variable, but in
 * ES modules you must use import.meta.url along
 * with fileURLToPath (from the url module) and
 * path.dirname (from the path module) to derive
 * the directory name for the current module. This
 * is especially useful when you need to build
 * file paths relative to your module's location.
 */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serves the html file from /public directory
// tells express to serve all files from public
// folder as static files

app.use(express.static(path.join(__dirname, "../public")));
app.use(express.json());

// Serve the index.html file for the root route
app.get("/", (req, res) => {
  res.status(200).sendFile(path.join(__dirname, "public", "index.html"));
});

// Routes
app.use("/auth", authRouter);
app.use("/todos", authMiddleware, todosRouter);

// Catch-all route for handling 404 errors
app.use((req, res) => {
  res.status(404).send("Error 404: Resource not found.");
});

export default app;
