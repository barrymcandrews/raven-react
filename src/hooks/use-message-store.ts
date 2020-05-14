import {useState} from "react";
import sanitizeHtml from "sanitize-html"

export interface Message {
    action: 'message'|'$connect'|'$disconnect'|'$default';
    message: string;
    roomName: string;
    timeSent: number;
    sender: string;
    sanitizedMessage?: string;
}

export function useMessageStore() {
  const [messages, setMessages] = useState<Message[]>(() => []);

  function render(message: Message): Message {
    const rendered = { ...message }
    rendered.sanitizedMessage = sanitizeHtml(message.message, {
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
    });
    return rendered;
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
