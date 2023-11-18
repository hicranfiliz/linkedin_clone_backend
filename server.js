require('dotenv').config();
const express = require('express');

const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3500;

app.use(cors());
app.use(express.json());

app.use('/api',require('./routes/generalRoutes'));

mongoose.connect(
    process.env.MONGO_URL, {

    }
).then(() => {
    app.listen(PORT, () => console.log(`SERVER PORT ${PORT}`))
}).catch((error) => console.log(`${error}`))