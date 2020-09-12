import {useEffect, useState} from "react";
import DOMPurify from "dompurify";

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

  useEffect(function addLinkHook() {
    DOMPurify.addHook('afterSanitizeAttributes', (element: Element) => {
      if (element.tagName === 'A') {
        element.setAttribute('target', '_blank');
        element.setAttribute('rel', 'noopener noreferrer');
      }
    });
  }, []);

  function render(message: Message): RenderedMessage {
    return {
      ...message,
      __html: DOMPurify.sanitize(message.message, {
        ALLOWED_TAGS: [ '#text', 'b', 'i', 'em', 'strong', 'u', 'del', 'a', 'ul', 'ol', 'li', 'br' ],
        ALLOWED_ATTR: ['href'],
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
