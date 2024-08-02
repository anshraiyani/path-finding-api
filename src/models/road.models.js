import mongoose, { Schema } from "mongoose";

const RoadSchema = new Schema(
    {
        start_location_id: {
            type: Schema.Types.ObjectId,
            ref: "Location",
            required: true,
        },
        end_location_id: {
            type: Schema.Types.ObjectId,
            ref: "Location",
            required: true,
        },
        distance: {
            type: Number,
            required: true,
        },
        traffic_condition: {
            type: Number,
            enum: [1, 5, 10],
            required: true,
        },
    },
    { timestamps: true }
);

export const Road = mongoose.model("Road", RoadSchema);
