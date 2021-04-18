const Twit = require("twit");

// require("dotenv").config("../.env");

const twit = new Twit({
  consumer_key: process.env.API_KEY,
  consumer_secret: process.env.API_SECRET,
  access_token: process.env.ACCESS_TOKEN,
  access_token_secret: process.env.ACCESS_SECRET,
});

const mediaArtsSearch = {
  q: "#plasma",
  count: 10,
  result_type: "recent",
};

module.exports = async function (context, req) {
  await twit
    .get("search/tweets", mediaArtsSearch, (error, data) => {
      if (!error) {
        data.statuses.forEach((status) => {
          let retweetId = status.id_str;
          twit.post("statuses/retweet/" + retweetId, {}, (error, response) => {
            if (response) {
              console.log(
                "Success! Check your bot, it should have retweeted something."
              );
            }
            if (error) {
              console.log("There was an error with Twitter:", error);
            }
          });
        });
      } else {
        console.log("There was an error with your hashtag search:", error);
        context.res = {
          body: error.message,
        };
      }
    })
    .then(() => {
      context.res = {
        body: "done",
      };
    });
};
