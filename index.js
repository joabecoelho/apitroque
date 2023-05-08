const express = require('express')
const cors = require('cors')

const app = express()

const conn = require('./db/conn')

// Config JSON response
app.use(express.json())

// Solve CORS
app.use(cors({ credentials: true }))

// Public folder for images
app.use(express.static('public'))

// Routes
const UserRoutes = require('./routes/UserRoutes')
const InstrumentRoutes = require('./routes/InstrumentRoutes')

app.use('/users', UserRoutes)
app.use('/instruments', InstrumentRoutes)

app.listen(process.env.PORT || 5000)
