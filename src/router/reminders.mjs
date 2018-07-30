import Router from 'express';
import mongoose from 'mongoose';
import Reminder from '../models/reminder';
import { getExpiredReminders, markReminderAsSeen, findReminderById,
  removeReminder } from '../data_access/reminderData';
import { saveModel } from '../data_access/noteData';
import agenda from '../jobs/agenda';

const reminderRouter = new Router();

/**
 * This function returns Notifications that have passed it's notification time.
 * but have not been seen.
 * @route GET /reminders
 * @group Reminders - Operations for Adding & fetching reminders.
 * @returns {object} 200 - An array of Notes which of that reminders have expired.
 * @returns {object}  500 - Error talking to database.
 */
reminderRouter.get('/', async (req, res) => {
  try {
    const reminders = await getExpiredReminders();
    const IDs = reminders.map(reminder => reminder._id);
    res.json({ reminders });
    await markReminderAsSeen(IDs);
  } catch (error) {
    console.log('error in /reminders :', error);
    res.status(500).json({'error': 'Database Error, check logs for more detail'});
  }
});


/**
 * This function Creates a new reminder for a specific note (provided with nodeID)
 * @route POST /reminders
 * @group Reminders - Operations for Adding & fetching reminders.
 * @param {string} note.requestBody.required - The _id of note to assign reminder to.
 * @param {string} remindAt.requestBody.required - The datetime of the reminder
 * @returns {<Reminder>} 201 - The newly created reminder
 * @returns {object} 400 - Validation error
 * @returns {object} 500 - Error saving reminder
 */
reminderRouter.post('/', async (req, res) => {
  try {
    if (!req.body.note || !mongoose.Types.ObjectId.isValid(req.body.note)) {
      return res.status(400).json({ error: 'Note ID given is not on correct format' });
    }

    let reminder = new Reminder({
      remindAt: req.body.remindAt,
      note: req.body.note,
    });

    await saveModel(reminder);
    agenda.schedule(new Date(req.body.remindAt), 'send reminder', { reminderID: reminder._id, noteID: reminder.note});
    return res.status(201).redirect(`/reminders/${reminder._id}`);

  } catch (error) {
    console.log('Error in POST /reminders :', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    return res.status(500).json({ error: 'Error saving reminder, check logs for details' });
  }
});

/**
 * This function fetches a specific reminder
 * @route GET /reminders/{id}
 * @group Reminders - Operations for Adding & fetching reminders.
 * @param {string} reminderID.path.required - The _id of the reminder to get.
 * @param {string} remindAt.requestBody.required - The datetime of the reminder
 * @returns {<Reminder>} 200 - The requested reminder
 * @returns {object} 400 - Validation error
 * @returns {object} 500 - Error fetching reminder from database
 */
reminderRouter.get('/:id', async (req, res, next) => {
  try {
    if (!req.params.id || !mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'ID invalid or not on correct format' });
    }

    const reminder = await findReminderById(req.params.id);
    if (!reminder || reminder == undefined) {
      return res.status(404).json({ message: 'Reminder not found' });
    }

    return res.status(200).json({ reminder });
  } catch (error) {
    console.log('Error in PUT /reminders :', error);
    return res.status(500).json({error: 'Error fetching reminder, check logs for details'});
  }
});


/**
 * This function updates the reminder passed with ID parameter.
 * @route PUT /reminders/{id}
 * @group Reminders - Operations for Adding & fetching reminders.
 * @param {string} reminderID.path.required - The _id of reminder to update.
 * @param {string} remindAt.requestBody.required - The datetime when to remind at.
 * @returns {<Reminder>} 200 - The updated reminder
 * @returns {object} 400 - Validation error
 * @returns {object} 404 - Reminder not found
 * @returns {object} 500 - Error saving note
 */
reminderRouter.put('/:id', async (req, res) => {
  try {
    if (!req.params.id || !mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'ID invalid or not on correct format' });
    }

    const reminder = await findReminderById(req.params.id);
    if (!reminder || reminder === undefined) {
      return res.status(404).json({ message: 'Reminder not found' });
    }

    if (req.body.remindAt && req.body.remindAt.length > 0) {
      await Object.assign(reminder, { remindAt: req.body.remindAt, seen: false });
    }

    await saveModel(reminder);
    return res.status(200).redirect(`/reminders/${req.params.id}`);
  } catch (error) {
    console.log('Error in PUT /reminders :', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    return res.status(500).json({ error: 'Error updating reminder, check logs for details' });
  }
});

/**
 * This function permanently removes a remindet with the id provided
 * @route DELETE /reminders/{id}
 * @group Reminders - Operations for Adding & fetching reminders.
 * @param {string} id.path.required - ID of reminder
 * @returns {Object} 204 - Successfully removed reminder
 * @returns {object} 500 - Error removing reminder, most likely database issue.
 */
reminderRouter.delete('/:id', async (req, res) => {
  try {
    await removeReminder(req.params.id);
    return res.status(204).json();
  } catch (error) {
    console.log('Error in DELETE /reminders/:ID:', error);
    return res.status(500).json({ error });
  }
});

export default reminderRouter;
