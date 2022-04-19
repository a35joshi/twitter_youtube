import { postThread } from './twitter.js';
import { getMostPopularVideosByCountry } from './youtube.js';
import moment from 'moment-timezone';
import twitterText from 'twitter-text';

const getTweetWithHashTag = (tweet, hashTag) => {
  return `${tweet}${hashTag} `
}

const getIntroductoryTweet = (index, title, channelTitle) => {
  return `${index + 1}. ${title} - ${channelTitle}`
}

const getTweetLength = (tweet) => {
  return twitterText.parseTweet(tweet).weightedLength;
}

const timezones = {
  'IN': 'Asia/Kolkata',
  'CA': 'America/Toronto',
  'GB': 'Europe/London'
}

const flagEmojis = {
  'IN': '🇮🇳',
  'CA':  '🇨🇦',
  'GB': '🇬🇧'
}

const MAX_TWEET_LENGTH = 280;

export const tweetMostPopularVideos = async (regionCode) => {
  console.log(`${regionCode} coming up.`)

  let videos = await getMostPopularVideosByCountry(regionCode);

  let introductoryTweets = []
  let tweet = `Top 25 trending YouTube videos in ${flagEmojis[regionCode]} \n 📅 ${moment().tz(timezones[regionCode]).format('dddd, MMMM Do YYYY, h:mm A')}\n`;

  videos.forEach((video, index) => {
    let tempTweet = `${tweet}${getIntroductoryTweet(index, video.title, video.channelTitle)}\n`

    if(getTweetLength(tempTweet) > MAX_TWEET_LENGTH) {
      introductoryTweets.push(tweet.slice(0, MAX_TWEET_LENGTH))
      tweet = `${getIntroductoryTweet(index, video.title, video.channelTitle)}\n`;
    }
    else {
      tweet = tempTweet
    }

    if(index === videos.length - 1) {
      introductoryTweets.push(tweet.slice(0, MAX_TWEET_LENGTH))
    }
  })

  let individualTweets = videos.map((video, index) => {
      let tweet = `${index + 1}. ${video.title}\nhttp://youtube.com/watch?v=${video.id}&feature=emb_title\n\n`;

      for (let tag of video.tags) {
        const hashTag = `#${tag.replace(/\s/g, '')}`
        if(getTweetLength(getTweetWithHashTag(tweet, hashTag)) > MAX_TWEET_LENGTH) {
          break
        }
        tweet = getTweetWithHashTag(tweet, hashTag)
      }
      
      return tweet
  }) 

  await postThread([...introductoryTweets, ...individualTweets].map((tweet) => {
    return tweet.replace('@', '')
  }), regionCode)
}