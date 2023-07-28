require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const healthRoute = require('./routes/HealthRoute')


/**
 * APP
 */
const app = express();
app.use(express.json());


/**
 * DATABASE CONNECTION
 */
mongoose.connect(process.env.DATABASE_URL);
mongoose.connection.once('connected', () => console.log('Database connected'));
mongoose.connection.on('error', (er) => console.log("Database error :", er))


/**
 * ROUTES
 */
app.use('/health', healthRoute)


/**
 * SERVER LISTEN
 */
app.listen(process.env.SERVER_PORT, () => console.log(`App server started at ${process.env.SERVER_PORT}`) );