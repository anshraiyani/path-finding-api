import { Location } from "../models/location.models.js";

const addLocation = async (req, res) => {
    try {
        const { name, latitude, longitude } = req.body;

        if (!name || !latitude || !longitude) {
            return res.status(400).json({
                success: false,
                message: " name, latitude, longitude are required.",
            });
        }

        const newLocation = await Location.create({
            name,
            latitude,
            longitude,
        });

        return res.status(201).json({
            success: true,
            message: "location created",
            location: newLocation,
        });
    } catch (error) {
        console.log("error adding a location : ", error);
        return res.status(500).json({
            success: false,
            message: "internal server error",
        });
    }
};

export { addLocation };
