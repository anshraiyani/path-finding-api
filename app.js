import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectToDB from "./src/db/index.js";

dotenv.config({
    path: "./.env",
});

const app = express();

app.use(cors());
app.use(express.json());

connectToDB()
    .then(() => {
        app.listen(process.env.PORT || 8000, () => {
            console.log("SERVER RUNNING ON PORT:", process.env.PORT);
        });
    })
    .catch((err) => {
        console.log("MONGODB CONNECTION FAILED: ", err);
    });
