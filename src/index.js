import express from 'express';
import bodyParser from 'body-parser';
import youtubeRouter from '../routes/youtube';
import twitterRouter from '../routes/twitter';
import compression from 'compression';

const app = express();

// Configuring Express to use body-parser for the middle-ware.
app.use(function(_req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(compression());
app.use('/youtube', youtubeRouter);
app.use('/twitter', twitterRouter);

// Start listening to the server
app.listen(process.env.PORT);