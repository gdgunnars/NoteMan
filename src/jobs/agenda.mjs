import Agenda from 'agenda';
import sendReminders from './sendReminder';

const dbOptions = { db: { address: 'localhost:27017/noteman', collection: 'reminderJobs' } };
const agenda = new Agenda(dbOptions);
sendReminders(agenda);
agenda.start();

export default agenda;
