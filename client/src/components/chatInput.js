import React from 'react'
import "./chatInput.css";

function chatInput(props) {
    return (
        <div className="chatInput">
            <textarea value={props.message} onChange={props.onmsgChange}/>
            <button onClick={props.onSend}>Send</button>
        </div>
    )
}

export default chatInput
