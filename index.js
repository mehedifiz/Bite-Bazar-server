// server.js
const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json()); // for parsing application/json

// MongoDB connection
const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

 

// Connect to MongoDB and define routes
async function run() {
  try {
    await client.connect();  

    const allfoodsDB = client.db('Bite-Bazar').collection('Allfoods');
    const topFoods = client.db('Bite-Bazar').collection('topfods');


    //all fooods 
    app.get('/allfoods', async (req, res) => {
    
          const result = await allfoodsDB.find().toArray();
          res.send(result);
       
      });
    //top fooods 
    app.get('/topfoods', async (req, res) => {
    
          const result = await topFoods.find().toArray();
          res.send(result);
       
      });












    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

   
   

  } catch (err) {
    console.error('MongoDB connection error:', err);
  }
}

// Start the Express server after connecting to MongoDB
app.get('/', (req, res) => {
  res.send('Server is running');
});

// Connect to MongoDB and then start the server
run().catch(console.dir); 

app.get('/', (req, res) => {
  res.send('   server is running');
});

app.listen(port, () => {
  console.log(`   server is running on port: ${port}`);
});