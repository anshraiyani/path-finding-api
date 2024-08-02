import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectToDB from "./src/db/index.js";
import locationRouter from "./src/routes/location.routes.js";
import roadRouter from "./src/routes/road.routes.js";

dotenv.config({
    path: "./.env",
});

const app = express();

app.use(cors());
app.use(express.json());

app.use("/location", locationRouter);
app.use("/roads", roadRouter);

app.get("/", (req, res) => {
    return res.status(200).json({
        status: 200,
        topic: "health check",
        data: "Ok",
        uptime: process.uptime(),
        date: new Date(),
    });
});

connectToDB()
    .then(() => {
        app.listen(process.env.PORT || 8000, () => {
            console.log("SERVER RUNNING ON PORT:", process.env.PORT);
        });
    })
    .catch((err) => {
        console.log("MONGODB CONNECTION FAILED: ", err);
    });
