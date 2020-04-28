import React, {useContext, useEffect, useMemo, useRef, useState} from 'react';
import {useParams} from "react-router-dom";
import {AppContext} from "../components/AppContext";
import useWebSocket, { ReadyState } from 'react-use-websocket';
import {useViewportHeight} from "../hooks";

const websocketEndpoint = process.env.REACT_APP_WEBSOCKET_ENDPOINT;
const wsUrl = (roomName, accessToken) =>
  `${websocketEndpoint}?` +
  `Room=${roomName}&` +
  `Authorizer=${accessToken}`;


export default function Chat() {
  let { roomName } = useParams();
  const { accessToken, username } = useContext(AppContext);
  const STATIC_OPTIONS = useMemo(() => ({
    onOpen: () => console.log('Websocket connected.'),
    shouldReconnect: (closeEvent) => {
      console.log(closeEvent);
      return true;
    },
    reconnectAttempts: 10,
    reconnectInterval: 40000,
  }), []);

  useEffect(() => {
    setSocketUrl(wsUrl(roomName, accessToken));
  }, [roomName, accessToken]);

  const [socketUrl, setSocketUrl] = useState(wsUrl(roomName, accessToken));
  const [sendMessage, lastMessage, readyState, getWebSocket] = useWebSocket(socketUrl, STATIC_OPTIONS);
  const [messageHistory, setMessageHistory] = useState([]);
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (lastMessage !== null) {

      const currentWebsocketUrl = getWebSocket().url;
      console.log('received a message from ', currentWebsocketUrl);
      const body = JSON.parse(lastMessage.data);
      console.log(body);
      setMessageHistory(prev => prev.concat(body));
    }
  }, [getWebSocket, lastMessage]);

  useEffect(() => {
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
  }, [messageHistory]);

  const connectionStatus = {
    [ReadyState.CONNECTING]: 'Connecting...',
    [ReadyState.OPEN]: 'Connected.',
    [ReadyState.CLOSING]: 'Leaving...',
    [ReadyState.CLOSED]: 'Not connected.',
  }[readyState];

  function send() {
    sendMessage(JSON.stringify({
      action: "message",
      message: message,
    }));
    console.log(message);
    setMessage('');
  }

  function handleKeyPress(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      send();
      e.preventDefault();
    }
  }

  //TODO: Refactor this hack-y way of dealing with the iOS on-screen-keyboard
  // See https://blog.opendigerati.com/the-eccentric-ways-of-ios-safari-with-the-keyboard-b5aa3f34228d
  const {viewportHeight} = useViewportHeight();
  let iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  let height = (!iOS) ? '100%' : `${viewportHeight}px`;
  let st = (
    <style type="text/css">
      {`body > div {
        height: ${height};
        transition: height 0.4s ease;
        width: auto;
        position: fixed;
        left: 0;
        right: 0;
        bottom: 0;
      }`}
    </style>
  );

  return (
  <div className="flex">
    {iOS && st}
    <div className="w-500 legacy-box">
      <div className="list">
        <div className="list-header">
          <span>{roomName}</span>
          <span>{connectionStatus}</span>
        </div>

        <div className="scroll-container scroll-container-messages">
          <div className="list-placeholder">Welcome to the room. New messages will appear here. </div>
          {messageHistory.map((message, idx) =>
            message.sender !== '$server' ?
            <div key={idx} className="list-item">
              <div className={'message-sender ' + (message.sender === username && 'current-user')}>
                {message.sender}
              </div>
              <code className="message-content">{message.message}</code>
            </div>
              :
              <div className="list-placeholder">{message.message}</div>
          )}
          <div ref={messagesEndRef}/>
        </div>

        <div className="list-footer">
          <textarea id="msg-textarea" onChange={e => setMessage(e.target.value)} onKeyPress={handleKeyPress} value={message}  placeholder="Type your message here..."/>
          <button className="bar-button" disabled={message === ''} onClick={() => send()}>Send</button>
        </div>
      </div>
    </div>
  </div>
  );
}
