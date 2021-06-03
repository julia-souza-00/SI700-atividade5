const express = require('express');
const cors = require("cors")
const app = express();

app.use(express.json());
app.use(cors());
// app.listen(3000);


app.get('/', function(req, res){res.send('Hello world')});

/*
  Servidor propriamente dito
*/

const users = [
    {id: 0, name: "Julia de Souza dos Santos", birthdate : "05/05/2000", email: "julia@gmail.com", password: "senha1234567", gender: 1}
]

const endpoint = "/users";

app.get(endpoint, function(req, res){
    res.send(users.filter(Boolean));
});

app.get(`${endpoint}/:email&:password`, function(req, res){
    const email = req.params.email;
    const password = req.params.password;
    var user = users[-1];

    users.forEach(function(value){
        if(value.email == email && value.password == password){
            user = value;
        }
    });
        
   if (!user){
        res.send("0");
    } else {
        res.send(user);
    }   
});

app.post(endpoint, (req, res) => {
    const user = {
        id : users.length,
        name : req.body["name"],
        birthdate : req.body["birthdate"],
        email : req.body["email"],
        password : req.body["password"],
        gender : req.body["gender"],
    };

    users.push(user);
    res.send("1");

    notify();
});

/*
app.put(`${endpoint}/:id`, (req, res) =>{
    const id = parseInt(req.params.id);
    const note = {
        id : id,
        title : req.body["title"],
        description : req.body["description"]
    };

    users[id] = note;
    res.send("1");

    notify();
});

app.delete(`${endpoint}/:id`, (req, res) => {
    const id = req.params.id;
    delete users[id];
    res.send("1");

    // Notificar todos
    notify();
});

*/
/*
  Criar um socket para notificar usuários das mudanças.
*/

const server = require('http').createServer(app);
const io = require('socket.io')(server);

// Comunicação
const INVALIDATE = 'invalidate';

function notify(){
    io.sockets.emit(INVALIDATE, 1);
}

server.listen(process.env.PORT || 3000);