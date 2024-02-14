//   means we have the stripe object


const dotenv = require("dotenv");
dotenv.config();


const stripeAPI = require("stripe")(process.env.STRIPE_SECRET_KEY);

module.exports = stripeAPI;
