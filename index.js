const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = process.env.PORT || 5000;
const app = express();
require("dotenv").config();

//Middleware
app.use(cors());
app.use(express.json());

//mongoDB
//user name - volunteer_networkDB
//password - LSRJHykkrErtcpa8

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.b8vg83y.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
async function run() {
  try {
    const eventCollection = client
      .db("Volunteer_networkDB")
      .collection("events");

    //event Api
    app.post("/events", async (req, res) => {
      const event = req.body;
      const result = await eventCollection.insertOne(event);
      res.send(result);
    });
    app.get("/events", async (req, res) => {
      let query = {};
      if (req.query.email) {
        query = {
          email: req.query.email,
        };
      }
      const cursor = eventCollection.find(query);
      const events = await cursor.toArray();
      res.send(events);
    });
    app.patch("/events/:id", async (req, res) => {
      const id = req.params.id;
      const status = req.body.status;
      const query = { _id: ObjectId(id) };
      const updatedDoc = {
        $set: {
          status: status,
        },
      };
      const result = await eventCollection.updateOne(query, updatedDoc);
      res.send(result);
    });
  } finally {
  }
}
run().catch((err) => console.error(err));

app.get("/", (req, res) => {
  res.send("Vounteer netword Server is Running");
});

app.listen(port, () => {
  console.log(`Server Running in Port ${port}`);
});
