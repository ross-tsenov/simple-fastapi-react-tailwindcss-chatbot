import { useState, useEffect } from 'react';

function useMessages() {
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        const savedMessages = localStorage.getItem('chatMessages');
        if (savedMessages) {
            setMessages(JSON.parse(savedMessages));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('chatMessages', JSON.stringify(messages));
    }, [messages]);

    return [messages, setMessages];
}

export default useMessages
