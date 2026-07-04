import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { BotMessageSquare, LoaderCircle, Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  ChatBubble,
  type ChatMessage,
} from "@/apps/factory/components/chat-bubble";
import mockMessages from "../mock.json";

type AiChatProps = {
  isOpen: boolean;
};

const initialMessages = new Map<string, ChatMessage>(
  (mockMessages as ChatMessage[]).map((message) => [message.id, message]),
);

export function AiChat({ isOpen }: AiChatProps) {
  const { t } = useTranslation();
  const [messages, setMessages] = useState(initialMessages);
  const [draft, setDraft] = useState("");
  const [isLoading, setIsLoading] = useState(isOpen);
  const inputRef = useRef<HTMLInputElement>(null);

  const messageList = useMemo(() => Array.from(messages.values()), [messages]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setIsLoading(true);
    const loadingTimer = window.setTimeout(() => {
      setIsLoading(false);
      inputRef.current?.focus();
    }, 700);

    return () => window.clearTimeout(loadingTimer);
  }, [isOpen]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const text = draft.trim();
    if (!text) {
      return;
    }

    const id = `user-${Date.now()}`;
    setMessages((currentMessages) => {
      const nextMessages = new Map(currentMessages);
      nextMessages.set(id, {
        id,
        role: "user",
        text,
      });
      return nextMessages;
    });
    setDraft("");
  }

  if (isLoading) {
    return (
      <div className="factory-ai-chat-loading" role="status" aria-live="polite">
        <LoaderCircle aria-hidden="true" />
        <BotMessageSquare aria-hidden="true" />
        <span>{t("factory.chat.loading")}</span>
      </div>
    );
  }

  return (
    <div className="factory-ai-chat">
      <div className="factory-chat-messages">
        {messageList.map((message) => (
          <ChatBubble message={message} key={message.id} />
        ))}
      </div>

      <form className="factory-chat-input" onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder={t("factory.chat.inputPlaceholder")}
          aria-label={t("factory.chat.inputLabel")}
        />
        <Button
          type="submit"
          variant="default"
          size="icon"
          aria-label={t("factory.chat.send")}
          disabled={!draft.trim()}
        >
          <Send />
        </Button>
      </form>
    </div>
  );
}
