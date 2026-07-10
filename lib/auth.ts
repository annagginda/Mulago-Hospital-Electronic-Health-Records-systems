import { SessionOptions } from 'iron-session';

export const sessionOptions: SessionOptions = {
  password: process.env.AUTH_SECRET as string,
  cookieName: 'mulago_ehr_session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
  },
};
