const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId

require('dotenv').config()
const app = express()

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fbxpl.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

app.use(bodyParser.json())
app.use(cors())

const port = 5000

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true  });
client.connect(err => {
  const WorksCollection = client.db("volunteer").collection("works");
  const volunteerCollection = client.db("volunteer").collection("volunteerInfo");


  app.post('/addVolunteerTasks', (req, res) => {
    const tasks = req.body;
    volunteerCollection.insertOne(tasks)
      .then(result => {
      res.send(result.insertedCount > 0)
     })
  })
  
    app.get('/activities', (req, res) => {
      volunteerCollection.find({email: req.query.email})
        .toArray((err, documents) => {
        res.send(documents)
      })
    })

    app.get('/activitieslist', (req, res) => {
      volunteerCollection.find({})
        .toArray((err, documents) => {
        res.send(documents)
      })
    })

  app.post('/addWorks', (req, res) => {
    const works = req.body;
    WorksCollection.insertOne(works)
      .then(result => {
      res.send(result.insertedCount)
     })
  })

  app.get('/works', (req, res) => {
    WorksCollection.find({}).limit(20)
      .toArray((err, documents) => {
      res.send(documents)
    })
})

app.delete('/delete/:id', (req, res) => {
  volunteerCollection.deleteOne({ _id: ObjectId(req.params.id) })
    .then(result => {
      res.send(result.deletedCount > 0)
  })
})


});

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(process.env.PORT || port)