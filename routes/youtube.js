import express from 'express';
import youtubeController from '../controllers/youtube';

const youtubeRouter = express.Router();

youtubeRouter.get('/getMostPopularVideosByCountry', youtubeController.getMostPopularVideosByCountry);

export default youtubeRouter;