import { DB_HOST, DB_PORT, DB_DATABASE, DB_URL } from '@config';

export const dbConnection = DB_URL ?? `mongodb://${DB_HOST}:${DB_PORT}/${DB_DATABASE}`;
