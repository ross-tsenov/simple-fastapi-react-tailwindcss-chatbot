import React from 'react';
import ChatWindow from './components/ChatWindow';

/**
 * Main application component.
 * @returns {JSX.Element}
 */
function App() {
  return (
    <div className="flex flex-col h-screen bg-gray-900">
      <ChatWindow />
    </div>
  );
}

export default App;
