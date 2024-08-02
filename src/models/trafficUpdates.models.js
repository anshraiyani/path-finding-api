import mongoose, { Schema } from "mongoose";

const TrafficUpdatesSchema = new Schema(
    {
        road_id: {
            type: Schema.Types.ObjectId,
            ref: "Road",
            required: true,
        },
        timestamp: {
            type: String,
            required: true,
        },
        traffic_condition: {
            type: String,
            enum: ["clear", "moderate", "heavy"],
            required: true,
        },
    },
    { timestamps: true }
);

export const TrafficUpdates = mongoose.model(
    "TrafficUpdates",
    TrafficUpdatesSchema
);
