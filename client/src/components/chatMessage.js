import React from 'react'
import './chatMessage.css'

function chatMessage(props) {
    console.log( props.message)
    return (
        <li className={(props.user==="user")?"Message":"othersMessage"}>
            
           { props.message.message}

            
        </li>
    )
}

export default chatMessage
