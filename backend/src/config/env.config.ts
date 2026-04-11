import dotenv from 'dotenv';
import { StringValue } from 'ms';
import path from 'path';
dotenv.config({ path: path.join((process.cwd(), '.env')) });

/* ======== Environment Variables ======== */
export default {
  node_env: process.env.NODE_ENV,
  port: process.env.PORT,
  frontend_local_url: process.env.FRONTEND_LOCAL_URL,
  client_host_url: process.env.FRONTEND_HOST_URL,
  database_uri: process.env.DATABASE_URI as string,
  salt_round: process.env.BCRYPT_SALT_ROUNDS,
  jwt_access_secret: process.env.JWT_ACCESS_SECRET,
  jwt_refresh_secret: process.env.JWT_REFRESH_SECRET,
  jwt_access_expires_in: process.env.JWT_ACCESS_EXPIRES_IN as StringValue,
  jwt_refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN as StringValue,
  cloudinary_cloud_name: process.env.CLOUDINARY_CLOUD_NAME as string,
  cloudinary_api_key: process.env.CLOUDINARY_API_KEY as string,
  cloudinary_api_secret_key: process.env.CLOUDINARY_API_SECRET_KEY as string,
};

/* ======== Cookie Options ======== */
export const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};
