import { Router } from 'express';
import app from '../app';
import { sortByBirthdayDesc } from '../helpers';
import Show from '../models/show.model';

const showsRoute = Router();

showsRoute.get('/:showId', async (req, res, next) => {
  const { showId } = req.params;

  try {
    const show = await app.db.connection.manager.findOne(Show, { where: { showId }});

    if (!show) {
      res.sendStatus(404);
      return;
    }

    res.json({
      cast: sortByBirthdayDesc(show.cast),
      id: show.showId,
      name: show.name,
    });
  } catch (err) {
    next(err);
  }
});

showsRoute.get('/', async (req, res, next) => {
  const { page = 1 } = req.query;
  const { PAGE_LIMIT = 20 } = process.env;
  const take = Number(PAGE_LIMIT);
  const skip: number = (page - 1) * take;

  try {
    const shows = await app.db.connection.manager.find(Show, { skip, take });

    if (!shows) {
      res.sendStatus(404);
      return;
    }

    const showsFormatted: Show[] = shows
      .map((show) => ({ ...show, cast: sortByBirthdayDesc(show.cast) }));

    res.json(showsFormatted);
  } catch (err) {
    next(err);
  }
});

export default showsRoute;
