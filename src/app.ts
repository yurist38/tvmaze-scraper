import { createServer } from 'http';
import Database from './db';
import Scraper from './scraper';
import server from './server';

const { PORT = 3000 } = process.env;

class App {
  public db!: Database;
  public scraper!: Scraper;

  constructor() {
    this.initDB()
      .then(() => {
        this.scraper = new Scraper();
        this.startServer();
      });
  }

  private initDB(): Promise<Database | undefined> {
    this.db = new Database();
    return this.db.init();
  }

  private startServer(): void {
    createServer(server)
      // tslint:disable-next-line no-console
      .listen(PORT, () => { console.log(`Server is running on port ${PORT}`); });
  }
}

const app = new App();

export default app;
