/**
 * Backend API URL.
 * @constant {string}
 */
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || '/api';

/**
 * The default model to use for LLM interactions.
 * @constant {string}
 */
export const LLM_MODEL = process.env.LLM_MODEL || 'fake_llm_model';


/**
 * Sends a message to the backend API and returns the assistant's response.
 *
 * @param {Array} messages - The array of message objects exchanged so far.
 * @param {Object} [metadata={}] - Optional metadata to send with the request.
 * @param {AbortSignal} signal - An AbortSignal to cancel the request if needed.
 * @returns {Promise<Object>} - A promise that resolves to the assistant's message object.
 * @throws {Error} - Throws an error if the network response is not ok.
 */
async function SendMessageToBackend(messages, metadata = {}, signal) {
    const requestBody = {
        model: LLM_MODEL,
        messages,
        metadata,
    };

    const response = await fetch(`${BACKEND_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
        signal,
    });

    if (!response.ok) throw new Error('Network response was not ok');

    const data = await response.json();
    return data.message;
}

export default SendMessageToBackend
