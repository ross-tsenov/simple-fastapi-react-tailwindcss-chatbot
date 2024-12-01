// App.js

import React, { useState, useEffect, useRef, useCallback } from 'react';
import MessageInput from './components/MessageInput';
import MessageList from './components/MessageList';
import SendMessageToBackend from './services/apiService';
import useMessages from './hooks/useMessages';

/**
 * Main application component.
 * @returns {JSX.Element}
 */
function App() {
  const [messages, setMessages] = useMessages();
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [controller, setController] = useState(null);
  const [pendingUserMessage, setPendingUserMessage] = useState(null);

  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  /**
   * Sends a message to the backend API.
   */
  const handleSendMessage = useCallback(async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input.trim() };
    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setPendingUserMessage(userMessage);
    setInput('');

    const abortController = new AbortController();
    setController(abortController);
    setLoading(true);

    try {
      const assistantMessage = await SendMessageToBackend(
        updatedMessages,
        {},
        abortController.signal
      );

      setMessages((prev) => [...prev, assistantMessage]);
      setPendingUserMessage(null);
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Error:', error);
      }
    } finally {
      setController(null);
      setLoading(false);
      inputRef.current?.focus();
    }
  }, [input, messages, setMessages]);

  /**
   * Cancels the ongoing message request.
   */
  const handleCancel = useCallback(() => {
    if (controller) {
      controller.abort();
      setController(null);
      setLoading(false);
      setMessages((prev) =>
        prev.filter((msg) => msg !== pendingUserMessage)
      );
      setInput(pendingUserMessage?.content || '');
      setPendingUserMessage(null);
      inputRef.current?.focus();
    }
  }, [controller, pendingUserMessage, setMessages]);

  /**
   * Handles form submission or cancels the message if loading.
   * @param {React.FormEvent} e - The form event.
   */
  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      loading ? handleCancel() : handleSendMessage();
    },
    [loading, handleCancel, handleSendMessage]
  );

  return (
    <div className="flex flex-col h-screen bg-gray-900">
      <div className="flex-grow p-4 overflow-auto">
        <MessageList messages={messages} />
      </div>
      <MessageInput
        input={input}
        setInput={setInput}
        loading={loading}
        handleSubmit={handleSubmit}
        inputRef={inputRef}
      />
    </div>
  );
}

export default App;
