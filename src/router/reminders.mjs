import Router from "express";
import Reminder from "../models/reminder";
import mongoose from "mongoose";
import { getExpiredReminders } from "../data_access/reminderData";
import { saveModel } from "../data_access/noteData";

const reminderRouter = new Router();

/**
 * This function returns Notifications that have passed it's notification time 
 * but have not been seen.
 * @route GET /reminders
 * @group Reminders - Operations for Adding & fetching reminders.
 * @returns {object} 200 - An array of Notes which of that reminders have expired.
 * @returns {object}  500 - Error talking to database.
 */
reminderRouter.get("/", async (req, res) => {
    try {
        const reminders = await getExpiredReminders();
        res.json({reminders});
    } catch (error) {
        console.log("error in /reminders :", error);
        res.status(500).json({"error": "Database Error, check logs for more detail"});
    }
});


/**
 * This function Creates a new reminder for a specific note (provided with nodeID)
 * @route POST /reminders
 * @group Reminders - Operations for Adding & fetching reminders.
 * @param {string} note.requestBody.required - The _id of note to assign reminder to.
 * @param {string} date.requestBody.required - The datetime of the reminder
 * @returns {<Note>} 200 - The newly created note
 * @returns {object} 400 - Validation error
 * @returns {object} 500 - Error saving note
 */
reminderRouter.post("/", async (req, res) => {
    try {
        if (!req.body.note || !mongoose.Types.ObjectId.isValid(req.body.note)) {
            return res.status(400).json({error: "Note ID given is not on correct format"});
        }

        let reminder = new Reminder({
            remindAt: req.body.remindAt,
            note: req.body.note
        });

        await saveModel(reminder);
        return res.status(201).json({reminder});
        //return res.status(201).redirect(`/notes/${note._id}`);

    } catch (error) {
        console.log("Error in POST /notes :", error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({error: error.message} );
        } else {
            return res.status(500).json({error: "Error saving note, check logs for details"});
        }
    }
});


export default reminderRouter;