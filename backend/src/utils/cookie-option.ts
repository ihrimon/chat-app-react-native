import envConfig from '../config/env.config';

const cookieOptions = {
  httpOnly: true,
  secure: envConfig.node_env === 'production',
  sameSite: 'strict' as const,
  maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
};

export default cookieOptions;
