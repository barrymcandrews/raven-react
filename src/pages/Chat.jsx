import React from 'react';
import {useParams} from "react-router-dom";

export default function Chat() {
  let { roomName } = useParams();

  return (
  <div className="fixed-content">
    <div className="list">
      <div className="list-header">
        <span>{roomName}</span>
      </div>

      <div id="list-item-target" className="scroll-container scroll-container-messages">
        <div className="list-placeholder">This functionality has not yet been implemented. Check back soon.</div>
      </div>

      <div className="list-footer">
        <textarea id="msg-textarea" placeholder="Type your message here..."/>
        <button onClick="sendButtonPressed()">Send</button>
      </div>
    </div>
  </div>
  );
}
