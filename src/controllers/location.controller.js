import { Location } from "../models/location.models";

const addLocation = async (req, res) => {
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
        success:true,
        message:"location created",
        
    })
};
