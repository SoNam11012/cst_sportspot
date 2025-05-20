import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';

export async function POST(req: Request) {
  try {
    // Parse request body
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ message: 'Email and password are required' }, { status: 400 });
    }

    // Connect to MongoDB
    await dbConnect();

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: 'Invalid email or password' }, { status: 401 });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ message: 'Invalid email or password' }, { status: 401 });
    }

    // Check if JWT_SECRET is available
    const jwtSecret = process.env.JWT_SECRET || 'fallback-secret-key-for-development-only';
    
    if (!process.env.JWT_SECRET) {
      console.warn('WARNING: JWT_SECRET environment variable is not set. Using fallback secret for development only.');
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      jwtSecret,
      { expiresIn: '7d' }
    );

    // Send response
    return NextResponse.json(
      {
        message: 'Login successful',
        token,
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Login error:', error);
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    
    // Provide more specific error messages based on error type
    if (error.name === 'MongoServerSelectionError') {
      return NextResponse.json({ 
        message: 'Database connection error. Please try again later.',
        details: 'Could not connect to database server'
      }, { status: 500 });
    } else if (error.name === 'JsonWebTokenError') {
      return NextResponse.json({ 
        message: 'Authentication error. Please try again later.',
        details: 'Error generating authentication token'
      }, { status: 500 });
    } else {
      return NextResponse.json({ 
        message: 'Internal server error', 
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      }, { status: 500 });
    }
  }
}
