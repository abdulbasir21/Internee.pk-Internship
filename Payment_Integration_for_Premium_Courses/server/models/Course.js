const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  category: { type: String, required: true, trim: true },
  price: { type: Number, required: true, default: 0 }, // in whole currency units, e.g. dollars
  isFree: { type: Boolean, default: false },
  content: { type: [String], required: true }, // array of paragraphs — the actual lesson text, gated by hasPurchased
  previewImage: { type: String },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Course', courseSchema);
