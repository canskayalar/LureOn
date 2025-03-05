import { useState, useEffect, useRef } from "react";
import "./App.css";

function App() {
  const [activeTab, setActiveTab] = useState('chat');
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isApiConnected, setIsApiConnected] = useState(false);
  const chatEndRef = useRef(null);

  // Update API URL to use the current hostname
  const API_URL = `http://${window.location.hostname}:3001/api/ai`;

  // Debug logging for API URL
  console.log('Using API URL:', API_URL);

  // Scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Test API connection on component mount
  useEffect(() => {
    const testApiConnection = async () => {
      try {
        console.log('Testing API connection...');
        const response = await fetch(API_URL, {
          headers: {
            'Accept': 'application/json',
            'Cache-Control': 'no-cache'
          }
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('API Test Response:', data);
        
        if (data.status === 'success') {
          setIsApiConnected(true);
          setError(null);
          setMessages([{
            type: 'ai',
            content: 'API Connected. Ready to chat!',
            timestamp: new Date().toISOString()
          }]);
        } else {
          throw new Error('API returned unsuccessful status');
        }
      } catch (error) {
        console.error('API Connection Error:', error);
        setError('Could not connect to API. Please check if backend is running.');
        setIsApiConnected(false);
        setMessages([]);
      }
    };

    testApiConnection();
    
    // Test connection every 5 seconds if not connected
    const interval = setInterval(() => {
      if (!isApiConnected) {
        testApiConnection();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [isApiConnected, API_URL]);

  const handleSendMessage = async () => {
    if (!inputText.trim()) {
      console.log('Empty message, not sending');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      // Add user message immediately
      const userMessage = {
        type: 'user',
        content: inputText,
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, userMessage]);
      
      console.log('Sending message to API:', inputText);
      
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Cache-Control': 'no-cache'
        },
        body: JSON.stringify({ message: inputText.trim() }),
      });

      console.log('API Response status:', response.status);
      const responseText = await response.text();
      console.log('Raw API response:', responseText);

      let data;
      try {
        data = JSON.parse(responseText);
        console.log('Parsed API response:', data);
      } catch (e) {
        console.error('Failed to parse API response:', e);
        throw new Error('Invalid response format from server');
      }

      if (response.ok) {
        // Add AI response to messages
        const aiMessage = {
          type: 'ai',
          content: data.message,
          timestamp: data.timestamp || new Date().toISOString(),
          isFailover: data.isFailover
        };
        console.log('Adding AI response to chat:', aiMessage);
        setMessages(prev => [...prev, aiMessage]);
        setInputText('');
      } else {
        // Handle error response
        const errorMessage = data.error || 'Unknown error occurred';
        console.error('API error:', errorMessage);
        setError(errorMessage);
        
        if (response.status === 402) {
          setError('OpenAI API quota exceeded. Please check your billing details.');
        }
      }
    } catch (error) {
      console.error('Chat error:', error);
      setError(`Failed to get AI response: ${error.message}`);
      if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
        setIsApiConnected(false);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !isLoading && inputText.trim()) {
      console.log('Enter key pressed, sending message');
      handleSendMessage();
    }
  };

  return (
    <div className="main_wrapper">
      {/* LEFT SIDEBAR (LEVELS) */}
      <aside className="sidebar_section">
        <h3>LEVELS</h3>
        <div className="level_list">
          <div>LEVEL 1</div>
          <div>LEVEL 2</div>
          <div>LEVEL 3</div>
        </div>
      </aside>

      {/* CONTENT AREA */}
      <div className="content_area">
        {/* Chat & Terminal Tabs */}
        <div className="toggle_buttons">
          <button 
            className={activeTab === 'chat' ? 'active' : ''}
            onClick={() => setActiveTab('chat')}
          >
            Chat
          </button>
          <button 
            className={activeTab === 'terminal' ? 'active' : ''}
            onClick={() => setActiveTab('terminal')}
          >
            Terminal
          </button>
        </div>

        <div className="chat_section">
          <div className="chat_prompt">
            {isApiConnected ? 'Connected to AI - Ready to chat!' : 'Connecting to AI...'}
          </div>
          
          <div className="image_container">
            IMAGE HERE
          </div>

          <div className="chat_response">
            {error ? (
              <div className="error-message">{error}</div>
            ) : (
              <div className="messages-container">
                {messages.map((msg, index) => (
                  <div key={index} className={`message ${msg.type}`}>
                    <div className="message-content">{msg.content}</div>
                    <div className="message-timestamp">
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>
            )}
          </div>

          <div className="input_section">
            <input 
              type="text" 
              placeholder={isApiConnected ? "Type your message here..." : "Waiting for AI connection..."}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading || !isApiConnected}
            />
            <button 
              onClick={handleSendMessage}
              disabled={isLoading || !isApiConnected || !inputText.trim()}
              className={isLoading ? 'loading' : ''}
            >
              {isLoading ? 'SENDING...' : 'SEND'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

