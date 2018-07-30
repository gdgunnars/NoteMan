
import Note from '../models/note';

export async function saveModel(data) {
  await data.validate();
  await data.save();
}

export async function fetchNotes(filter) {
  return Note.aggregate([
    {
      $match: filter,
    }, {
      $project: {
        note: '$note',
        files: { $size: { '$ifNull': ['$files', []] } },
        createdAt: '$createdAt',
        updatedAt: '$updatedAt',
      },
    },
  ]);
}

export async function search(searchPhrase) {
  return Note.aggregate([
    {
      $match: { $text: { $search: searchPhrase } },
    }, {
      $project: {
        note: '$note',
        files: { $size: { '$ifNull': ['$files', []] } },
        createdAt: '$createdAt',
        updatedAt: '$updatedAt',
      },
    },
  ]);
}

export async function getFilesForId(noteID) {
  const files = await Note.find({ _id: noteID }).select('files -_id');
  // mongoose.find returns an array of the arrays we where looking for.
  return files[0].files;
}

export async function removeNote(noteID) {
  return Note.findByIdAndRemove({ _id: noteID });
}

export async function findNoteById(noteID) {
  return Note.findById({ _id: noteID });
}
