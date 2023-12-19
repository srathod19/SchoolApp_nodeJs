require("dotenv").config();
const express = require('express');
const cors = require('cors')
const bodyParser = require('body-parser')
const app = express();
const db = require('./config/database')
const port = 3000;
const userRoute = require('./routes/userRoutes')

app.use(cors());
app.use(express.json())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use('/api', userRoute);
app.use((err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error";
    res.status(err.statusCode).json({
        message: err.message,

    })
});
app.listen(port, () => {
    console.log(`Server is running  on  :${port}`);
})
