import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';
import './Chat.css';

const socket = io('http://localhost:3001');

function Chat() {
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    socket.on('chat message', (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    return () => {
      socket.off('chat message');
    };
  }, []);

  const sendMessage = (e) => {
    e.preventDefault();
    if (message) {
      socket.emit('chat message', { username, message });
      setMessage('');
    }
  };

  const login = (e) => {
    e.preventDefault();
    if (username) {
      setIsLoggedIn(true);
      toast.success(`${username} joined the chat!`, {
        position: toast.POSITION.TOP_CENTER
      });
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="login-form">
        <form onSubmit={login}>
          <input
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <button type="submit">Join Chat</button>
        </form>
      </div>
    );
  }

  return (
    <div className="chat-container">
      <ToastContainer />
      <div className="user-info">
        <FontAwesomeIcon icon={faUserCircle} className="user-icon" />
        <span className="user-name">{username}</span>
      </div>
      <ul className="messages">
        {messages.map((msg, index) => (
          <li key={index} className={`message ${msg.username === username ? 'my-message' : ''}`}>
            <FontAwesomeIcon icon={faUserCircle} className="message-icon" />
            <div className="message-content">
              <strong>{msg.username === username ? 'You' : msg.username}:</strong> {msg.message}
            </div>
          </li>
        ))}
      </ul>
      <form onSubmit={sendMessage}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default Chat;
