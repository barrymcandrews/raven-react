import React, {useContext, useEffect, useState, UIEvent, KeyboardEvent} from 'react';
import {Link, useParams} from "react-router-dom";
import {AppContext} from "../components/AppContext";
import useWebSocket, { ReadyState } from 'react-use-websocket';
import {useViewportHeight} from "../hooks/use-viewport-height";
import useFetch from "use-http";
import {Message, useMessageStore} from "../hooks/use-message-store";
import {CachePolicies} from 'use-http/dist';

const websocketEndpoint = process.env.REACT_APP_WEBSOCKET_ENDPOINT;
const wsUrl = (roomName: string, accessToken: string) =>
  `${websocketEndpoint}?` +
  `Room=${encodeURIComponent(roomName)}&` +
  `Authorizer=${accessToken}`;


export default function Chat() {

  let { roomName } = useParams();
  const encodedRoom = encodeURIComponent(roomName);
  const { accessToken, username } = useContext(AppContext);
  const [message, setMessage] = useState('');
  const [sentMessageTimes, setSentMessageTimes] = useState<number[]>(() => []);
  const [socketUrl, setSocketUrl] = useState(wsUrl(roomName, accessToken));
  const [noMoreMessages, setNoMoreMessages] = useState(false);
  const { messages, push, append } = useMessageStore();
  const {get: getRange} = useFetch<Message[]>(`/rooms/${encodedRoom}/messages`);
  const { sendJsonMessage, lastJsonMessage, readyState, getWebSocket } = useWebSocket(socketUrl, {
    reconnectAttempts: 10,
    reconnectInterval: 20000,
    shouldReconnect: (closeEvent) => {
      console.log(closeEvent);
      return true;
    },
    onOpen: event => {
      let lastMessage = messages[0] || {timeSent: 0};
      getRange(`?before=${Date.now()}&after=${lastMessage.timeSent + 1}`)
        .then(value => value.items.slice(0).reverse().forEach((item: Message) => push(item)));
    }
   });

  const { error: roomNotFound } = useFetch(`/rooms/${encodedRoom}`, {
    cachePolicy: CachePolicies.NO_CACHE,
  }, [roomName]);

  const { get, loading, error } = useFetch<Message[]>(`/rooms/${encodedRoom}/messages`, {
    onNewData: (currentData, newData) => {
      if (newData.count === 0) setNoMoreMessages(true);
      append(newData.items);
    },
    retries: 1,
    cachePolicy: CachePolicies.NO_CACHE,
  }, [roomName]);

  useEffect(function updateSocketUrl() {
    setSocketUrl(wsUrl(roomName, accessToken));
  }, [roomName, accessToken]);

  useEffect(function receiveMessage() {
    if (lastJsonMessage !== null) {
      console.log(lastJsonMessage);

      // Don't display the message if it was sent by this window
      if (lastJsonMessage.sender !== username || !sentMessageTimes.includes(lastJsonMessage.timeSent)) {
        push(lastJsonMessage);
      }
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
    const msg: Message = {
      action: "message",
      message: message,
      sender: username,
      roomName: roomName,
      timeSent: Date.now(),
    }

    sendJsonMessage(msg);
    setSentMessageTimes(prev => [...prev, msg.timeSent]);
    push(msg);
    console.log(message);
    setMessage('');
  }

  function handleKeyPress(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === 'Enter' && !event.shiftKey) {
      if (message !== '') send();
      event.preventDefault();
    }
  }

  //TODO: Refactor this hack-y way of dealing with the iOS on-screen-keyboard
  // See https://blog.opendigerati.com/the-eccentric-ways-of-ios-safari-with-the-keyboard-b5aa3f34228d
  const {viewportHeight} = useViewportHeight();
  const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  let iosStyle = (
    <style type="text/css">
      {`body > div {
        height: ${viewportHeight}px;
        transition: height 0.4s ease;
        width: auto;
        position: fixed;
        left: 0;
        right: 0;
        bottom: 0;
      }`}
    </style>
  );

  function handleScroll(event: UIEvent<HTMLDivElement, globalThis.UIEvent>) {
    const target = event.target as any;
    const scrollTop = target.scrollHeight - target.offsetHeight + target.scrollTop;

    if (scrollTop <= 0 && !loading && !noMoreMessages) {
      const lastMessage = messages[messages.length - 1];
      get(`?before=${lastMessage.timeSent - 1}`);
    }
  }

  return (
    <div className="flex">
      {iOS && iosStyle}
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
                  <div className="message-content" dangerouslySetInnerHTML={message}/>
                </div>
                :
                <div key={idx} className="list-placeholder">{message.message}</div>
            )}

            {roomNotFound && <div className="list-placeholder error">This room does not exist.</div>}
            {!roomNotFound && <>
              {error && <div className="list-placeholder error">Unable to load older messages.</div>}
              {loading && <div className="list-placeholder">Loading older messages...</div>}
              {noMoreMessages && <div className="list-placeholder">No more messages.</div>}
            </>}

          </div>

          <div className="list-footer">
            <textarea  id="msg-textarea" onChange={e => setMessage(e.target.value)} onKeyPress={handleKeyPress} value={message}  placeholder="Type your message here..."/>
            <button className="bar-button" disabled={message === '' || typeof roomNotFound !== 'undefined'} onClick={() => send()}>Send</button>
          </div>
        </div>
      </div>
    </div>
  );
}
