import dotenv from "dotenv";
import { dbConnect } from "./db/db.connection.js";
import { DB_NAME } from "./src/constants.js";
dotenv.config();
import App from "./src/app.js";
const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT || 8000;
await dbConnect(MONGO_URI, DB_NAME);
App.listen(PORT, () => {
  console.log(" Listening to PORT: ", PORT);
});
