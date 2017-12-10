
var express = require("express")
var Sequelize = require("sequelize")
var nodeadmin = require("nodeadmin")

//connect to mysql database
var sequelize = new Sequelize('database', 'root', '', {
    dialect:'mysql',
    host:'localhost'
    
})

sequelize.authenticate().then(function(){
    console.log('Success')
})

//define a new Model
var Book = sequelize.define('Book', {
    Title: Sequelize.STRING,
    Author: Sequelize.STRING,
    idCategory: Sequelize.INTEGER,
    Description: Sequelize.STRING,
    Price: Sequelize.INTEGER,
    Image: Sequelize.STRING,
    idUser: Sequelize.INTEGER
})

var User = sequelize.define('User', {
username: Sequelize.STRING,
    password: Sequelize.STRING,
    email : Sequelize.STRING,
    
})

var Category = sequelize.define('Category',{
    CategoryType: Sequelize.STRING
}
)



Book.belongsTo(User, {foreignKey: 'idUser', targetKey: 'id'})


var app = express()

app.use('/nodeamin', nodeadmin(app))

//access static files
app.use(express.static('public'))
app.use('index', express.static('index'))

app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded()); // to support URL-encoded bodies


app.get('/Book', function(request, response) {
    Book.findAll().then(function(Book){
        response.status(200).send(Book)
    })
        
})


app.get('/Book/:id', function(request, response) {
   Book.findOne({where: {id:request.params.id}}).then(function(Book) {
        if(Book) {
            response.status(200).send(Book)
        } else {
            response.status(404).send()
        }
    })
})


app.post('/Book', function(request, response) {
   Book.create(request.body).then(function(Book) {
        response.status(201).send(Book)
    })
})

app.put('/Book/:id', function(request, response) {
    Book.findById(request.params.id).then(function(Book) {
        if(Book) {
            Book.update(request.body).then(function(Book){
                response.status(201).send(Book)
            }).catch(function(error) {
                response.status(200).send(error)
            })
        } else {
            response.status(404).send('Not found')
        }
    })
})

app.delete('/Book/:id', function(request, response) {
    Book.findById(request.params.id).then(function(Book) {
        if(Book) {
            Book.destroy().then(function(){
                response.status(204).send()
            })
        } else {
            response.status(404).send('Not found')
        }
    })
})



app.listen(8080)
