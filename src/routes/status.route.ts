import { Router } from 'express';
import app from '../app';
import Show from '../models/show.model';

const statusRoute = Router();

statusRoute.get('/', async (req, res, next) => {
  try {
    const showsNumber = await app.db.connection.manager.count(Show);
    res.write('Current status\n');
    res.write('==============\n');
    res.write(`Scraping status: ${app.scraper.isActive ? 'active' : 'completed'}\n`);
    res.write(`Total amount of scraped shows: ${showsNumber}\n`);
    res.end();
  } catch (err) {
    next(err);
  }
});

export default statusRoute;
