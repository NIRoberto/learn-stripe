const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const createCheckoutSession = require("./api/checkout");
const webhook = require("./api/webhook");
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;
app.use(
  express.json({
    verify: (req, res, buf) => (req.rawBody = buf),
  })
);
app.use(
  cors({
    origin: true,
  })
);
app.get("/", (req, res) => {
  res.send("Hello World");
});
app.post("/create-checkout-session", createCheckoutSession);

app.post("/webhook", webhook);


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
