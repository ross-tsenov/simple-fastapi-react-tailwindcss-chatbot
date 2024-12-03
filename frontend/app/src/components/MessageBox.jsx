/**
 * Renders a single chat message.
 * @param {Object} props - The component props.
 * @param {Object} props.message - The message object.
 * @returns {JSX.Element}
 */
function MessageBox({ message }) {
    const isUser = message.role === 'user';

    return (
        <div
            className={`message-container ${isUser ? 'justify-end' : 'justify-start'}`}
        >
            <div
                className={`message-bubble ${isUser ? 'user-message' : 'assistant-message'}`}
            >
                {message.content}
            </div>
        </div>
    );
}

export default MessageBox
