const express= require("express");
const mysql = require("mysql")
const cors = require("cors");
const app =express();
const bodyParser= require ("body-parser");

const server =app.listen(3001,()=>{
    console.log("Running on server 3001")
}
)

const io =require ("socket.io")(server, 
    {cors:{
origin:"*"
    }
});



app.use(cors());
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }));

// parse application/json
app.use(bodyParser.json());
//app.use(bodyParser.json);



    var mysqlConnection=mysql.createConnection({
        host:'localhost',
        user:'root',
        password:'1234',
        database:'chatapp_db',
        multipleStatements:true
    
    });

    mysqlConnection.connect((err)=>{
        if (!err)
        console.log('DB Connection succeeded');
        else
        console.log('DB Connection Faied \n Error:'+JSON.stringify(err));
        
        });



    app.post('/api/insert',(req,res)=>{
        const UserName=req.body.user_name
        const roomName=req.body.room_name

        console.log(UserName,roomName)
        var insertUserQuery=`CALL chatapp_db.adduser("${UserName}")`
        var insertroomQuery=`CALL chatapp_db.add_room("${roomName}")`

        mysqlConnection.query(insertUserQuery,(err,result)=>{
            if(!err){
            console.log(result);
            }
            else{
                console.log(err)
            }
        })
        mysqlConnection.query(insertroomQuery,(err,result)=>{
            if(!err){
            console.log(result);
            res.send(result)
            }
            else{
                console.log(err)
            }
        });
    })

    app.post('/api/insertMessage/:Room/:User',(req,res)=>{
        const Message=req.body.message_entered;
        const RoomName = req.params.Room;
        const User= req.params.User;


        var addmessageQuery= `CALL chatapp_db.add_message("${Message}","${RoomName}","${User}")`;

        console.log("variables", Message,RoomName,User)

        mysqlConnection.query(addmessageQuery,(err,result)=>{
            if(!err){
            console.log(result);
            res.send(result);
            }
            else{
                console.log(err)
            }
        })
       
    })

    app.get('/api/getMessages/:Room',(req,res)=>{
    

         const RoomName = req.params.Room;

        var getQuery= `CALL chatapp_db.Get_Messages("${RoomName}")`;

        mysqlConnection.query(getQuery,(err,rows,fields)=>{
            if(!err){
            res.send(rows);
            console.log("tese are the rows",rows)
    
            }
            else{
                console.log(err)
            }
        });
    })

    app.get('/api/insert',(req,res)=>{
        const UserName=req.body.user_name
        const roomName=req.body.room_name

        console.log(UserName,roomName)
        var insertUserQuery=`CALL chatapp_db.adduser(${UserName})`
        var insertroomQuery=`CALL chatapp_db.add_room(${roomName})`

        mysqlConnection.query(insertUserQuery,(err,result)=>{
            if(!err){
            console.log(result);
            }
            else{
                console.log(err)
            }
        })
        mysqlConnection.query(insertroomQuery,(err,result)=>{
            if(!err){
            console.log(result);
            }
            else{
                console.log(err)
            }
        });
    })




io.on ('connection', (socket)=>{
console.log(socket.id)

socket.on('error',  (err) => {
    console.log(err);
});
socket.on('join_room',(data)=>{
    console.log("User joined room "+data)
    socket.join(data);
    
})
socket.on('send_message',(data)=>{
     console.log("this is sent message "+data.content)
     socket.to(data.room).emit('receive_message', data.content);


})
socket.on('discnnect',()=>{
    console.log('User Disconnected')
})
})