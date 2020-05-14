import React, { useContext, useEffect, useState} from 'react';
import {Link, useParams} from "react-router-dom";
import {AppContext} from "../components/AppContext";
import useWebSocket, { ReadyState } from 'react-use-websocket';
import {useViewportHeight} from "../hooks/use-viewport-height";
import useFetch from "use-http";
import {useMessageStore} from "../hooks/use-message-store";

const websocketEndpoint = process.env.REACT_APP_WEBSOCKET_ENDPOINT;
const wsUrl = (roomName, accessToken) =>
  `${websocketEndpoint}?` +
  `Room=${roomName}&` +
  `Authorizer=${accessToken}`;


export default function Chat() {

  let { roomName } = useParams();
  const encodedRoom = encodeURIComponent(roomName);
  const { accessToken, username } = useContext(AppContext);
  const [message, setMessage] = useState('');
  const [socketUrl, setSocketUrl] = useState(wsUrl(roomName, accessToken));
  const [noMoreMessages, setNoMoreMessages] = useState(false);
  const { messages, push, append } = useMessageStore();
  const { sendJsonMessage, lastJsonMessage, readyState, getWebSocket } = useWebSocket(socketUrl, {
    reconnectAttempts: 10,
    reconnectInterval: 20000,
    shouldReconnect: (closeEvent) => {
      console.log(closeEvent);
      return true;
    },
   });

  const { get, loading, error } = useFetch(`/rooms/${encodedRoom}/messages`, {
    onNewData: (currentData, newData) => {
      if (newData.count === 0) setNoMoreMessages(true);
      append(newData.items);
    },
    retries: 1,
    cachePolicy: 'no-cache',
  }, [roomName]);

  // Set Socket URL
  useEffect(() => {
    setSocketUrl(wsUrl(roomName, accessToken));
  }, [roomName, accessToken]);

  // Message Received
  useEffect(() => {
    if (lastJsonMessage !== null) {
      console.log(lastJsonMessage);
      push(lastJsonMessage);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getWebSocket, lastJsonMessage]);


  const connectionStatus = {
    [ReadyState.CONNECTING]: 'Connecting...',
    [ReadyState.OPEN]: 'Connected.',
    [ReadyState.CLOSING]: 'Leaving...',
    [ReadyState.CLOSED]: 'Not connected.',
    [ReadyState.UNINSTANTIATED]: 'Not connected.',
  }[readyState];

  function send() {
    sendJsonMessage({
      action: "message",
      message: message,
    });
    console.log(message);
    setMessage('');
  }

  function handleKeyPress(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      if (message !== '') send();
      e.preventDefault();
    }
  }

  //TODO: Refactor this hack-y way of dealing with the iOS on-screen-keyboard
  // See https://blog.opendigerati.com/the-eccentric-ways-of-ios-safari-with-the-keyboard-b5aa3f34228d
  const {viewportHeight} = useViewportHeight();
  const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
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

  function handleScroll(event) {

    //TODO: Remove this if Safari correctly implements scrollTop for flexboxes
    const isSafari = navigator.userAgent.indexOf('Safari') !== -1
      && navigator.userAgent.indexOf('Chrome') === -1;
    const scrollTop = isSafari ?
      event.target.scrollHeight - event.target.offsetHeight + event.target.scrollTop
      : event.target.scrollTop;

    if (scrollTop <= 0 && !loading && !noMoreMessages) {
      const lastMessage = messages[messages.length - 1];
      get(`?before=${lastMessage.timeSent - 1}`);
    }
  }

  return (
    <div className="flex">
      {iOS && st}
      <div className="w-500 legacy-box legacy-no-borders-sm">
        <div className="list">
          <div className="list-header">
            <Link to='/rooms'><button className="bar-button">&lt; Back</button></Link>
            <span>{roomName}</span>
            <span>{connectionStatus}</span>
          </div>

          <div className="chat-container scroll-container scroll-container-messages" onScroll={handleScroll}>
            {messages.map((message, idx) =>
              message.sender !== '$server' ?
                <div key={idx} className="list-message">
                  <div className={'message-sender ' + (message.sender === username && 'current-user')}>
                    {message.sender}
                  </div>
                  <div className="message-content" dangerouslySetInnerHTML={{ __html: message.sanitizedMessage}}/>
                </div>
                :
                <div key={idx} className="list-placeholder">{message.message}</div>
            )}
            {error && <div className="list-placeholder error">Unable to load older messages.</div>}
            {loading && <div className="list-placeholder">Loading older messages...</div>}
            {noMoreMessages && <div className="list-placeholder">No more messages.</div>}
          </div>

          <div className="list-footer">
            <textarea  id="msg-textarea" onChange={e => setMessage(e.target.value)} onKeyPress={handleKeyPress} value={message}  placeholder="Type your message here..."/>
            <button className="bar-button" disabled={message === ''} onClick={() => send()}>Send</button>
          </div>
        </div>
      </div>
    </div>
  );
}
