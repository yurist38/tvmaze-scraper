import dotenv from 'dotenv';
import path from 'path';

interface IConfig {
  isProduction: boolean;
}

const devEnvPath = path.join(__dirname, '..', '.env.development');
const envFields = [
  'DB_TYPE',
  'DB_NAME',
  'DB_HOST',
  'DB_PORT',
  'DB_USER',
  'DB_PASSWORD',
  'DB_DROP_SCHEMA_ON_START',
  'RATE_LIMIT_PER_SECOND',
  'PORT',
  'MAX_FAILS_IN_ROW',
  'PAGE_LIMIT',
];

const isProduction: boolean = process.env.NODE_ENV === 'production';

const config: IConfig = {
  isProduction,
};

if (!isProduction) {
  dotenv.config({ path: devEnvPath });
}

if (!envFields.every((f) => !!process.env[f])) {
  const missingVars: string[] = envFields.filter((f) => !process.env[f]);
  // tslint:disable-next-line no-console
  console.error(
    'Error: some environment variables are missing. Shutting down...',
    'Missing variables:',
    missingVars,
  );
  process.exit(1);
}

export default config;
