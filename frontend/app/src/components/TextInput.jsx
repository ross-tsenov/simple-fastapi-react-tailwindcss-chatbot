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

export default TextInput
