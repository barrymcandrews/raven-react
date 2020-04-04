import React from 'react';

export default function Chat() {
  return (
  <div className="fixed-content">
    <div className="list">
      <div className="list-header">
        {/*<span>{{room_name}}</span>*/}
      </div>

      <div id="list-item-target" className="scroll-container scroll-container-messages">
        <div className="list-placeholder">Loading messages...</div>
      </div>

      <div className="list-footer">
        <textarea id="msg-textarea" placeholder="Type your message here..."/>
        <button onClick="sendButtonPressed()">Send</button>
      </div>
    </div>
  </div>
  );
}
