const express = require('express')
const app = express()
const path = require('path')
const mustacheExpress = require('mustache-express');
const bodyParser = require('body-parser')
const config = require('config')
const mysql = require('mysql')

app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())
app.engine('mustache', mustacheExpress())
app.set('views', './views')
app.set('view engine', 'mustache')
app.use(express.static(path.join(__dirname, 'static')))

const conn = mysql.createConnection({
  host: config.get('db.host'),
  database: config.get('db.database'),
  user: config.get('db.user'),
  password: config.get('db.password')
})

//I'm splitting the API into two sides: vendor and customer. Starting off work with the vendor side.

// Using this app.post as the form to add items to the vending machine. This is the vendor side.
app.post("/add", function(req, res, next){
  const item = req.body.item
  const description = req.body.description
  const quantity = req.body.quantity
  const purchase_time = req.body.purchase_time
  const item_price = req.body.item_price

  const sql = `
    INSERT INTO vendor (item, description, quantity, purchase_time, item_price)
    VALUES (?, ?, ?, ?, ?)
  `

  conn.query(sql, [item, description, quantity, purchase_time, item_price], function(err, results, fields){
    if (!err) {
      console.log('It seems to work')
      res.redirect("/")
    } else {
      console.log(err)
      res.send("Fix it!!!")
    }
  })
})

// Next up, trying to get all the data to show up on the index. So far, it'll show up in the terminal. On the page, is an entirely different story.
app.get("/", function(req, res, next){
  const sql = `
    SELECT * FROM vendor
  `
  conn.query(sql, function(err, results, fields){
    console.log(results)

    const cxt = {
      vendor: results
    }
      res.render("index", cxt)
  })
})


app.listen(3000, function(){
  console.log("App running on port 3000")
})
