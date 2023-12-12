// a list of required frameworks and plug-ins that make our code more manageable
//express is what our back-end runs on
const express = require('express')
//an easier way to write express everytime
const app = express()
//connects us to our database 
const MongoClient = require('mongodb').MongoClient
//which port we use to connect to when the server goes live
const PORT = 2121

//gives us a secret place to hide our enviromental variables ie. passwords and such
require('dotenv').config()

//setting up the shortform to for our database and connecting to our database using our stored password in .env
let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'

    //connecting to our database then console logging a string of success after db becomes a storage vessel for the ddatabase string
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
    })
    //view engine is where we will go to find ejs where we write our html
app.set('view engine', 'ejs')
// connecting the public folder that holds our css and client side js
app.use(express.static('public'))
//a middleware that recognizes requests as strings or object
app.use(express.urlencoded({ extended: true }))
//same as .urlencoded but requests are packaged as json
app.use(express.json())

//we send a request to the database and await and answer then rendering our html,
//once an answer is received we fill out the list with our html our console logging an error
app.get('/',async (request, response)=>{
    const todoItems = await db.collection('todos').find().toArray()
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    response.render('index.ejs', { items: todoItems, left: itemsLeft })
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

//here we are adding to our database and subsequently to our <ul>
app.post('/addTodo', (request, response) => {
    //go into the db todos, add one object with the keys of thing and completed
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    //then... concsole log a confirmation and repsonded with a refresh
    .then(result => {
        console.log('Todo Added')
        response.redirect('/')
    })
    // if there is an error console log the error
    .catch(error => console.error(error))
})

//update an object in the database
app.put('/markComplete', (request, response) => {
    //go into the the database todos update the key thing with a request from our main.js
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            completed: true
          }
    },{
        //sort the lest from least to greatest
        sort: {_id: -1},
        upsert: false
    })
    .then(result => {
        //then confirm through the console a completed task and responed to the main.js
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    //print an error to the console if one exists
    .catch(error => console.error(error))

})

//
//the exact same thing but for an uncompleted task
//
app.put('/markUnComplete', (request, response) => {
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            completed: false
          }
    },{
        sort: {_id: -1},
        upsert: false
    })
    .then(result => {
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    .catch(error => console.error(error))

})
//de le te an object from the database
app.delete('/deleteItem', (request, response) => {
    //go into the database todos delete a single object with the key that matches the request
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    .then(result => {
        //then print a confirmation to the console and respond to the main.js
        console.log('Todo Deleted')
        response.json('Todo Deleted')
    })
    //if error print error ie. the shit didnt work
    .catch(error => console.error(error))

})
//set up a port to connect with users 
app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})