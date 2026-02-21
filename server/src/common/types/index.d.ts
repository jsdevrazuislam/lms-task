import { ITokenPayload } from '../../modules/auth/auth.interface.js';

declare global {
  namespace Express {
    interface Request {
      user: ITokenPayload;
    }
  }
}
