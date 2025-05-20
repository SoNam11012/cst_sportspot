import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({ path: `.env.${process.env.NODE_ENV || 'development'}` });

const MONGODB_URI = process.env.MONGODB_URI;
export const DB_NAME = 'register'; // replace with your DB name

export const COLLECTIONS = {
  USERS: 'users',
  BOOKINGS: 'bookings',
  VENUES: 'venues'
};

if (!MONGODB_URI) {
  throw new Error('❌ Please define the MONGODB_URI environment variable');
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongooseCache: MongooseCache;
}

let cached = global.mongooseCache || { conn: null, promise: null };

if (process.env.NODE_ENV === 'development') {
  if (!global.mongooseCache) {
    global.mongooseCache = cached;
  }
}

async function dbConnect(): Promise<typeof mongoose> {
  try {
    // Log environment variables (safely)
    console.log('Environment check:');
    console.log('- NODE_ENV:', process.env.NODE_ENV);
    console.log('- MONGODB_URI exists:', !!process.env.MONGODB_URI);
    console.log('- DB_NAME:', DB_NAME);
    
    if (cached.conn) {
      console.log('Using cached database connection');
      return cached.conn;
    }

    if (!cached.promise) {
      if (!MONGODB_URI) {
        throw new Error('MONGODB_URI is undefined or empty');
      }
      
      console.log('Creating new database connection...');
      const connectionOptions = {
        dbName: DB_NAME,
        bufferCommands: false,
        serverSelectionTimeoutMS: 10000, // 10 seconds timeout for server selection
        socketTimeoutMS: 45000, // 45 seconds timeout for socket operations
        connectTimeoutMS: 10000, // 10 seconds timeout for initial connection
        maxPoolSize: 10, // Maintain up to 10 socket connections
      };
      
      console.log('Connection options:', JSON.stringify(connectionOptions));
      
      cached.promise = mongoose.connect(MONGODB_URI, connectionOptions)
        .catch(err => {
          console.error('Initial connection error:', err.message);
          if (err.name === 'MongoServerSelectionError') {
            console.error('Could not connect to any MongoDB server. Check network access and credentials.');
          }
          throw err;
        });
    }

    console.log('Awaiting database connection...');
    cached.conn = await cached.promise;
    console.log('Database connected successfully');
    return cached.conn;
  } catch (error: any) {
    console.error('Database connection error:', error.message);
    console.error('Error name:', error.name);
    console.error('Error stack:', error.stack);
    
    // Reset the promise so we can try again next time
    cached.promise = null;
    
    // Provide more specific error messages based on error type
    if (error.name === 'MongoServerSelectionError') {
      throw new Error('Failed to connect to MongoDB. Please check your network connection and MongoDB URI.');
    } else if (error.name === 'MongoParseError') {
      throw new Error('Invalid MongoDB connection string. Please check your MONGODB_URI format.');
    } else {
      throw error;
    }
  }
}

export default dbConnect;
