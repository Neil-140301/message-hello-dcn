require('dotenv').config()
import mongoose from 'mongoose'
import Message from './models'

export const mongoConnect = async () => {
  try {
    let DB_URI = process.env.MONGO_URI

    return await mongoose
      .connect(DB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then((res) => {
        console.log('connected to mongoose')
        return res
      })
      .catch((err) => console.log(err))
  } catch (error) {
    console.log(error)
  }
}

export const getMessages = async (req, res) => {
  try {
    const messages = await Message.find()
    res.json(messages)
  } catch (error) {
    console.log(error)
  }
}

const addNewMessage = async (req, res) => {
  const newMessage = new Message(req.body)
  await newMessage.save()
  res.status(200).send(newMessage)
}

export default async function (req, res) {
  try {
    await mongoConnect()

    if (req.method === 'GET') {
      return await getMessages(req, res)
    }

    if (req.method === 'POST') {
      return await addNewMessage(req, res)
    }

    res.json('Success')
  } catch (error) {
    console.log(error)
  }
}
