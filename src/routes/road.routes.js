import { Router } from "express";
import {
    addRoad,
    updateTrafficCondition,
} from "../controllers/road.controller.js";

const roadRouter = Router();

roadRouter.route("/").post(addRoad);
roadRouter.route("/traffic-updates").post(updateTrafficCondition);

export default roadRouter;
