import {
  Connection,
  ConnectionOptions,
  createConnection,
  In,
  InsertResult,
} from 'typeorm';
import config from '../config';
import app from './app';
import Actor from './models/actor.model';
import Show from './models/show.model';

const options: ConnectionOptions = {
  database: String(process.env.DB_NAME),
  dropSchema: Boolean(Number(process.env.DB_DROP_SCHEMA_ON_START)),
  entities: [Actor, Show],
  host: String(process.env.DB_HOST),
  logging: !config.isProduction,
  password: String(process.env.DB_PASSWORD),
  port: String(process.env.DB_PORT),
  synchronize: true,
  // @ts-ignore
  type: String(process.env.DB_TYPE),
  username: String(process.env.DB_USER),
};

class Database {
  public connection!: Connection;

  public async init(): Promise<Database | undefined> {
    try {
      this.connection = await createConnection(options);
      if (this.connection.options.type === 'mysql') {
        await this.connection.createQueryRunner().query('SET FOREIGN_KEY_CHECKS=0');
      }
      return this;
    } catch (err) {
      console.error('Unable to connect to a database:', err); // tslint:disable-line no-console
      process.exit(1);
    }
  }

  public async saveShow(show: Show): Promise<InsertResult | undefined> {
    try {
      return await app.db.connection
        .createQueryBuilder()
        .insert()
        .into(Show)
        .values(show)
        .execute();
    } catch (err) {
      console.error('Error while saving show:', err); // tslint:disable-line no-console
    }
  }

  public async saveActors(actors: Actor[]): Promise<void> {
    try {
      const existingActors = await app.db.connection.manager
        .find(Actor, { where: { actorId: In(actors.map((a) => a.actorId))}});
      const existingActorsIds = existingActors.map((a) => a.actorId);
      const actorsFiltered = actors.filter((a) => !existingActorsIds.includes(a.actorId));

      await app.db.connection
        .createQueryBuilder()
        .insert()
        .into(Actor)
        .values(actorsFiltered)
        .execute();
    } catch (err) {
      console.error('Error while saving actors:', err); // tslint:disable-line no-console
    }
  }

  public async addActor(actorId: number, showId: number): Promise<void> {
    try {
      await app.db.connection
        .createQueryBuilder()
        .relation(Show, 'cast')
        .of(showId)
        .add(actorId);
    } catch (err) {
      console.error('Error while adding actor:', err); // tslint:disable-line no-console
    }
  }
}

export default Database;
