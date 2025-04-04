import { config } from "dotenv";
config(); // Loads environment variables from .env

import app from "./app.js";

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
