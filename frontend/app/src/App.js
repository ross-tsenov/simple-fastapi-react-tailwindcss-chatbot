// App.js

import React, { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Backend API URL.
 */
const BACKEND_URL = 'http://localhost:5000/api';

/**
 * Renders a single chat message.
 * @param {Object} props - The component props.
 * @param {Object} props.message - The message object.
 * @returns {JSX.Element}
 */
function MessageBox({ message }) {
  const isUser = message.role === 'user';
  const messageBgColor = isUser ? 'bg-cyan-500' : 'bg-teal-500';

  return (
    <div
      className={`my-2 flex ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={`rounded-lg p-2 max-w-xs break-words ${messageBgColor} text-white`}
      >
        {message.content}
      </div>
    </div>
  );
}

/**
 * Renders a list of chat messages.
 * @param {Object} props - The component props.
 * @param {Array} props.messages - An array of message objects.
 * @returns {JSX.Element}
 */
function MessageList({ messages }) {
  return (
    <div className="max-w-full sm:max-w-xl mx-auto">
      {messages.map((msg, index) => (
        <MessageBox key={index} message={msg} />
      ))}
    </div>
  );
}

/**
 * Renders a text input field.
 * @param {Object} props - The component props.
 * @param {string} props.value - The current input value.
 * @param {Function} props.onChange - Function to handle input change.
 * @param {React.RefObject} props.inputRef - Reference to the input element.
 * @returns {JSX.Element}
 */
function TextInput({ value, onChange, inputRef }) {
  return (
    <input
      type="text"
      ref={inputRef}
      className="flex-grow border border-gray-600 bg-gray-700 text-white placeholder-gray-400 rounded-l-lg p-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
      placeholder="Type your message..."
      value={value}
      onChange={onChange}
    />
  );
}

/**
 * Renders the submit button.
 * @param {Object} props - The component props.
 * @param {boolean} props.loading - Indicates if a message is being sent.
 * @returns {JSX.Element}
 */
function SubmitButton({ loading }) {
  return (
    <button
      type="submit"
      className={`${
        loading
          ? 'bg-red-500 hover:bg-red-600 focus:ring-red-500'
          : 'bg-cyan-600 hover:bg-cyan-700 focus:ring-cyan-500'
      } text-white font-semibold px-4 py-2 rounded-r-lg focus:outline-none focus:ring-2 flex items-center`}
    >
      {loading ? (
        <>
          {/* Simple Spinner */}
          <svg
            className="animate-spin h-5 w-5 mr-2 text-white"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M12 2a10 10 0 100 20 10 10 0 000-20z"
            />
          </svg>
          Cancel
        </>
      ) : (
        'Send'
      )}
    </button>
  );
}

/**
 * Renders the input field and submit button for sending messages.
 * @param {Object} props - The component props.
 * @param {string} props.input - The current input value.
 * @param {Function} props.setInput - Function to update the input value.
 * @param {boolean} props.loading - Indicates if a message is being sent.
 * @param {Function} props.handleSubmit - Function to handle form submission.
 * @param {React.RefObject} props.inputRef - Reference to the input element.
 * @returns {JSX.Element}
 */
function MessageInput({ input, setInput, loading, handleSubmit, inputRef }) {
  return (
    <form className="p-4 bg-gray-800" onSubmit={handleSubmit}>
      <div className="flex max-w-full sm:max-w-xl mx-auto">
        <TextInput
          value={input}
          onChange={(e) => setInput(e.target.value)}
          inputRef={inputRef}
        />
        <SubmitButton loading={loading} />
      </div>
    </form>
  );
}

/**
 * Main application component.
 * @returns {JSX.Element}
 */
function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [controller, setController] = useState(null);
  const [pendingUserMessage, setPendingUserMessage] = useState(null);

  const inputRef = useRef(null);

  // Load messages from localStorage on mount
  useEffect(() => {
    const savedMessages = localStorage.getItem('chatMessages');
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    }
    inputRef.current?.focus();
  }, []);

  // Save messages to localStorage when messages change
  useEffect(() => {
    localStorage.setItem('chatMessages', JSON.stringify(messages));
  }, [messages]);

  /**
   * Sends a message to the backend API.
   */
  const handleSendMessage = useCallback(async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setPendingUserMessage(userMessage);
    setInput('');

    const requestBody = {
      model: 'fake_llm_model',
      messages: [...messages, userMessage],
      metadata: {},
    };

    const abortController = new AbortController();
    setController(abortController);
    setLoading(true);

    try {
      const response = await fetch(`${BACKEND_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
        signal: abortController.signal,
      });

      if (!response.ok) throw new Error('Network response was not ok');

      const data = await response.json();
      const assistantMessage = data.message;

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
  }, [input, messages]);

  /**
   * Cancels the ongoing message request.
   */
  const handleCancel = useCallback(() => {
    controller?.abort();
    setController(null);
    setLoading(false);
    setMessages((prev) =>
      prev.filter((msg) => msg !== pendingUserMessage)
    );
    setInput(pendingUserMessage?.content || '');
    setPendingUserMessage(null);
    inputRef.current?.focus();
  }, [controller, pendingUserMessage]);

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
