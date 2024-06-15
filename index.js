const express = require('express')
const cors = require('cors')
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId} = require('mongodb');

// middleware
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.q3baw43.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
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
        // Connect the client to the server	(optional starting in v4.7)
        //await client.connect();

        const tourCollection = client.db('tourDB').collection('tour')
        const userCollection = client.db('tourDB').collection('user');
        const countryCollection = client.db('tourDB').collection('country');

        // sending db data in json format to show in client side
        app.get('/tour', async (req, res) => {
            const cursor = tourCollection.find()
            const result = await cursor.toArray();
            res.send(result)
        })


        // sending db data in json format to show in client side
        app.get('/tourAsc', async (req, res) => {
            const cursor = tourCollection.find().sort({cost:1})
            const result = await cursor.toArray();
            res.send(result)
        })


        // finding tour to update the data in db
        app.get('/tour/:id', async (req, res) => {
            const id = req.params.id;
            const query = {_id: new ObjectId(id)}
            const result = await tourCollection.findOne(query)
            res.send(result)
        })

        // updating coffee in DB
        app.put('/tour/:id', async (req, res) => {
            const id = req.params.id;
            const filter = {_id: new ObjectId(id)}
            const options = { upsert: true }
            const updatedTour = req.body;
            const tour = {
                $set: {
                    photo: updatedTour.photo,
                    name: updatedTour.name,
                    cname: updatedTour.cname,
                    location: updatedTour.location,
                    details: updatedTour.details,
                    cost: updatedTour.cost,
                    season: updatedTour.season,
                    time: updatedTour.time,
                    visitors: updatedTour.visitors,
                    uname: updatedTour.uname,
                    email: updatedTour.email

                }
            }

            const result = await tourCollection.updateOne(filter, tour, options )
            res.send(result)
        })


        // "/my-list/:email" getting specific email tour data
        app.get('/my-list/:email', async (req, res) => {
            const email = req.params.email;
            const query = {email}
            const cursor = tourCollection.find(query)
            const result = await cursor.toArray();
            res.send(result)
        })

        //  getting specific country tour data
        app.get('/countries/:country', async (req, res) => {
            const cname = req.params.country;
            const query = {cname}
            const cursor = tourCollection.find(query)
            const result = await cursor.toArray();
            res.send(result)
        })



        // posting tour data to DB
        app.post('/tour', async (req, res) => {
            const newTour = req.body;
            console.log(newTour)
            const result = await tourCollection.insertOne(newTour)
            res.send(result)
        })

        // deleting tour in DB
        app.delete('/tour/:id', async (req, res) => {
            const id = req.params.id;
            const query = {_id: new ObjectId(id)}
            const result = await tourCollection.deleteOne(query)
            res.send(result)
        })



        // Todo: User related APIs

        // posting user data to DB-user-table
        app.post('/user', async (req, res) => {
            const user = req.body
            console.log(user)
            const result = await userCollection.insertOne(user)
            res.send(result)
        })

        // sending country db data in json format to show in client side
        app.get('/country', async (req, res) => {
            const cursor = countryCollection.find()
            const result = await cursor.toArray();
            res.send(result)
        })








        // Send a ping to confirm a successful connection
        //await client.db("admin").command({ ping: 1 });
        //console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Tour Spots server is Running')
})

app.listen(port, () => {
    console.log(`Tour Spots server is Running on port: ${port}`)
})