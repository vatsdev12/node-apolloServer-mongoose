
require('dotenv');
const fs = require('fs');
const { ApolloServer, gql } = require('apollo-server-express')
const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');
const expressJwt = require('express-jwt');
const jwt = require('jsonwebtoken');
const db = require('./db');
const mongoose = require('mongoose')
const port = 9000;
const jwtSecret = Buffer.from(process.env.JWT_SECRET, 'base64');

const app = express();
app.use(cors(), bodyParser.json(), expressJwt({
  secret: jwtSecret,
  credentialsRequired: false
}))




const typeDefs = gql(fs.readFileSync("./schema.graphql", { encoding: "utf-8" }));


mongoose.connect(`mongodb://127.0.0.1/${process.env.DB_NAME}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(function (result) {
    console.log("connection establish");
  })
  .catch(function (error) {
    console.log("error occur", error);
  })


const resolvers = require('./resolvers');

const context = async ({ req }) => {
  return { user: req.user && await db.users.findOne({ _id: req.user.sub }) }
};


const apolloServer = new ApolloServer({ typeDefs, resolvers, context });
apolloServer.applyMiddleware({ app, path: "/graphql" })


app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await db.users.findOne({ email: email, password: password });
  if (!(user)) {
    res.sendStatus(401);
    return;
  }
  const token = jwt.sign({ sub: user._id }, jwtSecret);
  res.send({ token });
});

app.listen(port, () => console.info(`Server started on port ${port}`));
