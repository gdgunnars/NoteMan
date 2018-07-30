import Reminder from '../models/reminder';

export async function getExpiredReminders() {
  return Reminder.find({ remindAt: { $lte: new Date() }, seen: false });
}

export async function markReminderAsSeen(reminderID) {
  return Reminder.updateMany({ _id: { $in: reminderID } }, { seen: true });
}

export async function findReminderById(reminderID) {
  return Reminder.findById({ _id: reminderID });
}

export async function fetchAllReminders() {
  return Reminder.find({});
}

export async function removeReminder(reminderID) {
  return Reminder.findByIdAndRemove({ _id: reminderID });
}

export async function fetchRemindersForNote(noteID) {
  return Reminder.find({ note: noteID });
}
