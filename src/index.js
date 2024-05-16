const { config } = require("dotenv");
const express = require("express");
const session = require("express-session");
const { join } = require("path");

config({ path: join(__dirname, "../.env") });

// routes
const routes = require("./routes");

// env
const { PORT, SESSION_SECRET_KEY } = process.env;

if (!PORT || !SESSION_SECRET_KEY) {
  throw new Error(
    "Configure env variables for { PORT } AND { SESSION_SECRET_KEY }"
  );
}

const app = express();

app.use(
  session({
    secret: SESSION_SECRET_KEY,
    resave: false,
    saveUninitialized: true,
  })
);

app.use(express.json());

app.use(routes);

app.listen(PORT, () => {
  console.log(`Server is listening on PORT ${PORT}`);
});
