import mongoose from 'mongoose';

/**
 * @typedef Reminder
 * @property {string} remindAt.required - Datetime when reminder should execute
 * @property {Boolean} seen - True if user has seend the reminder, else false.
 * @property {Note} note.required - ID of note to assign reminder to.
 */
const reminderSchema = new mongoose.Schema({
  remindAt: {
    type: Date,
    required: true,
  },
  seen: {
    type: Boolean,
    default: false,
  },
  note: {
    type: mongoose.Schema.Types.ObjectId, ref: 'Note',
  },
}, {
  timestamps: true,
});

export default mongoose.model('Reminder', reminderSchema);
