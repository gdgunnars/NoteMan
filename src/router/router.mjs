import Router from 'express';
import NoteRoutes from './notes';
import ReminderRoutes from './reminders';


export default function (app) {
  const apiRoutes = new Router();

  apiRoutes.use('/notes', NoteRoutes);
  apiRoutes.use('/reminders', ReminderRoutes);
  apiRoutes.get('/', (req, res) => {
    res.json({ success: true });
  });

  app.use(apiRoutes);
}
