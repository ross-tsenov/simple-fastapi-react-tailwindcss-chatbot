import MessageBox from "./MessageBox";

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

export default MessageList