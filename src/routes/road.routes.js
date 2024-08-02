import { Router } from "express";
import {
    addRoad,
    getShortestPath,
    getTrafficCondition,
    updateTrafficCondition,
} from "../controllers/road.controller.js";

const roadRouter = Router();

roadRouter.route("/").post(addRoad);
roadRouter.route("/traffic-updates").post(updateTrafficCondition);
roadRouter.route("/:id/traffic-condition").get(getTrafficCondition);
roadRouter.route("/shortest-path").get(getShortestPath);

export default roadRouter;
