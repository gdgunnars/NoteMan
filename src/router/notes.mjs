import Router from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import Note from '../models/note';
import { fetchNotes, search, getFilesForId, removeNote, saveModel,
  findNoteById } from '../data_access/noteData';
import { fetchRemindersForNote } from '../data_access/reminderData';

const upload = multer();
const noteRouter = new Router();


/**
 * This function returns all notes, if search query is provided a full-text
 * search is made on all notes.
 * @route GET /notes
 * @group Notes - Operations for Creating/Reading/Updating & Removing Notes
 * @param {string} search.query - keyword for full text search
 * @returns {object} 200 - An array of Notes without files
 * @returns {object}  500 - Error talking to database.
 */
noteRouter.get('/', async (req, res) => {
  try {
    if (Object.keys(req.query).length > 0 && req.query.search) {
      const searchResults = await search(req.query.search);
      res.json(searchResults);
    } else {
      const notes = await fetchNotes({});
      res.json({ notes });
    }
  } catch (error) {
    console.log('error in /notes :', error);
    res.status(500).json({ error: 'Database Error' });
  }
});


/**
 * This function returns note with given ID, this does not include files.
 * @route GET /notes/{id}
 * @group Notes - Operations for Creating/Reading/Updating & Removing Notes
 * @param {string} id.path - ID of note
 * @returns {array} 200 - An array of Notes without files.
 * @returns {object} 400 - ID is not valid.
 * @returns {object}  500 - Error talking to database.
 */
noteRouter.get('/:id', async (req, res) => {
  try {
    if (!req.params.id || !mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'ID invalid or not on correct format' })
    }
    const notes = await fetchNotes({ _id: mongoose.Types.ObjectId(req.params.id) });
    res.json({ notes });
  } catch (error) {
    console.log('error in /notes/:id :', error);
    res.status(500).json({ error: 'Database Error' });
  }
});


/**
 * This function returns an array of file names assigned to a note
 * @route GET /notes/{id}/files
 * @group Notes - Operations for Creating/Reading/Updating & Removing Notes
 * @param {string} id.path.required - ID of note
 * @returns {array} 200 - An array of files assigned to note.
 * @returns {object}  500 - Error talking to database.
 */
noteRouter.get('/:id/files', async (req, res) => {
  try {
    const files = await getFilesForId(req.params.id);
    const fileList = [];
    for (const file of files) {
      fileList.push(file.name);
    }
    res.json({ fileList });
  } catch (error) {
    console.log('error in /notes/:id/fileList :', error);
    res.status(500).json({ error: 'Database Error' });
  }
});


/**
 * This function returns a single file defined by the noteID & filename provided.
 * @route GET /notes/{id}/files/fileName
 * @group Notes - Operations for Creating/Reading/Updating & Removing Notes
 * @param {string} id.path.required - ID of note
 * @param {string} fileName.path.required
 * @returns {array} 200 - An array of files assigned to note.
 * @returns {object}  500 - Error talking to database.
 */
noteRouter.get('/:id/files/:fileName', async (req, res) => {
  try {
    const files = await getFilesForId(req.params.id);
    let file;
    for (const f of files) {
      if (f.name === req.params.fileName) {
        file = f;
        break;
      }
    }

    if (file === undefined) { 
      res.status(404).json();
      return;
    }
    res.set('Content-Type', files[0].contentType);
    res.end(files[0].data, 'binary');
  } catch (error) {
    console.log('error in /notes/:id/files :', error);
    res.status(500).json({ error: 'Database Error' });
  }
});


/**
 * This function Creates a new note
 * @route POST /notes
 * @group Notes - Operations for Creating/Reading/Updating & Removing Notes
 * @param {string} note.bodyparameter.required - The note itself
 * @param {formData} files.formData - files to be saved
 * @returns {<Note>} 200 - The newly created note
 * @returns {object} 400 - Validation error
 * @returns {object} 500 - Error saving note
 */
noteRouter.post('/', upload.array('files', 3), async (req, res) => {
  try {
    const files = [];
    if (req.files && req.files.length > 0) {
      const newFiles = await createFileListFromModel(req.files);
      files.push(...newFiles);
    }
    let note = new Note({
      note: req.body.note,
      files: files
    });

    await saveModel(note);
    return res.status(201).redirect(`/notes/${note._id}`);

  } catch (error) {
    console.log('Error in POST /notes :', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json( {error: error.message } );
    }
    return res.status(500).json({ error: 'Error saving note, check logs for details' });
  }
});


/**
 * This function updates the note referenced by id
 * @route PUT /notes/{id}
 * @group Notes - Operations for Creating/Reading/Updating & Removing Notes
 * @param {string} id.path.required - ID of note
 * @param {string} note.bodyparameter - The note itself - do not send if not changing
 * @param {formData} files.formData - files to be saved - do not send if not changing
 * @returns {<Note>} 200 - The newly updated note
 * @returns {object} 400 - ID not valid or other validation error
 * @returns {object} 404 - Not found, if not note with given id is found.
 * @returns {object} 500 - Error updating note, most likely database releated.
 */
noteRouter.put('/:id', upload.array('files', 3), async (req, res) => {
  try {
    if (!req.params.id || !mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({message: 'ID invalid or not on correct format'})
    }

    const note = await findNoteById(req.params.id);
    if (!note || note === undefined) {
      return res.status(404).json();
    }

    const files = [...note.files];
    if (req.files && req.files.length > 0) {
      const newFiles = await createFileListFromModel(req.files);
      files.push(...newFiles);
      await Object.assign(note, { files });
    }
    // we are not using findOneAndUpdate because we can not validate that input.
    if ( req.body.note && req.body.note.length > 0) {
      await Object.assign(note, { note: req.body.note });
    }
    await saveModel(note);
    return res.status(200).redirect(`/notes/${req.params.id}`);
  } catch (error) {
    console.log('Error in PUT /notes/:id :', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json(error.message);
    }
    return res.status(500).json({ error: 'Error updating note, check logs for details' });
  }
});


/**
 * This function removes a note with the id provided
 * @route DELETE /notes/{id}
 * @group Notes - Operations for Creating/Reading/Updating & Removing Notes
 * @param {string} id.path.required - ID of note
 * @returns {Object} 204 - Successfully removed note
 * @returns {object} 500 - Error removing note, most likely database issue.
 */
noteRouter.delete('/:id', async (req, res) => {
  try {
    await removeNote(req.params.id);
    return res.status(204).json();
  } catch (error) {
    console.log('Error in DELETE /notes/:id :',error);
    res.status(500).json({ error });
  }
});


/**
 * This function returns all reminders assigned to a note.
 * @route GET /notes/{id}/reminders
 * @group Notes - Operations for Creating/Reading/Updating & Removing Notes
 * @param {string} id.path.required - ID of note
 * @returns {array} 200 - An array of reminders assigned to note.
 * @returns {object}  500 - Error talking to database.
 */
noteRouter.get('/:id/reminders', async (req, res) => {
  try {
    const reminders = await fetchRemindersForNote(req.params.id);
    res.status(200).json({ reminders });
  } catch (error) {
    console.log('error in /notes/:id/files :', error);
    res.status(500).json({ error: 'Database Error' });
  }
});

async function createFileListFromModel(files) {
  const newArray = [];
  for (const file of files) {
    newArray.push({
      name: file.originalname,
      data: file.buffer,
      contentType: file.mimetype
    });
  }
  return newArray;
}

export default noteRouter;
