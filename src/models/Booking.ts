import mongoose, { Schema, models, model } from 'mongoose';

const bookingSchema = new Schema(
  {
    userId: { type: String, required: true },
    // Make venueId more flexible to accept string values
    venueId: { 
      type: Schema.Types.Mixed, // Use Mixed type to accept both ObjectId and string
      ref: 'Venue', 
      required: true 
    },
    fullName: { type: String, required: true },
    studentNumber: { type: String, required: true },
    year: { type: String, required: true },
    course: { type: String, required: true },
    email: { type: String, required: true },
    date: { type: Date, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    participants: { type: Number, required: true },
    needsEquipment: { type: Boolean, default: false },
    notes: { type: String },
    status: { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'pending' }
  },
  { timestamps: true }
);

const Booking = models.Booking || model('Booking', bookingSchema);
export default Booking;
