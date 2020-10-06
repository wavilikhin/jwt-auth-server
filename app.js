require(`dotenv`).config();
const express = require('express');
const app = express();

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

const usersRoute = require('./routes/users/users');
app.use(`/users`, usersRoute);
