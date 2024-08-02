import mongoose, { Schema } from "mongoose";

const LocationSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    latitude: {
        type: Number,
        required: true,
    },
    longitude: {
        type: Number,
        required: true,
    },
});

export const Location = mongoose.model("Location", LocationSchema);
