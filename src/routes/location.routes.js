import { Router } from "express";
import { addLocation } from "../controllers/location.controller.js";

const locationRouter=Router()

locationRouter.route("/").post(addLocation)

export default locationRouter;