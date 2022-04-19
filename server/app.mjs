import express from 'express'
import path, { dirname } from 'path'
import cookieParser from 'cookie-parser'
import logger from 'morgan'

import errorHandler from './middleware/errorHandler.mjs'

import indexRouter from './routes/index.mjs'
import usersRouter from './routes/users.mjs'
import sessionRouter from './routes/session.mjs'
import tagsRouter from './routes/tags.mjs'
import postsRouter from './routes/posts.mjs'

import swaggerUi from 'swagger-ui-express'
import swaggerJsdoc from 'swagger-jsdoc'

import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const openApiOptions = {
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'blog',
      version: '0.1.0'
    },
    license: {
      name: 'MIT'
    }
  },
  apis: [path.join(__dirname, 'routes/*.mjs')]
}

const openapiSpecification = swaggerJsdoc(openApiOptions)

const app = express()

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, '../public')))

app.use('/docs', swaggerUi.serve, swaggerUi.setup(openapiSpecification))
app.use('/openapi', function (req, res) {
  res.send(openapiSpecification)
})

app.use('/', indexRouter)
app.use('/users', usersRouter)
app.use('/session', sessionRouter)
app.use('/tags', tagsRouter)
app.use('/posts', postsRouter)
app.use(errorHandler)

export default app
