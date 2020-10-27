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
      const file = req.files.file;
      const name = req.body.name;
      const description = req.body.description;
      const newImg = file.data;
      const encImg = newImg.toString('base64');
  
        var image = {
          contentType: file.mimetype,
          size: file.size,
          img: Buffer.from(encImg,'base64')
        }
  
        WorksCollection.insertOne({ name, description, image })
          .then(result => {
              res.send(result.insertedCount > 0)   
        })     
    })

  app.get('/works', (req, res) => {
    WorksCollection.find({})
      .toArray((err, documents) => {
      res.send(documents)
    })
})

app.delete('/delete/:num', (req, res) => {
  // volunteerCollection.deleteOne({ _id: ObjectId(req.params.id) })
  volunteerCollection.deleteOne({ _id: ObjectId(req.params.num) })
    .then(result => {
      res.send(result.deletedCount > 0)
  })
})


});

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(process.env.PORT || port)