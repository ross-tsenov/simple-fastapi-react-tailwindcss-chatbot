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
      className="input-field"
      placeholder="Type your message..."
      value={value}
      onChange={onChange}
    />
  );
}

export default TextInput
