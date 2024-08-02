import { Road } from "../models/road.models.js";

const addRoad = async (req, res) => {
    try {
        const {
            start_location_id,
            end_location_id,
            distance,
            traffic_condition,
        } = req.body;

        if (
            !start_location_id ||
            !end_location_id ||
            !distance ||
            !traffic_condition
        ) {
            return res.status(400).json({
                success: false,
                message:
                    " start_location_id, end_location_id, distance, traffic_condition are required.",
            });
        }

        let numbered_traffic_condition = 1;

        switch (traffic_condition) {
            case "clear": {
                numbered_traffic_condition = 1;
                break;
            }
            case "moderate": {
                numbered_traffic_condition = 5;
                break;
            }
            case "heavy": {
                numbered_traffic_condition = 10;
                break;
            }
            default: {
                return res.status(400).json({
                    success: false,
                    message:
                        "invalid traffic condition. must be clear, moderate or heavy",
                });
            }
        }

        const newRoad = await Road.create({
            start_location_id,
            end_location_id,
            distance,
            traffic_condition: numbered_traffic_condition,
        });

        return res.status(201).json({
            success: true,
            message: "road created",
            location: newRoad,
        });
    } catch (error) {
        console.log("error adding a road : ", error);
        return res.status(500).json({
            success: false,
            message: "internal server error",
        });
    }
};

const updateTrafficCondition = async (req, res) => {
    const { road_id, timestamp, traffic_condition } = req.body;

    if (!road_id || !timestamp || !traffic_condition) {
        return res.status(400).json({
            success: false,
            message: "road_id, timestamp, traffic_condition are required",
        });
    }

    const existingRoad = await Road.findById({ _id: road_id });

    if (!existingRoad) {
        return res.status(404).json({
            success: false,
            message: "road not found",
        });
    }

    let numbered_traffic_condition = 1;

    switch (traffic_condition) {
        case "clear": {
            numbered_traffic_condition = 1;
            break;
        }
        case "moderate": {
            numbered_traffic_condition = 5;
            break;
        }
        case "heavy": {
            numbered_traffic_condition = 10;
            break;
        }
        default: {
            return res.status(400).json({
                success: false,
                message:
                    "invalid traffic condition. must be clear, moderate or heavy",
            });
        }
    }

    existingRoad.updatedAt = timestamp;
    existingRoad.traffic_condition = numbered_traffic_condition;

    await existingRoad.save();

    return res.status(201).json({
        success: true,
        message: "traffic conditions updated successfully",
        data: existingRoad,
    });
};

const getShortestPath = async (req, res) => {
    const { start_location_id, end_location_id } = req.query;
    
};

export { addRoad, updateTrafficCondition };
