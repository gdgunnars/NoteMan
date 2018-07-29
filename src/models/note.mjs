import mongoose from "mongoose";

/**
 * @typedef Note
 * @property {string} note.required - Text value of the note
 * @property {Array.<File>} files
 */
const NoteSchema = new mongoose.Schema({
    note: {
        type: String,
        required: true,
        trim: true
    },
    files: [
        {
            name: String,
            data: Buffer,
            contentType: String
        }
    ]
}, {
    timestamps: true
});

NoteSchema.index({
    "note": "text",
    "files.name": "text"
}, {
    weights: {
        "note": 3,
        "files.name": 1
    }
});

/**
 * @typedef File
 * @property {string} name.required - name of document
 * @property {Buffer} data.required - file data stored as Buffer
 * @property {string} contentType - mimeType of the file
 */

export default mongoose.model("Note", NoteSchema);