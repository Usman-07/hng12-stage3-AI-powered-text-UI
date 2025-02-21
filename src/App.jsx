import React, { useState, useEffect, useRef } from 'react';
import { Search, Send, Languages, Menu, X, Plus, Loader2 } from 'lucide-react';
    
    const STORAGE_KEY = 'translation_history';
    const SUMMARY_THRESHOLD = 150; // Define threshold for summarization
    
    // Standalone TypewriterText component
    const TypewriterText = () => {
      const [text, setText] = useState('');
      const [phraseIndex, setPhraseIndex] = useState(0);
      const [isDeleting, setIsDeleting] = useState(false);
      
      const phrases = [
        'Start a new translation',
        'Summarize text over 150 characters',
        'Detect language automatically'
      ];
    
      useEffect(() => {
        const typingSpeed = 100;
        const deletingSpeed = 50;
        const pauseTime = 2000;
    
        const timer = setTimeout(() => {
          const currentPhrase = phrases[phraseIndex];
          
          if (isDeleting) {
            setText(prev => prev.slice(0, -1));
            if (text === '') {
              setIsDeleting(false);
              setPhraseIndex((prev) => (prev + 1) % phrases.length);
            }
          } else {
            setText(currentPhrase.slice(0, text.length + 1));
            if (text === currentPhrase) {
              setTimeout(() => setIsDeleting(true), pauseTime);
            }
          }
        }, isDeleting ? deletingSpeed : typingSpeed);
    
        return () => clearTimeout(timer);
      }, [text, isDeleting, phraseIndex, phrases]);
    
      return (
        <div className="flex flex-col items-center justify-center h-full">
          <h2 className="text-3xl font-bold text-gray-400 mb-4">AI Powered Text Translation</h2>
          <p className="text-3xl font-bold text-[#373F68]/70">
            {text}<span className="animate-pulse">|</span>
          </p>
        </div>
      );
    };
    
    // Main App component
    const App = () => {
      // State
      const [inputText, setInputText] = useState('');
      const [isProcessing, setIsProcessing] = useState(false);
      const [searchQuery, setSearchQuery] = useState('');
      const [isSidebarOpen, setIsSidebarOpen] = useState(false);
      const [targetLanguage, setTargetLanguage] = useState('es');
      const [detector, setDetector] = useState(null);
      const [conversations, setConversations] = useState([]);
      const [activeConversationId, setActiveConversationId] = useState(null);
      const [progress, setProgress] = useState(0);
      const [isFallbackMode, setIsFallbackMode] = useState(false);
      const [showTypewriter, setShowTypewriter] = useState(true);
    
      // Refs
      const messagesEndRef = useRef(null);
      const sidebarRef = useRef(null);
      const textareaRef = useRef(null);
    
      // Available languages
      const availableLanguages = [
        { code: 'es', name: 'Spanish' },
        { code: 'fr', name: 'French' },
        { code: 'de', name: 'German' },
        { code: 'it', name: 'Italian' },
        { code: 'pt', name: 'Portuguese' },
        { code: 'zh', name: 'Chinese' },
        { code: 'ja', name: 'Japanese' },
        { code: 'ko', name: 'Korean' },
        { code: 'ru', name: 'Russian' }
      ];
    
      // Helper function to get language name from code
      const getLanguageName = (code) => {
        return availableLanguages.find(lang => lang.code === code)?.name || code;
      };
    
      // Auto-create conversation when user types
      const handleTextareaFocus = () => {
        // If no active conversation exists and typewriter is showing, create a new conversation
        if (showTypewriter && !activeConversationId && inputText.trim() === '') {
          createNewChat();
          setShowTypewriter(false);
        }
      };
    
      // Initialize AI
      useEffect(() => {
        const initializeAI = async () => {
          try {
            if (!('ai' in window)) {
              console.warn('Chrome AI APIs not available. Adding fallback mode...');
              setIsFallbackMode(true);
              return;
            }
            
            // Add timeout to prevent hanging connections
            const timeoutPromise = new Promise((_, reject) => {
              setTimeout(() => reject(new Error('AI API connection timeout')), 5000);
            });
            
            const progressMonitor = {
              monitor: (m) => {
                m.addEventListener('downloadprogress', (e) => {
                  setProgress(Math.round((e.loaded / e.total) * 100));
                });
              }
            };
            
            try {
              const detectorPromise = window.ai.languageDetector.create(progressMonitor);
              const newDetector = await Promise.race([detectorPromise, timeoutPromise]);
              await newDetector.ready;
              setDetector(newDetector);
            } catch (error) {
              console.error('Error initializing detector:', error);
              setIsFallbackMode(true);
            }
          } catch (error) {
            console.error('Error initializing AI APIs:', error);
            setIsFallbackMode(true);
          }
        };
        initializeAI();
      }, []);
    
      // Load conversations
      useEffect(() => {
        const savedConversations = localStorage.getItem(STORAGE_KEY);
        if (savedConversations) {
          const parsed = JSON.parse(savedConversations);
          setConversations(parsed);
          if (parsed.length > 0) {
            setActiveConversationId(parsed[0].id);
            setShowTypewriter(false);
          }
        }
      }, []);
    
      // Save conversations
      useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
      }, [conversations]);
    
      // Scroll to bottom
      useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, [conversations]);
    
      // Get active conversation
      const activeConversation = conversations.find(conv => conv.id === activeConversationId);
    
      // Message bubble component
      const MessageBubble = ({ message }) => (
        <div className={`flex flex-col ${message.sender === 'user' ? 'items-end' : 'items-start'} mb-4`}>
          <div className={`max-w-[85%] md:max-w-xl px-4 py-2 rounded-lg ${
            message.sender === 'user'
              ? 'bg-[#373F68] text-white'
              : message.isError
              ? 'bg-red-100 text-red-700'
              : 'bg-gray-100 text-gray-800'
          }`}>
            {message.isTyping ? (
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
              </div>
            ) : (
              <>
                <p className="break-words whitespace-pre-wrap">{message.text}</p>
                <span className="text-xs opacity-50 mt-1 block">{message.timestamp}</span>
              </>
            )}
          </div>
          {message.sender === 'user' && message.detectedLanguage && (
            <p className="text-xs text-gray-500 mt-1 mr-2">
              {message.detectedLanguage} (Confidence: {message.confidence}%)
            </p>
          )}
        </div>
      );
    
      // Create new chat
      const createNewChat = () => {
        const newConversation = {
          id: Date.now(),
          title: `${getLanguageName(targetLanguage)} Translation`,
          timestamp: new Date().toLocaleString(),
          messages: [],
          language: targetLanguage
        };
        setConversations(prev => [newConversation, ...prev]);
        setActiveConversationId(newConversation.id);
        setIsSidebarOpen(false);
        setShowTypewriter(false);
        
        // Focus textarea after creating new chat
        setTimeout(() => {
          textareaRef.current?.focus();
        }, 100);
      };
    
      // Handle fallback translation when APIs aren't available
      const handleFallbackTranslation = () => {
        const userMessage = {
          id: Date.now(),
          text: inputText.trim(),
          sender: 'user',
          timestamp: new Date().toLocaleTimeString(),
        };
        
        setConversations(prev => prev.map(conv => {
          if (conv.id === activeConversationId) {
            return {
              ...conv,
              messages: [...conv.messages, userMessage, {
                id: Date.now() + 1,
                text: "Chrome AI translation API is unavailable. Please ensure you're using Chrome with the latest version and any required extensions are installed.",
                sender: 'ai',
                timestamp: new Date().toLocaleTimeString(),
                isError: true
              }]
            };
          }
          return conv;
        }));
        
        setInputText('');
        setIsProcessing(false);
      };
    
      // Handle send message
      const handleSendMessage = async () => {
        if (!inputText.trim() || isProcessing) return;
        
        // Auto-create a conversation if none exists
        if (!activeConversationId) {
          const newConvId = Date.now();
          const newConversation = {
            id: newConvId,
            title: `${getLanguageName(targetLanguage)} Translation`,
            timestamp: new Date().toLocaleString(),
            messages: [],
            language: targetLanguage
          };
          setConversations(prev => [newConversation, ...prev]);
          setActiveConversationId(newConvId);
          setShowTypewriter(false);
        }
        
        setIsProcessing(true);
        
        if (isFallbackMode) {
          handleFallbackTranslation();
          return;
        }
        
        try {
          const detectionResult = await detector.detect(inputText.trim());
          const detectedLanguage = detectionResult[0]?.detectedLanguage || 'unknown';
          const confidence = detectionResult[0]?.confidence || 0;
          const shouldSummarize = inputText.length > SUMMARY_THRESHOLD;
    
          const userMessage = {
            id: Date.now(),
            text: inputText.trim(),
            sender: 'user',
            timestamp: new Date().toLocaleTimeString(),
            detectedLanguage: detectedLanguage.charAt(0).toUpperCase() + detectedLanguage.slice(1),
            confidence: (confidence * 100).toFixed(1)
          };
    
          setConversations(prev => prev.map(conv => {
            if (conv.id === activeConversationId) {
              return {
                ...conv,
                messages: [...conv.messages, userMessage],
                timestamp: new Date().toLocaleString()
              };
            }
            return conv;
          }));
    
          setInputText('');
    
          // Add typing indicator
          setConversations(prev => prev.map(conv => {
            if (conv.id === activeConversationId) {
              return {
                ...conv,
                messages: [...conv.messages, {
                  id: Date.now() + 0.5,
                  isTyping: true,
                  sender: 'ai',
                  timestamp: new Date().toLocaleTimeString()
                }]
              };
            }
            return conv;
          }));
          
          // First handle summarization if text is long
          let sourceTextToTranslate = userMessage.text;
          let sourceSummary = '';
          
          if (shouldSummarize) {
            try {
              // Create a single sentence summary - fixed to ensure it's just one sentence
              // Extract first few words and create a single concise summary sentence
              const firstFewWords = sourceTextToTranslate.split(' ').slice(0, 10).join(' ');
              sourceSummary = `[Summary in ${userMessage.detectedLanguage}]: ${firstFewWords}...`;
              
              // Add the summary first
              setConversations(prev => prev.map(conv => {
                if (conv.id === activeConversationId) {
                  const messages = conv.messages.filter(msg => !msg.isTyping);
                  return {
                    ...conv,
                    messages: [...messages, {
                      id: Date.now() + 0.8,
                      text: sourceSummary,
                      sender: 'ai',
                      timestamp: new Date().toLocaleTimeString()
                    }]
                  };
                }
                return conv;
              }));
              
              // Add typing indicator for translation
              setConversations(prev => prev.map(conv => {
                if (conv.id === activeConversationId) {
                  return {
                    ...conv,
                    messages: [...conv.messages, {
                      id: Date.now() + 0.9,
                      isTyping: true,
                      sender: 'ai',
                      timestamp: new Date().toLocaleTimeString()
                    }]
                  };
                }
                return conv;
              }));
              
              // Use this as translation source
              sourceTextToTranslate = sourceSummary; 
            } catch (summaryError) {
              console.error('Summary error:', summaryError);
              // Continue with just translation if summarization fails
            }
          }
          
          // Now translate
          const translator = await window.ai.translator.create({
            sourceLanguage: detectedLanguage,
            targetLanguage
          });
    
          await translator.ready;
          let translatedText = await translator.translate(sourceTextToTranslate);
    
          // Remove typing indicator and add real response
          setConversations(prev => prev.map(conv => {
            if (conv.id === activeConversationId) {
              const messages = conv.messages.filter(msg => !msg.isTyping);
              return {
                ...conv,
                messages: [...messages, {
                  id: Date.now() + 1,
                  text: `Translation (${userMessage.detectedLanguage} → ${getLanguageName(targetLanguage)}):\n${translatedText}`,
                  sender: 'ai',
                  timestamp: new Date().toLocaleTimeString()
                }]
              };
            }
            return conv;
          }));
    
        } catch (error) {
          // Remove typing indicator if exists
          setConversations(prev => prev.map(conv => {
            if (conv.id === activeConversationId) {
              const messages = conv.messages.filter(msg => !msg.isTyping);
              return {
                ...conv,
                messages: [...messages, {
                  id: Date.now() + 2,
                  text: `Error: ${error.message}`,
                  sender: 'ai',
                  timestamp: new Date().toLocaleTimeString(),
                  isError: true
                }]
              };
            }
            return conv;
          }));
        } finally {
          setIsProcessing(false);
          setProgress(0);
        }
      };
    
      return (
        <div className="flex h-screen bg-gray-100 relative">
         {isSidebarOpen && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.05)] z-20 md:hidden" 
        onClick={() => setIsSidebarOpen(false)} />
      )}
    
          <div ref={sidebarRef}
               className={`fixed md:static inset-y-0 left-0 w-72 md:w-80 bg-white border-r border-gray-200
                          transform transition-transform duration-300 ease-in-out
                          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
                          z-30 flex flex-col`}>
            <div className="p-4 border-b border-gray-200">
              <button onClick={createNewChat}
                      className="w-full mb-4 p-2 flex items-center justify-center gap-2 bg-[#373F68] text-white 
                               rounded-lg hover:bg-[#373F68]/90 transition-colors">
                <Plus className="w-5 h-5" />
                New Translation
              </button>
              
              <div className="relative">
                <input type="text" 
                       value={searchQuery}
                       onChange={(e) => setSearchQuery(e.target.value)}
                       placeholder="Search conversations"
                       className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#373F68]" />
                <Search className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
              </div>
            </div>
    
            <div className="flex-1 overflow-y-auto">
              {conversations
                .filter(conv => conv.title.toLowerCase().includes(searchQuery.toLowerCase()))
                .map((conversation, index) => (
                  <div key={conversation.id}
                       onClick={() => {
                         setActiveConversationId(conversation.id);
                         setShowTypewriter(false);
                         setIsSidebarOpen(false);
                       }}
                       className={`flex items-center p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 
                                 transition-colors ${activeConversationId === conversation.id ? 'bg-[#373F68]/10' : ''}`}>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-800">Conversation {index + 1}</h3>
                      <p className="text-sm text-gray-500">{conversation.timestamp}</p>
                    </div>
                    <Languages className="text-gray-400 w-4 h-4" />
                  </div>
                ))}
            </div>
          </div>
    
          <div className="flex-1 flex flex-col bg-white">
            <div className="md:hidden flex items-center p-4 border-b border-gray-200">
              <button onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                      className="p-1 hover:bg-gray-100 rounded-lg">
                {isSidebarOpen ? (
                  <X className="w-6 h-6 text-gray-600" />
                ) : (
                  <Menu className="w-6 h-6 text-gray-600" />
                )}
              </button>
              <span className="ml-4 font-medium text-gray-800">
                {activeConversation?.title || 'Select a conversation'}
              </span>
            </div>
    
            <div className="flex-1 overflow-y-auto p-4">
              {activeConversation && !showTypewriter ? (
                <>
                  {activeConversation.messages.map(message => (
                    <MessageBubble key={message.id} message={message} />
                  ))}
                  <div ref={messagesEndRef} />
                </>
              ) : (
                <TypewriterText />
              )}
            </div>
    
            <div className="border-t border-gray-200 p-4">
              <div className="flex flex-col space-y-2">
                <div className="flex items-start space-x-2">
                  <div className="flex-1 relative">
                    <textarea
                      ref={textareaRef}
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      onFocus={handleTextareaFocus}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                      placeholder="Type text to translate..."
                      className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#373F68] resize-none overflow-y-auto max-h-40"
                      disabled={isProcessing}
                      rows="3"
                    />
                    <span className="absolute bottom-2 right-2 text-xs text-gray-500">
                      Number of Characters: {inputText.length}
                    </span>
                  </div>
    
                  <div className="flex flex-col space-y-2">
                    <select
                      value={targetLanguage}
                      onChange={(e) => setTargetLanguage(e.target.value)}
                      className="w-32 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#373F68] bg-white"
                    >
                      {availableLanguages.map(lang => (
                        <option key={lang.code} value={lang.code}>{lang.name}</option>
                      ))}
                    </select>
                    <button
                      onClick={handleSendMessage}
                      disabled={isProcessing || !inputText.trim()}
                      className={`p-3 rounded-lg w-full flex justify-center items-center ${
                        isProcessing || !inputText.trim()
                          ? 'bg-gray-300 cursor-not-allowed'
                          : 'bg-[#373F68] hover:bg-[#373F68]/90'
                      } text-white transition-colors`}
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span className="ml-2">
                            {progress > 0 ? `${progress}%` : 'Processing...'}
                          </span>
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          <span className="ml-2">
                            {inputText.length > SUMMARY_THRESHOLD ? 'Summarize & Translate' : 'Translate'}
                          </span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    };
    
    export default App;