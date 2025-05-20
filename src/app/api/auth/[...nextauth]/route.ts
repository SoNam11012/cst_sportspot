import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth';

// Direct export of GET and POST handlers for App Router
export const GET = NextAuth(authOptions);
export const POST = NextAuth(authOptions);
