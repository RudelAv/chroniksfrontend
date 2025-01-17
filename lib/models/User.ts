import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    default: '',
  },
  bio: {
    type: String,
    default: '',
  },
  savedPosts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
  }],
}, {
  timestamps: true,
});

export default mongoose.models.User || mongoose.model('User', UserSchema);