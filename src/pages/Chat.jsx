import React, {useContext, useEffect, useMemo, useRef, useState} from 'react';
import {useParams} from "react-router-dom";
import {AppContext} from "../components/AppContext";
import useWebSocket, { ReadyState } from 'react-use-websocket';

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
    reconnectInterval: 10000,
  }), []);

  useEffect(() => {
    setSocketUrl(wsUrl(roomName, accessToken));
  }, [roomName, accessToken]);

  const [socketUrl, setSocketUrl] = useState(wsUrl(roomName, accessToken));
  const [sendMessage, lastMessage, readyState, getWebSocket] = useWebSocket(socketUrl, STATIC_OPTIONS);
  const [messageHistory, setMessageHistory] = useState([]);
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef(null)

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
    setMessage('');
    sendMessage(JSON.stringify({
      action: "message",
      message: message,
    }));
  }

  return (
  <div className="flex">
    <div className="legacy-box">
      <div className="list">
        <div className="list-header">
          <span>{roomName}</span>
          <span>{connectionStatus}</span>
        </div>

        <div className="scroll-container scroll-container-messages">
          {/*{isLoading & <div className="list-placeholder">Loading messages...</div>}*/}
          {messageHistory.map((message, idx) =>
            message.sender !== '$server' ?
            <div key={idx} className="list-item">
              <div className={'message-sender ' + (message.sender === username && 'current-user')}>
                {message.sender}
              </div>
              <div className="message-content">{message.message}</div>
            </div>
              :
              <div className="list-placeholder">{message.message}</div>
          )}
          <div ref={messagesEndRef}/>
        </div>

        <div className="list-footer">
          <textarea id="msg-textarea" value={message} onChange={e => setMessage(e.target.value)} placeholder="Type your message here..."/>
          <button disabled={message === ''} onClick={() => send()}>Send</button>
        </div>
      </div>
    </div>
  </div>
  );
}
