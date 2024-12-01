import TextInput from "./TextInput";
import SubmitButton from "./SubmitButton";

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

export default MessageInput
