import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [activeTab, setActiveTab] = useState('chat');
  const [inputText, setInputText] = useState('');
  const [chatResponse, setChatResponse] = useState('Waiting for response...');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isApiConnected, setIsApiConnected] = useState(false);

  // Test API connection on component mount
  useEffect(() => {
    const testApiConnection = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/ai');
        const data = await response.json();
        console.log('API Test Response:', data);
        setIsApiConnected(true);
        setChatResponse('API Connected. Ready to chat!');
      } catch (error) {
        console.error('API Connection Error:', error);
        setError('Could not connect to API. Please check if backend is running.');
        setIsApiConnected(false);
      }
    };

    testApiConnection();
  }, []);

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    try {
      setIsLoading(true);
      setError(null);
      
      console.log('Sending message:', inputText); // Debug log
      
      const response = await fetch('http://localhost:3001/api/ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ message: inputText }),
      });

      console.log('Response status:', response.status); // Debug log

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Response data:', data); // Debug log
      
      if (data.message) {
        setChatResponse(data.message);
      } else {
        console.warn('Unexpected response format:', data);
        setChatResponse('Received response but no message found');
      }
      
      setInputText('');
    } catch (error) {
      console.error('Error details:', error);
      setError(`Failed to send message: ${error.message}`);
      setChatResponse('Error: Could not connect to server');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !isLoading) {
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
            {isApiConnected ? 'Connected to API' : 'Connecting to API...'}
          </div>
          
          <div className="image_container">
            IMAGE HERE
          </div>

          <div className="input_section">
            <input 
              type="text" 
              placeholder={isApiConnected ? "Type your message here..." : "Waiting for API connection..."}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading || !isApiConnected}
            />
            <button 
              onClick={handleSendMessage}
              disabled={isLoading || !isApiConnected}
              className={isLoading ? 'loading' : ''}
            >
              {isLoading ? 'SENDING...' : 'SEND'}
            </button>
          </div>

          <div className="chat_response">
            {error ? (
              <div className="error-message">{error}</div>
            ) : (
              <div className="response-content">
                {chatResponse}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

