import React, { useEffect, useState } from 'react';
import axios from "axios";
import { v4 as uuidv4 } from 'uuid'; // Import uuid

const EventSourcing = () => {
    const [messages, setMessages] = useState([]);
    const [value, setValue] = useState('');


    useEffect(() => {
        subscribe()
    }, [])

    const subscribe = async () => {
        const eventSource = new EventSource(`http://localhost:5000/connect`)
        eventSource.onmessage = function (event) {
            const message = JSON.parse(event.data);
            setMessages(prev => [message, ...prev]);
        }
    }

    const sendMessage = async () => {
        const id = uuidv4(); // Generate a unique ID

        await axios.post('http://localhost:5000/new-messages', {
            message: value,
            id: id, // Use the generated ID
        })
    }

    return (
        <div className="center">
            <div>
                <div className="form">
                    <input value={value} onChange={e => setValue(e.target.value)} type="text" />
                    <button onClick={sendMessage}>Send</button>
                </div>
                <div className="message">

                    {messages.map((mess, index) => (
                        <div className="message" key={`${mess.id}-${index}`}>
                            {mess.message}
                        </div>
                    ))}

                </div>
            </div>
        </div>
    );
};

export default EventSourcing;