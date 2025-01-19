export const GOOGLE_CLIENT_ID = 'TU_GOOGLE_CLIENT_ID';
import { DATABASE_URL } from './config';
export const GOOGLE_REDIRECT_URI = `${DATABASE_URL}/auth/google/callback`;

export const GOOGLE_CONFIG = {
  scope: 'email profile',
  access_type: 'offline',
  prompt: 'consent',
  include_granted_scopes: true,
  response_type: 'code',
}; 