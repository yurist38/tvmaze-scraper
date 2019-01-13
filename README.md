# TvMaze Scraper application

It's Node.js app written on TypeScript.

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
