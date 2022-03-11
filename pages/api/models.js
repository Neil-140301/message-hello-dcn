import mongoose from 'mongoose'

const messageSchema = new mongoose.Schema(
  {
    userId: String,
    text: String,
  },
  {
    timestamps: true,
  }
)

export default mongoose.models['Message'] ||
  mongoose.model('Message', messageSchema)
