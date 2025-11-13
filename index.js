const express = require( "express");
const cors = require("cors");
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 3000;

//middleware
app.use(cors());
app.use(express.json());

// mongodb connection
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.znmkoxj.mongodb.net/?appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();
    // write crud
    const db = client.db('homenest-db')
    const propertyCollection = db.collection('properties')

    //find + find one
    //all property find
    app.get('/properties', async(req,res)=>{

        const result = await propertyCollection.find().toArray();
        // console.log(result) //checked ok http://localhost:3000/properties
        
        res.send(result) 
    })

    //single property find
    app.get('/properties/:id',async(req,res)=>{
      const {id} = req.params
      console.log(id) //checked ok http://localhost:3000/properties/691209119d38afb65aaf6dad

      const objectId = new ObjectId(id)
      const result = await propertyCollection.findOne({_id: objectId})
      res.send({
        success: true,
        result
      })
    })

    //insert + insertOne > Post
    app.post('/properties', async(req,res)=>{
      const data= req.body
      // console.log(data) 
      const result = await propertyCollection.insertOne(data)
      res.send({
        success: true,
        result
      })
    })

    //Put --> updateOne/UpdateMany
    app.put('/properties/:id',async(req,res)=>{
      const {id} =req.params
      const data = req.body
      // console.log(id)
      // console.log(data)
      const objectId = new ObjectId(id)

      const filter = {_id: objectId}
      const update = {
        $set: data
      }

      const result = await propertyCollection.updateOne(filter, update)

      res.send({
    success: true,
    result
  });
    })

    //delete - deleteone-deletemany
    app.delete('/properties/:id',async(req,res)=>{
      const {id} = req.params
      // console.log(id)
      const objectId = new ObjectId(id)
      const filter = {_id: objectId}

      const result = await propertyCollection.deleteOne(filter)

      res.send({
        success: true,
        result
      })
    })

    // recent/latest 6-7 data by sort homepage get-find -time.

    app.get('/latest-propertises', async(req,res)=>{
      const result = await propertyCollection.find().sort({createdAt: -1}).limit(6).toArray()

      res.send(result)
      console.log(result)
    })

    


    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Homenest-10 World !!!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

