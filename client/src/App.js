
import './App.css';
import io from 'socket.io-client';
import React,{useState, useEffect} from "react";
import MessageInput from "./components/chatInput"
import MessagesList from "./components/chatList"
import axios from "axios";


let socket;
const connection_port='http://localhost:3001/'

function App() {
  const [loggedIn,setloggedIn]=useState(false);
  const [room, setRoom]=useState('');
  const [userName, setuserName]=useState('');

  const [message, setmessage]=useState("");
  const [messageList, setmessageList]=useState([]);

  useEffect (()=>{
    //console.log(connection_port)
    socket= io(connection_port)
  },[connection_port])
   
  useEffect (()=>{
    console.log(connection_port)
    
    socket.on('receive_message',(data)=>{
      setmessageList([...messageList,data])
      console.log("this is the list",messageList);
    console.log("this is the received message"+data.message);
    }
    )
  })

  const connectToRoom =()=>{
    if (userName !=="" && room !==""){
    axios.post("http://localhost:3001/api/insert", {
            user_name: userName,
            room_name: room,
          })
          .then(() => {
            
          axios.get(`http://localhost:3001/api/getMessages/${room}`)
          .then((response)=>{
            //console.log("this is the response",response.data[0])
            //setmessageList([...response.data[0]])
          
          response.data[0].forEach((message) => {
          messageList.push({
          Auther:message.user_name,
          message:message.message_content
        });
      });
          setloggedIn(true);
          socket.emit('join_room',room);
      //console.log("this is the messageList", messageList)
          })
          
        })
        
    }
        else {
          window.alert("Please enter username and room");
        }
  }

  const sendMessage =() =>{
    
    const messageContent={
      room:room,
      content:{
      Auther:userName,
      message:message
      }
    }

    axios.post(`http://localhost:3001/api/insertMessage/${room}/${userName}`, {
            message_entered:message
          })
          .then((response) => {
            console.log("Inside then" ,response)
            
          
          axios.get(`http://localhost:3001/api/getMessages/${room}`)
          .then((response)=>{
            console.log("this is the response",response.data[0])
            //setmessageList([...response.data[0]])
          
          response.data[0].forEach((message) => {
          messageList.push({
          Auther:message.user_name,
          message:message.message_content
        });
      });
          setloggedIn(true);
          socket.emit('join_room',room);
      console.log("this is the messageList", messageList)
          })
          
        })
        



    console.log(messageContent)
    socket.emit('send_message',messageContent)
    setmessageList([...messageList,messageContent.content])
    console.log("this is the messageList",messageList)
    setmessage('');

  }

  const messageChange =(e)=>{
    setmessage(e.target.value)

  }

  return (
    <div className="App">
      {!loggedIn?
      (<div className="LogIn">
         <div className="input">
          
          <label>Name</label>
          <input type="text" value={userName} onChange={(e)=>setuserName(e.target.value)}/> 
          
          <label>Room</label>
          
          <input type="text" value={room} onChange={(e)=>setRoom(e.target.value)}/> 
         
          </div>
          
          <div className="submitbtn">
            <button onClick={connectToRoom}>Enter Chat</button>
          </div>

      </div>)
      :
      ( <div className="chatContainer" > 
      <MessagesList msgList={messageList} user={userName}/>
      <MessageInput onSend={sendMessage} message={message} onmsgChange={messageChange} />
    
      
      </div>)
      
    }


    </div>
  );
}

export default App;
