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

export default MessageBox
