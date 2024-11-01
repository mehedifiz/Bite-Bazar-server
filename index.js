// server.js
const express = require('express');
const jwt = require('jsonwebtoken');

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', // Allow only requests from your frontend
  credentials: true // Allow cookies and authorization headers
}));
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

      //middleware 

      app.post('/jwt' , async(req , res )=>{
        const user = req.body;
        // console.log('user',user)
        const token = jwt.sign(user , process.env.ACCESS_TOKEN_SECRET ,{
          expiresIn:'1h'})
  
        res.send({token})
      })




        const verifyToken = (req , res , next )=>{
          // console.log('token verify ' , req.headers.authorization)

          if(!req.headers.authorization){
            return res.status(401).send({mess : 'forbidden'})
          }
          const token =req.headers.authorization.split(' ')[1];
           
          jwt.verify(token ,process.env.ACCESS_TOKEN_SECRET  , (err , decode )=>{
            if(err){
            return res.status(401).send({mess : 'forbidden'})

            }

            req.decode = decode;
            next()
          } )

        }

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


      //ADD FOOD 
      app.post('/addfoods' , verifyToken, async(req , res)=>{

        const item = req.body;
        console.log(item)
        const result = await allfoodsDB.insertOne(item);
        res.send(result)

      })

      app.get('/myfoods/:email' ,verifyToken, async(req , res )=>{
          const email = req.params.email;
          const query = {'email' : email}
          const result = await allfoodsDB.find(query).toArray();
          console.log( result)

          res.send(result)
           
      })

      app.delete('/myfoods/:id',async (req , res)=>{
        const id = req.params.id;
        const query = {_id : new ObjectId(id)};
        console.log(id)
        const result =await allfoodsDB.deleteOne(query)
        console.log( result)

        res.send(result)
      })


      app.get('/food/:id' , async(req , res )=>{
        const id = req.params.id ;
        console.log(id)
        const query ={_id : new ObjectId (id)};
         const result = await allfoodsDB.findOne(query);
         console.log(result)
         res.send(result)
      })

        app.patch('/update/:id' , async(req , res)=>{
          const id = new ObjectId(req.params.id)
          console.log(id)
          const query = {_id : id};
          const data = req.body;
          // console.log(data)

          const updateDoc = {
            $set:{ 
                ...data
            }
          }
            const result = await allfoodsDB.updateOne(query , updateDoc);
            console.log(result);
            res.send(result)
        })











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