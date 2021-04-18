const Twit = require("twit");

// require("dotenv").config("../.env");

const twit = new Twit({
  consumer_key: process.env.API_KEY,
  consumer_secret: process.env.API_SECRET,
  access_token: process.env.ACCESS_TOKEN,
  access_token_secret: process.env.ACCESS_SECRET,
});

const mediaArtsSearch = {
  q: "plasma require",
  count: 100,
  result_type: "recent",
};

module.exports = async function (context, req) {
  let res;
  twit.get("search/tweets", mediaArtsSearch, (error, data) => {
    if (!error) {
      data.statuses.forEach((status) => {
        let retweetId = status.id_str;
        twit.post("statuses/retweet/" + retweetId, {}, (error, response) => {
          if (response) {
            res = response;
            console.log(
              "Success! Check your bot, it should have retweeted something."
            );
          }
          if (error) {
            res = error;
            console.log("There was an error with Twitter:", error);
          }
        });
      });
    } else {
      res = error;
      console.log("There was an error with your hashtag search:", error);
    }
  });

  context.res = {
    body: res,
  };
};
