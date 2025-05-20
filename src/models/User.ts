import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true, trim: true, minlength: 3 },
    password: { type: String, required: true },
    studentNumber: { type: String, default: '', unique: true, sparse: true },
    role: { type: String, enum: ['student', 'teacher'], default: 'student' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model('User', UserSchema);
