const rateLimit = require("express-rate-limit");
 
// EXPRESS-RATE-LIMIT CONFIGURATION FOR LOGIN SPECIFICALLY
const loginLimiter = rateLimit({
  max: 5, // max number of requests a user/ Ip address can make within  
  windowMS: 60000, // 60 seconds
  message: "You can't make any more login attemps at the moment. Try again in a minute",
  // handler "handles" what happens if limit is achievedd
  handler: (req, res, next, options) => {
    res.status(options.statusCode).send(options.message)
  },
  standardHeaders: true, // Return rate limit info in the "Ratelimit headers"
  legacyHeaders: false // Disable the "X-ratelimit headers"
});
 

// EXPORTS
module.exports = loginLimiter;