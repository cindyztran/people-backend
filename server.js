//Dependencies

//get .env var
require('dotenv').config();

//pull PORT from .env, give default value of 5000
const { PORT = 5000, MONGODB_URL } = process.env;

//import express
const express = require('express');

//create application object
const app = express();

//import mongoose
const mongoose = require('mongoose');

//import cors and morgan
const cors = require('cors');
const morgan = require('morgan');

//Database Connection
//Establish connection
mongoose.connect(MONGODB_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
});

//Connection Events
mongoose.connection
    .on('open', () => console.log('You are connected to mongoose'))
    .on('close', () => console.log('You are disconnected from mongoose'))
    .on('error', (error) => console.log(error));

//Models
const PeopleSchema = new mongoose.Schema({
    name: String,
    image: String,
    title: String,

});

const People = mongoose.model('People', PeopleSchema)

//Middleware
app.use(cors()); //to prevent cors errors 
app.use(morgan("dev"));
app.use(express.json());


//Routes
//create a test route
app.get('/', (req, res) => {
    res.send('hello world');
});

//People index route
app.get('/people', async (req, res) => {
    try {
        //send all people
        res.json(await People.find({}));
    } catch (error) {
        //send error
        res.status(400).json(error);
    }
});

//People delete route
app.delete("/people/:id", async (req, res) => {
    try {
        res.json(await People.findByIdAndRemove(req.params.id))
    } catch (error) {
        //send error
        res.status(400).json(error);
    }
});

//People update route
app.put("/people/:id", async (req, res) => {
    try {
        //send all people
        res.json(
            await People.findByIdAndUpdate(req.params.id, req.body, { new: true })
        );
    } catch (error) {
        //send error
        res.status(400).json(error);
    }
});



//People Create Route
app.post('/people', async (req, res) => {
    //await response and send back json data that await People.create(req.body) creates
    try {
        res.json(await People.create(req.body))
    } catch (error) {
        res.status(400).json(error);
    }
})


//Listener
app.listen(PORT, () => console.log(`listening on PORT ${PORT}`));

