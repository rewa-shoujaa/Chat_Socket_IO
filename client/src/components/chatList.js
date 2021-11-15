import React from 'react'
import MessageChat from './chatMessage'
import "./chatList.css";

function chatList(props) {
    return (
        <div className="chatList">
            {props.msgList.map((valuemessage,key)=>{
                console.log(valuemessage.message)
                return(
                    <ul>
                    <MessageChat message={valuemessage} user={(props.user)===(valuemessage.Auther)?"user":""} />
                    </ul>

                )
            })}
            
        </div>
    )
}

export default chatList
