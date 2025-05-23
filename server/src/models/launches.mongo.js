import mongoose from 'mongoose';

const launchSchema = new mongoose.Schema({
  flightNumber: { type: Number, required: true, unique: true },
  mission:      { type: String, required: true },
  rocket:       { type: String, required: true },
  launchDate:   { type: Date,   required: true },
  destination:  { type: String },
  customers:    [String],
  upcoming:     { type: Boolean, required: true },
  success:      { type: Boolean, required: true, default: true },
});

export const Launch = mongoose.model('Launch', launchSchema);
