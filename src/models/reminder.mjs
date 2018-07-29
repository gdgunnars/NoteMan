import mongoose from "mongoose";
import Note from "./note";

const reminderSchema = new mongoose.Schema({
    remindAt: {
        type: Date,
        required: true
    },
    seen: {
        type: Boolean,
        default: false
    },
    note: {
        type: mongoose.Schema.Types.ObjectId, ref: "Note"
    },

}, {
    timestamps: true
});

export default mongoose.model("Reminder", reminderSchema);

