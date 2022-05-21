import { config } from 'dotenv';
config({ path: `.env.${process.env.NODE_ENV || 'development'}.local` });

export const CREDENTIALS = process.env.CREDENTIALS === 'true';
export const { NODE_ENV, PORT, DB_HOST, DB_PORT, DB_DATABASE, DB_URL, SECRET_KEY, LOG_FORMAT, LOG_DIR, ORIGIN, FORGE_BASE_URL, FORGE_CLIENT_ID, FORGE_CLIENT_SECRET, FORGE_OSS_BUCKET_KEY, FORGE_DAS_API_ROOT, FORGE_ACTIVITY_ID } = process.env;
