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
            className={`${loading
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

export default SubmitButton
