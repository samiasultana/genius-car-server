// npm i express mongodb cors dotenv initially so that all necessary modules are present in the server. now go to the express and copy all from hello world
const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');

// import ObjectId and set to services/:id
const ObjectId = require("mongodb").ObjectId;

require('dotenv').config(); //install dotenv and use here. it will help to keep mongo password secret from github. Then create a .env file and paste NAME=VALUE from dotenv site. Password and user value should be taken from mongodb atlas>security>database access>add new. Then keep the const uri inside ``

const app = express();
app.use(cors());
app.use(express.json()); //without it, res.send is undefined.It's used to get json data from the client side

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

    // GET API 
    app.get("/services", async (req, res) => {
      const cursor = serviceCollection.find({});
      const services = await cursor.toArray();
      res.send(services) //data load complete in server 5000. now paste this link to fetch in services.js, then services.json will no longer in use
    })

    // GET Single Service
    app.get("/services/:id", async (req, res) => {
      const id = req.params.id;
      console.log("specific service");
      const query = { _id: ObjectId(id) };
      const service = await serviceCollection.findOne(query);
      res.json(service);
    })

    // POST API
    app.post("/services", async (req, res) => {
      const service = req.body;
      console.log("hit post api", service);
      // const service = {
      //   "name": "ENGINE DIAGNOSTIC",
      //   "price": "300",
      //   "description": "Lorem ipsum dolor sit amet, consectetu radipisi cing elitBeatae autem aperiam nequ quaera molestias voluptatibus harum ametipsa.",
      //   "img": "https://i.ibb.co/dGDkr4v/1.jpg"
      // }

      const result = await serviceCollection.insertOne(service);
      // res.send("post hit")
      res.json(result) //this will send the data to cloud and give you an ObjectId in server. data>data>insertedId in console 
      console.log(result);

    })

    // DELETE API
    app.delete("/services/:id", async (req, res) => {
      const id = req.params.id; 
      const query={_id:ObjectId(id)};
      const result=await serviceCollection.deleteOne(query);
      res.json(result);
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