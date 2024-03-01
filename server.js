const express = require("express");
require("dotenv").config();

const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const cors = require("cors");

const app = express();

// RATE LIMITING AND SECURITY MIDDLEWARE
const limiter = rateLimit({
  windowMs: 2 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
  standardHeaders: "draft-7", // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
});

app.use(limiter);
app.use(helmet());
app.use(cors());

// provide JSON body to routes
app.use(express.json());

// ROUTES HERE
app.use("/results", require("./routes/results"));

// UNMATCHES ROUTES
app.use((req, res) => {
  res.status(404).send("Page not found");
});

// ERROR HANDLING
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

// START SERVER
const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`SERVER RUNNING on port ${PORT}`);
});
