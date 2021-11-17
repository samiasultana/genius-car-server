// npm i express mongodb cors dotenv initially so that all necessary modules are present in the server. now go to the express and copy all from hello world
const express = require('express');
const { MongoClient } = require('mongodb');
require('dotenv').config(); //install dotenv and use here. it will help to keep mongo password secret from github. Then create a .env file and paste NAME=VALUE from dotenv site. Password and user value should be taken from mongodb atlas>security>database access>add new. Then keep the const uri inside ``

var cors = require('cors');
const app = express();
app.use(cors());
const port = process.env.PORT || 5000;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zyodo.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
  try {
    await client.connect();
    // console.log("connected to db");
    const database = client.db("carMechanic");
    const serviceCollection = database.collection("Collection of service");

    // POST API
    app.post("/services", async (req, res) => {
      const service = {
        "name": "ENGINE DIAGNOSTIC",
        "price": "300",
        "description": "Lorem ipsum dolor sit amet, consectetu radipisi cing elitBeatae autem aperiam nequ quaera molestias voluptatibus harum ametipsa.",
        "img": "https://i.ibb.co/dGDkr4v/1.jpg"
      }

      const result = await serviceCollection.insertOne(service);
      console.log(result);

    })
  }
  finally {
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})