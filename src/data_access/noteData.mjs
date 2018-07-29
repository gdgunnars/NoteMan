
import Note from "../models/note";

export async function saveModel(model) {
    await model.validate();
    await model.save();
    return;
}

export async function fetchNotes(filter) {
    return await Note.aggregate([
        { $match: filter },
        { $project: {
            note: '$note',
            files: { $size: { "$ifNull": [ "$files", [] ]}},
            createdAt: '$createdAt',
            updatedAt: '$updatedAt'
        }}
    ]);
}

export async function search(searchPhrase) {
    return await Note.aggregate([
        { $match: {
            $text: { $search : searchPhrase } }
        },
        { $project: {
            note: '$note',
            files: { $size: { "$ifNull": [ "$files", [] ]}},
            createdAt: '$createdAt',
            updatedAt: '$updatedAt'
        }}
    ]);
}

export async function getFilesForId(noteID) {
    const files = await Note.find({_id: noteID}).select("files -_id");
    // mongoose.find returns an array of the arrays we where looking for.
    return files[0].files;
}

export async function removeNote(noteID) {
    return await Note.findByIdAndRemove({_id : noteID});
}

export async function findById(noteID) {
    return await Note.findById({_id: noteID});
}