import {useState} from "react";
import sanitizeHtml from "sanitize-html"

export interface Message {
  action: 'message'|'$connect'|'$disconnect'|'$default';
  message: string;
  roomName: string;
  timeSent: number;
  sender: string;
}

export interface RenderedMessage extends Message {
  __html: string;
}

export function useMessageStore() {
  const [messages, setMessages] = useState<RenderedMessage[]>(() => []);

  function render(message: Message): RenderedMessage {
    return {
      ...message,
      __html: sanitizeHtml(message.message, {
        allowedTags: [ 'b', 'i', 'em', 'strong', 'u', 'del', 'a' ],
        allowedAttributes: {
          'a': [ 'href', 'rel', 'target'],
        },
        transformTags: {
          'a': sanitizeHtml.simpleTransform('a', {
            target: '_blank',
            rel: 'noopener noreferrer',
          })
        }
      })
    };
  }

  function push(message: Message) {
    setMessages(prev => [render(message), ...prev]);
  }

  function append(messages: Message[]) {
    const renderedMessages = messages.map(render);
    setMessages(prev => [...prev, ...renderedMessages])
  }

  return {messages, push, append};
}
