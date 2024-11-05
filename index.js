// server.js
const express = require("express");

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cors = require("cors");
require("dotenv").config(); 

const app = express();
const port = process.env.PORT || 5000;

// CORS options
const corsOptions = {
  origin: [
    'http://localhost:5173',
    'https://bite-bazar.web.app'
  ],
  credentials: true,  
};

app.use(cors(corsOptions));
app.use(express.json());

// MongoDB connection
const uri =`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ensactw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // await client.connect();

    const allfoodsDB = client.db("Bite-Bazar").collection("Allfoods");
    const topFoods = client.db("Bite-Bazar").collection("topfods");
    const PurchaseDB = client.db("Bite-Bazar").collection("Purchase");
    const gallaryDb = client.db("Bite-Bazar").collection("gallary");

    //middleware

  

     

  // All foods endpoint with pagination and total count
app.get("/allfoods", async (req, res) => {
  console.log(req.query);
  const search = req.query.search
  const page = parseInt(req.query.page) 
  const size = parseInt(req.query.size) 
  const total = await allfoodsDB.estimatedDocumentCount();
  const query ={
     name : {$regex: search }
    
    }
   
  const result = await allfoodsDB.find(query)
      .skip(page * size)  
      .limit(size)      
      .toArray();

 
  res.send({ foods: result, total });  
});

    // gallary 

    app.get('/gallery' , async(req , res )=>{
      const page = parseInt(req.query.page);
      const limit = parseInt(req.query.limit);

      const skip = (page - 1) * limit;

      const result = await gallaryDb.find().skip(skip).limit(limit).toArray();
      console.log(result)
      res.send(result)
    })


    app.post('/gallery' , async(req ,res )=>{
      const data = req.body;
      console.log(data);
      const result = await gallaryDb.insertOne(data);
      console.log(result)
      res.send(result)
    })





    //top fooods
    app.get("/topfoods", async (req, res) => {
      const result = await topFoods.find().toArray();
      res.send(result);
    });

    //ADD FOOD
    app.post("/addfoods", async (req, res) => {
      const item = req.body;
      console.log(item);
      const result = await allfoodsDB.insertOne(item);
      res.send(result);
    });

    app.get("/myfoods/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const result = await allfoodsDB.find(query).toArray();
      console.log(result);

      res.send(result);
    });

    app.delete("/myfoods/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      console.log(id);
      const result = await allfoodsDB.deleteOne(query);
      console.log(result);

      res.send(result);
    });

    app.get("/food/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const query = { _id: new ObjectId(id) };
      const result = await allfoodsDB.findOne(query);
      console.log(result);
      res.send(result);
    });

    app.patch("/update/:id", async (req, res) => {
      const id = new ObjectId(req.params.id);
      console.log(id);
      const query = { _id: id };
      const data = req.body;
      // console.log(data)

      const updateDoc = {
        $set: {
          ...data,
        },
      };
      const result = await allfoodsDB.updateOne(query, updateDoc);
      console.log(result);
      res.send(result);
    });

    //Purchase
    app.post('/purchase' , async(req , res)=>{
      const data = req.body;
      const result = await PurchaseDB.insertOne(data);
      res.send(result)

    });

  app.get('/purchase/:email' , async(req , res )=>{
    const email = req.params.email;
    console.log(email)
  const query = {email : email}
    const result = await PurchaseDB.find(query).toArray()
    // console.log(result);

    res.send(result)
  })

  app.delete("/purchase/:id", async (req, res) => {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };
    // console.log(id);
    const result = await PurchaseDB.deleteOne(query);
    console.log(result);

    res.send(result);
  });

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }
}

// Start the Express server after connecting to MongoDB
app.get("/", (req, res) => {
  res.send("Server is running");
});

// Connect to MongoDB and then start the server
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("   server is running");
});

app.listen(port, () => {
  console.log(`   server is running on port: ${port}`);
});
