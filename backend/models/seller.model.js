import mongoose from 'mongoose';

const companySchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },

    companyName: {
      type: String,
      required: true,
    },

    businessType: {
      type: String,
      required: true,
    },

    description: String,

    gstNumber: String,

    address: {
      city: { type: String, required: true },
      state: { type: String, required: true },
      country: { type: String, default: 'India' },
      pincode: String,
    },

    establishedYear: Number,

    subDomain: {
      type: String,
      required: true,
      unique: true,
    },
    logo: String,

    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Company', companySchema);
