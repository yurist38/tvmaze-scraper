import axios from 'axios';
import app from './app';
import { formatActors } from './helpers';
import Actor from './models/actor.model';
import Show from './models/show.model';

class ShowScraper {
  public isActive: boolean = true;
  private currentIndex: number = 1;
  private failedInRow: number = 0;
  private readonly delay: number = 1000 / Number(process.env.RATE_LIMIT_PER_SECOND);
  private readonly showsUrl: string = 'http://api.tvmaze.com/shows';
  private readonly showsQueryParams: { [name: string]: string } = {
    embed: 'cast',
  };

  constructor() {
    this.getLastShowId()
      .then((lastId) => {
        this.currentIndex = lastId + 1;
        this.proceed();
      });
  }

  private async getLastShowId(): Promise<number> {
    try {
      const shows = await app.db.connection
        .getRepository(Show)
        .find({
          order: { showId: 'DESC' },
          take: 1,
        });
      return shows.length ? shows[0].showId : 0;
    } catch (err) {
      return 0;
    }
  }

  private async retrieveShow(): Promise<any | undefined> {
    try {
      const showResponse = await axios.request<any>({
        method: 'get',
        url: this.getShowUrl(),
      });

      this.failedInRow = 0;

      return showResponse.data;
    } catch (err) {
      console.log('Error while retrieving a show:', err); // tslint:disable-line no-console

      const { status = 0 } = err.response || {};

      if (status === 404) {
        this.failedInRow++;
      }

      if (this.failedInRow >= Number(process.env.MAX_FAILS_IN_ROW)) {
        this.isActive = false;
      }

      return;
    }
  }

  private getShowUrl(): string {
    const queryParams: string = Object
      .keys(this.showsQueryParams)
      .map((key) => `${key}=${this.showsQueryParams[key]}`)
      .join('&');

    return `${this.showsUrl}/${this.currentIndex}?${queryParams}`;
  }

  private async storeData(showData: any): Promise<void> {
    const { cast = [] } = showData._embedded;
    const actors: Actor[] = formatActors(cast);
    const actorsIds: number[] = actors.map(({ actorId }) => actorId);

    const show = {
      cast: [],
      name: showData.name,
      showId: showData.id,
    };

    await app.db.connection.transaction(async () => {
      await app.db.saveShow(show);
      if (actors.length) {
        await app.db.saveActors(actors);
        await actorsIds.forEach((actorId) => app.db.addActor(actorId, show.showId));
      }
    });
  }

  private async proceed(): Promise<void> {
    const showData = await this.retrieveShow();

    if (showData) {
      this.storeData(showData);
    }

    this.currentIndex++;

    if (this.isActive) {
      setTimeout(() => this.proceed(), this.delay);
    }
  }
}

export default ShowScraper;
