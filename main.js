require('dotenv').config();
const { TwitterApi, TwitterV2IncludesHelper } = require('twitter-api-v2');

const client = new TwitterApi(process.env.BEARER_TOKEN);
const roClient = client.readOnly.v2;

let userId = '';

async function getID(username){
  const userinfo = await roClient.userByUsername(username);
  if(userinfo.data === undefined) reject('Cannot fetch userdata!');
  userId = userinfo.data.id;
}

console.log(userId);

module.exports = async (username) => { 
  await getID(username);

  const likes = await roClient.userLikedTweets(userId, {'user.fields': ['profile_image_url'],expansions: ["author_id"]});
  // count the frequency of author_id
  const authorIds = likes.tweets.map(tweet => tweet.author_id);
  // get the top authors and sort them by frequency
  const topAuthors = authorIds.reduce((acc, curr) => {
  if(acc[curr] === undefined){
    acc[curr] = 1;
  } else {
    acc[curr]++;
  }
        return acc;
  } ,{});
  let topLikedAuthor = Object.keys(topAuthors)[0];
  for (let [key, value] of Object.entries(topAuthors)) {
      if(value > topAuthors[topLikedAuthor]){
        topLikedAuthor = key;
      }
  }
  
  //console.log(topLikedAuthor);

  const includes = new TwitterV2IncludesHelper(likes);
  topLikedAuthor = await includes.userById(topLikedAuthor);
  //console.log(topLikedAuthor);

  return topLikedAuthor;
  // get recent reply tweets and retweets of the user with author id
  //const tweets = await roClient.userTimeline(userId, {expansions: ["in_reply_to_user_id","referenced_tweets","author_id"]});
}