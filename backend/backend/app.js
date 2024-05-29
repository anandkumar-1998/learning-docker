const express = require('express');
const app = express();
require('dotenv').config({
    path: "backend/config/config.env"
})
const morgan = require('morgan')
const cors = require('cors');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const http = require('http');

// js files
const { connectDatabase } = require('./config/database');
const errorMiddleware = require('./middleware/error');
const productRoute = require('./routes/productRoute')
const orderRoute = require('./routes/orderRoute')
app.use(cors({origin: "*"}));
app.use(express.json());
app.use(function(req, res, next){
    res.setHeader("Access-Control-Allow-Origin","*");
    res.setHeader("Access-Control-Allow-Methods","GET, POST, PUT, DELETE");
    res.setHeader("Access-Control-Allow-Headers","Content-Type");
    res.setHeader("Access-Control-Allow-Credentials",true)
    next()
});

app.use(bodyParser.urlencoded({extended: true}));
app.use(helmet());
app.use(
    morgan(":method :url :status :res[content-length] - :response-time ms")
  );

app.use(errorMiddleware);

const port = process.env.PORT || 5001;
let server = http.createServer(app)

connectDatabase()
app.use("/api/v1", productRoute);
app.use("/api/v1", orderRoute);


server.listen(port, ()=>{
    console.log(`Server is working on http://localhost:${port}`);
});

// Handling Uncaught Exception
process.on("uncaughtException", (err) => {
    console.log(`Error: ${err.message}`);
    console.log(`Shutting down the server due to Uncaught Exception`);
    process.exit(1);
});

// Unhandling Promise Rejection
process.on("unhandledRejection", (error)=>{
    console.log(`Error: ${error.message}`);
    console.log(`Shutting down the serve due to Unhandled Promise Rejection`);

    server.close(()=>{
        process.exit(1)
    })
})