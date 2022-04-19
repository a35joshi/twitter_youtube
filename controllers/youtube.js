import dotenv from 'dotenv';
import path from 'path'; 
import axios from 'axios';

dotenv.config({ 
    path: path.resolve('./environmental_files/.env') 
})

const BASE_URL = 'https://www.googleapis.com/youtube/v3/videos';

export const getMostPopularVideosByCountry = async (regionCode) => {
    const popularItems = await axios.get(`${BASE_URL}?part=contentDetails&chart=mostPopular&regionCode=${regionCode}&maxResults=25&key=${process.env.GOOGLE_API_KEY}`).then((res) => {
        return res.data || []
    });

    const videos = await Promise.all(popularItems.items.map((video) => {
        return axios.get(`${BASE_URL}?part=snippet&id=${video.id}&key=${process.env.GOOGLE_API_KEY}`).then((res) => {
            return res.data
        })
    }))

    return videos.map((video) => {
        const item = video.items[0];
        const snippet = item.snippet;

        return {
            id: item.id,
            title: snippet.title,
            channelTitle: snippet.channelTitle,
            tags: snippet.tags || []
        } 
    })
}

class youtubeController {
    static async getMostPopularVideosByCountry(req, res) {
        const videos = await getMostPopularVideosByCountry(req.query.country);
        return res.json({
            videos 
        })
    }
}

export default youtubeController;