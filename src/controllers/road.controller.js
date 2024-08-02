import { Road } from "../models/road.models.js";
import { TrafficUpdates } from "../models/trafficUpdates.models.js";
import { findShortestPath } from "../utils/shortestPath.js";

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

        const newTrafficUpdate = await TrafficUpdates.create({
            road_id: newRoad._id,
            timestamp: newRoad.createdAt,
            traffic_condition: traffic_condition,
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

    const updatedTraffic = await TrafficUpdates.create({
        road_id,
        timestamp,
        traffic_condition,
    });

    return res.status(201).json({
        success: true,
        message: "traffic conditions updated successfully",
        data: updatedTraffic,
    });
};

const getShortestPath = async (req, res) => {
    try {
        const { start_location_id, end_location_id } = req.query;
        const shortestPath = await findShortestPath(
            start_location_id,
            end_location_id
        );
        let time = 0;
        let distance = 0;
        let a = shortestPath[0];
        let b = shortestPath[1];
        let i = 1;
        while (i < shortestPath.length) {
            const road = await Road.findOne({
                start_location_id: a,
                end_location_id: b,
            });
            distance += road.distance;
            time += road.distance * road.traffic_condition;
            a = shortestPath[i];
            b = shortestPath[i + 1];
            i++;
        }

        return res.status(200).json({
            success: true,
            message: "path found successfully.",
            data: {
                path: shortestPath,
                total_distance: distance,
                estimated_time: time,
            },
        });
    } catch (error) {
        console.log("error finding path : ", error);
        return res.status(500).json({
            success: false,
            message: "internal server error",
        });
    }
};

const getTrafficCondition = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                success: false,
                message: "id not provided in params",
            });
        }

        const existingRoad = await Road.findById({ _id: id });

        if (!existingRoad) {
            return res.status(404).json({
                success: false,
                message: "road not found",
            });
        }

        const trafficConditions = await TrafficUpdates.find({ road_id: id });

        return res.status(200).json({
            success: true,
            message: "traffic conditions fetched successfully.",
            data: trafficConditions,
        });
    } catch (error) {
        console.log("error fetching conditions : ", error);
        return res.status(500).json({
            success: false,
            message: "internal server error",
        });
    }
};

export {
    addRoad,
    updateTrafficCondition,
    getShortestPath,
    getTrafficCondition,
};
