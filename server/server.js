const { ApolloServer } = require('apollo-server-express')
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const fs = require('fs')
const cloudinary = require('cloudinary').v2
// const { RedisPubSub } = require('graphql-redis-subscriptions')
// const Redis = require('ioredis')

const typeDefs = require('./graphql/typeDefs')
const resolvers = require('./graphql/resolvers')
const {
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
  // REDIS_PASSWORD,
  MONGODB
} = require('./config.js')
const upload = require('./util/uploadService')

const port = process.env.PORT || 4000

// const options = {
//   // host: 'ec2-3-224-107-12.compute-1.amazonaws.com',
//   // port: 14619,
//   // password: 'p32bb834537c3f7a1538e540754d2fb8db7c508fc0e80095d43882da3566e387c',
//   host: 'redis',
//   port: 6379,
//   subscriber: true,
//   publisher: true,
//   retryStrategy: times => {
//     return Math.min(times * 50, 2000)
//   }
// }

// const pubsub = new RedisPubSub({
//   publisher: new Redis(options),
//   subscriber: new Redis(options)
// });

// const pubsub = new PubSub()

const server = new ApolloServer({
  cors: {
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204
  },
  typeDefs,
  resolvers,
  context: ({ req }) => ({ req })
  // introspection: true,
  // playground: {
  //   subscriptionEndpoint: '/graphql'
  // }
})

const app = express()
server.applyMiddleware({ app })

app.use(cors())

app.use('/api/upload', upload.single('file'), (req, res) => {
  if (req.file) {
    cloudinaryHelper(req.file.path, 'media-library').then(data => {
      res.json(data)
    })
  } else res.status(401).send('Unauthorized')
})

app.use('/api/uploadThumbnail', upload.single('file'), (req, res) => {
  if (req.file) {
    cloudinaryHelper(req.file.path, 'thumbnails').then(data => {
      res.json(data)
    })
  } else res.status(401).send('Unauthorized')
})

app.use('/api/uploadCoverImage', upload.single('file'), (req, res) => {
  if (req.file) {
    cloudinaryHelper(req.file.path, 'cover-images').then(data => {
      res.json(data)
    })
  } else res.status(401).send('Unauthorized')
})

async function cloudinaryHelper(filePath, folder) {
  cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET
  })

  const result = await cloudinary.uploader.upload(filePath, { folder, use_filename: true }, (error, result) => {
    if (error) console.log(error)
    else {
      fs.unlink(filePath, err => {
        if (err) console.log('Error deleting image on temp')
      })
    }
  })

  return result
}

// TODO create for delete upload

mongoose
  .connect(MONGODB, { useNewUrlParser: true })
  .then(() => {
    console.log('MongoDB Connected')
    return app.listen({ port }, () => {
      console.log(`Server ready at https://internal.meditab.com/server/api${server.graphqlPath}`)
    })
  })
  .catch(e => console.log(e))
