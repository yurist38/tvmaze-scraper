import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import showsRoute from './routes/shows.route';
import statusRoute from './routes/status.route';

const server = express();

server.use(bodyParser.json());
server.use(cors());

server.use('/shows', showsRoute);
server.use('/status', statusRoute);

export default server;
