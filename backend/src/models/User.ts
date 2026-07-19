import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  email: string;
  password: string;
  name?: string;
  preferences: {
    categories: string[];
    blockedChannels: string[];
    blockedVideos: string[];
    language: string;
    maturityRating: string;
  };
  watchHistory: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
  comparePassword(password: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email'],
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },
    name: {
      type: String,
      default: '',
    },
    preferences: {
      categories: {
        type: [String],
        default: [],
      },
      blockedChannels: {
        type: [String],
        default: [],
      },
      blockedVideos: {
        type: [String],
        default: [],
      },
      language: {
        type: String,
        default: 'en',
      },
      maturityRating: {
        type: String,
        default: 'PG-13',
        enum: ['G', 'PG', 'PG-13', 'R'],
      },
    },
    watchHistory: [
      {
        type: Schema.Types.ObjectId,
        ref: 'WatchLog',
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as any);
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};

export default mongoose.model<IUser>('User', userSchema);
