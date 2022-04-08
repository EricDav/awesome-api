const express = require('express');
const cors = require('cors');

const app = express();
require('dotenv').config()

const env = process.env;

const index = require('./src/routes/index');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.json({ type: 'application/vnd.api+json' }));
app.use(cors());

app.use(index);

const port = process.env.PORT || 4000;

app.listen(port, () => {
    console.log(`App running on port ${port}.`)
})
