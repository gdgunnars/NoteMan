
import Reminder from "../models/reminder";

export async function getExpiredReminders() {
    return Reminder.find({remindAt: {$lte: new Date() } });
}