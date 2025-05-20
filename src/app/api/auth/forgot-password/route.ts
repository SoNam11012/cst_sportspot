import { NextRequest, NextResponse } from 'next/server';

// Mock function to simulate database user lookup
async function findUserByEmail(email: string) {
  // Replace with your actual DB call
  const mockUsers = [{ email: 'user@example.com', id: '123' }];
  return mockUsers.find(user => user.email === email) || null;
}

// Mock function to simulate sending a reset email
async function sendResetEmail(email: string, token: string) {
  // Replace this with actual email sending logic (e.g. using nodemailer, SendGrid, etc)
  console.log(`Sending password reset email to ${email} with token: ${token}`);
  return true;
}

// Generate a reset token (you can use JWT or any secure random string generator)
function generateResetToken() {
  return Math.random().toString(36).slice(2); // simple random string, replace with secure version
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ message: 'Invalid email' }, { status: 400 });
    }

    const user = await findUserByEmail(email);

    // Always respond with success to avoid user enumeration
    if (!user) {
      return NextResponse.json({ message: 'If an account with that email exists, a reset link has been sent.' });
    }

    const resetToken = generateResetToken();

    // TODO: Save this token in your DB with expiry linked to the user (for validation later)

    await sendResetEmail(email, resetToken);

    return NextResponse.json({ message: 'Reset link sent successfully' });
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
