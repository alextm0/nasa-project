import mongoose from 'mongoose';

const planetSchema = new mongoose.Schema({
  keplerName: { type: String, required: true, unique: true },
});

export const Planet = mongoose.model('Planet', planetSchema);
