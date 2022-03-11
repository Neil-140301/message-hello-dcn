import axios from 'axios'
import Image from 'next/image'
import { useCallback, useEffect, useRef, useState } from 'react'
import { format } from 'timeago.js'
import { v4 as uuidv4 } from 'uuid'
import Particles from 'react-tsparticles'
import config from '../public/particlesjs-config.json'
import { useRouter } from 'next/router'
import { mongoConnect } from './api'
import Message from './api/models'

const images = [
  'https://images.pexels.com/photos/3411134/pexels-photo-3411134.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
  'https://images.pexels.com/photos/264905/pexels-photo-264905.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'https://images.pexels.com/photos/1319584/pexels-photo-1319584.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
  'https://images.pexels.com/photos/1677794/pexels-photo-1677794.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
  'https://images.pexels.com/photos/6897766/pexels-photo-6897766.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
]

const Comment = ({ sender, userId, text, time }) => {
  const pic = images[Math.floor(Math.random() * 4)]

  return (
    <div className={`my-8 flex items-center ${sender && 'flex-row-reverse'} `}>
      <Image
        src={pic}
        objectFit="cover"
        width={60}
        height={60}
        className={`order-1 rounded-full `}
      />
      <div
        className={`mx-4 flex w-[300px] flex-col rounded-lg bg-gray-50 p-4 `}
      >
        <p className="ml-auto text-sm text-gray-400 ">
          {userId}, {format(new Date(time))}
        </p>
        <p className="">{text}</p>
      </div>
    </div>
  )
}

const Home = ({ messages }) => {
  const [userId, setUserId] = useState(null)
  const [comments, setComments] = useState(messages)
  const textRef = useRef()

  useEffect(() => {
    const prevId = localStorage.getItem('message-app-id')
    if (prevId) {
      setUserId(prevId.slice(0, 10))
    } else {
      const newId = uuidv4()
      setUserId(newId.slice(0, 10))
      localStorage.setItem('message-app-id', newId)
    }
  }, [])

  const addComment = useCallback(
    async (e) => {
      e.preventDefault()
      let newComment = {
        text: textRef.current.value,
        userId,
      }

      const { data } = await axios.post(`/api`, newComment)

      setComments((p) => [...p, data])
      textRef.current.value = null
    },
    [userId, textRef]
  )

  return (
    <div className="flex h-screen flex-col items-center justify-center bg-slate-300 p-[48px] font-mono ">
      <h1 className="relative z-10 rounded-lg border-4 border-blue-400 bg-gray-100 py-3 px-5 text-[50px] font-bold ">
        Hello, {userId}
      </h1>
      <form
        onSubmit={addComment}
        className="relative z-10 my-8 flex items-center space-x-5 "
      >
        <p className="text-2xl ">Drop a comment below 👋🙋‍♂️</p>
        <input
          type="text"
          ref={textRef}
          className="w-[250px] rounded px-6 py-2 outline-none "
          maxLength="120"
          placeholder="Type something..."
        />
      </form>
      <div className="relative z-10 h-[75vh] w-full max-w-6xl overflow-hidden overflow-y-scroll px-8 scrollbar-none ">
        {comments.map((i, idx) => {
          return (
            <Comment
              key={idx}
              userId={i?.userId}
              sender={i?.userId === userId}
              text={i?.text}
              time={i?.createdAt}
            />
          )
        })}
      </div>
      <Particles
        params={config}
        className="absolute top-0 right-0 left-0 bottom-0 z-0  "
      />
    </div>
  )
}

export const getStaticProps = async (c) => {
  await mongoConnect()
  const messages = await Message.find()
  return {
    props: {
      messages: JSON.parse(JSON.stringify(messages)),
    },
    revalidate: 4,
  }
}

export default Home
