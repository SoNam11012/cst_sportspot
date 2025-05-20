import { sign } from 'jsonwebtoken';
import GoogleProvider from 'next-auth/providers/google';
import FacebookProvider from 'next-auth/providers/facebook';
import { NextAuthOptions } from 'next-auth';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export function signJwt(payload: any) {
  return sign(payload, JWT_SECRET, { expiresIn: '1d' });
}

export function generateEmailToken(email: string): string {
  return sign({ email }, JWT_SECRET, { expiresIn: '24h' });
}

// NextAuth configuration options
export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
};
