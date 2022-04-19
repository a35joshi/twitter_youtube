import dotenv from 'dotenv';
import path from 'path'; 
import { TwitterApi } from 'twitter-api-v2';

export const postThread = async (tweets, regionCode) => {
    dotenv.config({ 
        path: path.resolve(`./environmental_files/.env${regionCode ? `.${regionCode}` : ''}`) 
    })
    
    const twitterClient = new TwitterApi({
        appKey: process.env.TWITTER_APP_KEY,
        appSecret: process.env.TWITTER_APP_SECRET,
        accessToken: process.env.TWITTER_ACCESS_TOKEN,
        accessSecret: process.env.TWITTER_ACCESS_SECRET,
    });
    
    return await twitterClient.v2.tweetThread(tweets).then((res) => {
        return res.map((result) => {
            return {
                ...result,
            }
        });
    }).catch((err) => {
        console.log(JSON.stringify(err))
        return err;
    })
}

class twitterController {
    static async postThread(req, res) {        
        await postThread(req.body.tweets);
        return res.json({
            success: true
        })
    }
}

export default twitterController;