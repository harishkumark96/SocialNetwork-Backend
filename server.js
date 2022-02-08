const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
// const logger = require('morgan');
const cors = require('cors');

const app = express();
app.use(cors());

const http =require('http')
const server = http.createServer(app);
const io = require('socket.io')(server, {
    cors: {
        origin: "http://localhost:4200",
        methods: ["GET", "POST"],
        allowedHeaders: ["content-type"]
      }
});
// io.origins(["http://localhost:4200"]);

require('./socket/streams')(io);
app.use((req, res, next)  => {
    res.header("Access-Control-Allow-Origin", "*", {});
    res.header("Access-Control-Allow-Credentials", "true");
    res.header('Access-Control-Allow-Methods', 'GET', 'POST', 'DELETE', 'PUT', 'OPTIONS');
    res.header("Access-Control-Allow-Headers", "Origin, X-PINGOTHER, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});

const dbconfig = require('./config/secret');
const auth = require('./routes/authRoutes');
const posts= require('./routes/postRoutes');
const users= require('./routes/userRoutes');
const friends= require('./routes/friendsRoutes');
const images = require('./routes/imageRoute')


app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({extended:true, limit:'50mb'}));
app.use(cookieParser());
// app.use(logger('dev'));

mongoose.Promise =global.Promise;
mongoose.connect(
    dbconfig.url, 
{ 
    useNewUrlParser: true ,
    useUnifiedTopology: true
}
);

app.use('/api/chatapp', auth);
app.use('/api/chatapp', posts); 
app.use('/api/chatapp', users);
app.use('/api/chatapp', friends);
app.use('/api/chatapp', images);

server.listen(3000, ()=>{
    console.log('running on port 3000')
})
  