# TvMaze Scraper application

It's Node.js app written on TypeScript. Currently deployed on [Heroku](https://tvmaze-scraper.herokuapp.com)

## API

#### [GET] `/status`
Endpoint to check the current state of the scraper.

#### [GET] `/shows`
Provides an information about shows, paginated by size specified in environment variables (`PAGE_LIMIT`).

To request a specific page please use query param `page` (`/shows?page=2`)

#### [GET] `/shows/:id`
Provides an information about specific show


## Configuration
All required environment variables are listed in `.env.development` file.

## Database
The app was tested with SQLite and MySQL databases.

## Development
Environment variables are predefined in `.env.development` file.
To start the project run following commands:
* `npm i`
* `npm run dev`

*Linter:* `npm run lint`

## Production
For running app in Production mode please check that you passed to it all required env variables.
Commands to start on production:
* `npm i`
* `npm run build`
* `npm run prod`
