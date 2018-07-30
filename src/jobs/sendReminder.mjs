import { findNoteById } from '../data_access/noteData';
import { getExpiredReminders } from '../data_access/reminderData';

export default function (agenda) {
  agenda.define('send reminder', async (job, done) => {
    try {
      console.log(`-----=[Reminder: ${job.attrs.data.reminderID}]=-----`);
      const note = await findNoteById(job.attrs.data.noteID);
      const unSeenNotes = await getExpiredReminders();
      console.log(`-- ${note.note} --`);
      console.log('--------------------------');
      console.log(`You have ${unSeenNotes.length} unseen notes`);
      console.log('-----=[Done]=-----');
      done();
    } catch (error) {
      console.log('## There was an error trying to send reminder:', error);
    }
  });
}
