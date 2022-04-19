import express from 'express';
import twitterController from '../controllers/twitter';

const twitterRouter = express.Router();

twitterRouter.post('/postThread', twitterController.postThread);

export default twitterRouter;