
// import React, { useState, useEffect, useRef } from 'react';
// import { Search, Send, History, Loader, Menu, X, Languages } from 'lucide-react';

// const App = () => {
//   const [inputText, setInputText] = useState('');
//   const [chatHistory, setChatHistory] = useState([]);
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [selectedConversation, setSelectedConversation] = useState(null);
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Added this line
//   const [targetLanguage, setTargetLanguage] = useState('es');
//   const [detector, setDetector] = useState(null);
//   const [conversations, setConversations] = useState([
//     { id: 1, title: 'English to Spanish', timestamp: '2024-02-20 10:30' },
//     { id: 2, title: 'French Translation', timestamp: '2024-02-19 15:45' },
//     { id: 3, title: 'German Detection', timestamp: '2024-02-18 09:15' },
//   ]);

//   // Available languages for translation
//   const availableLanguages = [
//     { code: 'es', name: 'Spanish' },
//     { code: 'fr', name: 'French' },
//     { code: 'de', name: 'German' },
//     { code: 'it', name: 'Italian' },
//     { code: 'pt', name: 'Portuguese' },
//   ];

//   const messagesEndRef = useRef(null);
//   const sidebarRef = useRef(null);

//   // Click outside handler for sidebar
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
//         setIsSidebarOpen(false);
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, []);

//   async function handleSendMessage() {
//     if (inputText.trim() && !isProcessing) {
//       try {
//         const result = await processMessage(inputText.trim());
//         console.log("Processed message:", result);
//         setInputText('');
//       } catch (error) {
//         console.error("Error processing message:", error);
//       }
//     }
//   } 

//   const handleConversationSelect = (conversation) => {
//     setSelectedConversation(conversation);
//     setIsSidebarOpen(false);
//   };

//   // Message bubble component
//   const MessageBubble = ({ message }) => (
//     <div className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} mb-4`}>
//       <div
//         className={`max-w-[85%] md:max-w-xl px-4 py-2 rounded-lg ${
//           message.sender === 'user'
//             ? 'bg-[#C75AF6] text-white'
//             : message.isError
//             ? 'bg-red-100 text-red-700'
//             : 'bg-gray-100 text-gray-800'
//         }`}
//       >
//         {message.isTyping ? (
//           <div className="flex items-center space-x-2">
//             <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" />
//             <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
//             <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
//           </div>
//         ) : (
//           <>
//             <p className="break-words">{message.text}</p>
//             <span className="text-xs opacity-50 mt-1 block">
//               {message.timestamp}
//             </span>
//           </>
//         )}
//       </div>
//     </div>
//   );

//   const processMessage = async (text) => { 
//     setIsProcessing(true);
  
//     // Add user message
//     const userMessage = {
//       id: Date.now(),
//       text,
//       sender: "user",
//       timestamp: new Date().toLocaleTimeString(),
//     };
    
//     setChatHistory(prev => [...prev, userMessage]);
  
//     try {
//       // Show language detection message
//       const detectingMessage = {
//         id: Date.now() + 1,
//         text: "Detecting language...",
//         sender: "ai",
//         timestamp: new Date().toLocaleTimeString(),
//         isTyping: true,
//       };
  
//       setChatHistory(prev => [...prev, detectingMessage]);
  
//       // Detect language using Chrome AI
//       let detectedLanguage = "unknown";
//       if (detector) {
//         const result = await detector.detect(text);
//         detectedLanguage = result.languages[0]?.language || "unknown";
//       }
  
//       // Update detected language message
//       setChatHistory(prev =>
//         prev.map(msg =>
//           msg.id === detectingMessage.id
//             ? {
//                 ...msg,
//                 text: `Detected language: ${detectedLanguage}`,
//                 isTyping: false,
//               }
//             : msg
//         )
//       );
  
//       // Show translation in progress
//       const translatingMessage = {
//         id: Date.now() + 2,
//         text: "Translating...",
//         sender: "ai",
//         timestamp: new Date().toLocaleTimeString(),
//         isTyping: true,
//       };
  
//       setChatHistory(prev => [...prev, translatingMessage]);
  
//       // Function to process translation
//       let translatedText = text; // Default to original text in case translation fails
//       if (typeof self.ai?.translate === "function") {
//         try {
//           translatedText = await self.ai.translate(text, "en"); 
//           console.log("Translated text:", translatedText);
//         } catch (error) {
//           console.error("Translation error:", error);
//         }
//       } else {
//         console.warn("AI translation API is not supported.");
//       }
  
//       // Update translated message
//       setChatHistory(prev =>
//         prev.map(msg =>
//           msg.id === translatingMessage.id
//             ? {
//                 ...msg,
//                 text: `Translation (${detectedLanguage} → English): ${translatedText}`,
//                 isTyping: false,
//               }
//             : msg
//         )
//       );
  
//     } catch (error) {
//       console.error("Translation error:", error);
//       setChatHistory(prev => [
//         ...prev,
//         {
//           id: Date.now() + 3,
//           text: "An error occurred during translation.",
//           sender: "ai",
//           timestamp: new Date().toLocaleTimeString(),
//           isError: true,
//         }
//       ]);
//     } finally {
//       setIsProcessing(false);
//     }
//   };
  

//   return (
//     <div className="flex h-screen bg-gray-100 relative">
//       {isSidebarOpen && (
//         <div className="fixed inset-0 bg-[rgba(0,0,0,0.05)] z-20 md:hidden" onClick={() => setIsSidebarOpen(false)} />
//       )}

//       {/* this is the side-bar */}
//       <div ref={sidebarRef}
//         className={`
//           fixed md:static
//           inset-y-0 left-0
//           w-64 md:w-1/4
//           bg-white
//           border-r border-gray-200
//           transform transition-transform duration-300 ease-in-out
//           ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
//           z-30
//           flex flex-col
//         `}
//       >
//         <div className="p-4 border-b border-gray-200">
//           <div className="relative">
//             <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search translation history"
//               className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C75AF6]"
//             />
//             <Search className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
//           </div>
//         </div>
//         <div className="flex-1 overflow-y-auto">
//           {conversations
//             .filter(conv => conv.title.toLowerCase().includes(searchQuery.toLowerCase()))
//             .map(conversation => (
//               <div
//                 key={conversation.id}
//                 onClick={() => handleConversationSelect(conversation)}
//                 className={`flex items-center p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition duration-150 ${
//                   selectedConversation?.id === conversation.id ? 'bg-[#C75AF6]/10' : ''
//                 }`}
//               >
//                 <div className="flex-1">
//                   <h3 className="font-medium text-gray-800">{conversation.title}</h3>
//                   <p className="text-sm text-gray-500">{conversation.timestamp}</p>
//                 </div>
//                 <Languages className="text-gray-400 w-4 h-4" />
//               </div>
//             ))}
//         </div>
//       </div>


//       <div className="flex-1 flex flex-col bg-white">
//           {/* this is the responsive sidebar */}
//         <div className="md:hidden flex items-center p-4 border-b border-gray-200">
//           <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-1 hover:bg-gray-100 rounded-lg">
//             {isSidebarOpen ? (
//               <X className="w-6 h-6 text-gray-600" />
//             ) : (
//               <Menu className="w-6 h-6 text-gray-600" />
//             )}
//           </button>
//           <span className="ml-4 font-medium text-gray-800">Language Translator and Summarizer</span>
//         </div>

//           {/* this is the main chat body */}
//         <div className="flex-1 overflow-y-auto p-4">
//           {chatHistory.map(message => (
//             <MessageBubble key={message.id} message={message} />
//           ))}
//           <div ref={messagesEndRef} />
//         </div>

//           {/* this is the input area */}
//         <div className="border-t border-gray-200 p-4">
//           <div className="flex flex-col space-y-2">
//             <div className="flex items-start space-x-2">
//               <textarea
//                 value={inputText}
//                 onChange={(e) => setInputText(e.target.value)}
//                 onKeyDown={(e) => {
//                   if (e.key === "Enter" && !e.shiftKey) {
//                     e.preventDefault(); // Prevents newline in the input field
//                     handleSendMessage();
//                   }
//                 }}
//                 placeholder="Type text to translate..."
//                 className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C75AF6] resize-none overflow-y-auto max-h-40"
//                 disabled={isProcessing}
//                 rows="3"
//               />
//               <div className="flex flex-col space-y-2">
//                 <select value={targetLanguage} onChange={(e) => setTargetLanguage(e.target.value)}
//                   className="w-32 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C75AF6] bg-white">
//                   {availableLanguages.map(lang => (
//                     <option key={lang.code} value={lang.code}>{lang.name}</option>
//                   ))}
//                 </select>
//                 <button onClick={handleSendMessage} disabled={isProcessing || !inputText.trim()} className={`p-3 rounded-lg w-full flex justify-center ${
//                   isProcessing || !inputText.trim()
//                     ? 'bg-gray-300 cursor-not-allowed'
//                     : 'bg-[#C75AF6] hover:bg-[#C75AF6]/90'
//                   } text-white transition duration-150`}
//                 >
//                   {isProcessing ? (
//                     <Loader className="w-5 h-5 animate-spin" />
//                   ) : (
//                     <><Send className="w-5 h-5 mt-1" /><div className='ml-1'>Translate</div></>
//                   )}
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//     </div>
//   );
// };

// export default App;



// import React, { useState } from "react";

// function App() {
//   const [inputText, setInputText] = useState("");
//   const [translatedText, setTranslatedText] = useState("");
//   const [translating, setTranslating] = useState(false);
//   const [detectedLanguage, setDetectedLanguage] = useState("");
//   const [downloadProgress, setDownloadProgress] = useState(0);
//   const [downloading, setDownloading] = useState(false);

//   const handleTranslate = async () => {
//     setTranslating(true);
//     setTranslatedText(""); // Clear previous translation

//     try {
//       // 🌐 1️⃣ Check if language detection is supported
//       const detectorCapabilities = await ai.languageDetector?.capabilities();
//       if (detectorCapabilities?.available === "no") {
//         console.error("Sorry, your device does not support language detection.");
//         setTranslating(false);
//         setTranslatedText("Device does not support language detection.");
//         return;
//       }

//       let detector;
//       if (detectorCapabilities?.available === "readily") {
//         // ✅ If available, create detector
//         detector = await ai.languageDetector.create();
//       } else {
//         // ⏳ If not readily available, download first
//         console.log("Downloading language detection model...");
//         setDownloading(true);
//         detector = await ai.languageDetector.create({
//           monitor(m) {
//             m.addEventListener("downloadprogress", (e) => {
//               const progress = (e.loaded / e.total) * 100;
//               setDownloadProgress(progress);
//               console.log(`Language model downloading: ${progress.toFixed(2)}%`);
//             });
//           },
//         });
//         await detector.ready;
//         setDownloading(false);
//         setDownloadProgress(0);
//       }

//       // 🔍 2️⃣ Detect the language
//       const detectedLanguages = await detector.detect(inputText);
//       const detectedLangCode = detectedLanguages[0]?.detectedLanguage || "en";
//       console.log(`Detected Language: ${detectedLangCode}`);

//       setDetectedLanguage(detectedLangCode);

//       // 🌐 3️⃣ Check if translation is supported
//       const translatorCapabilities = await ai.translator?.capabilities();
//       if (translatorCapabilities?.available === "no") {
//         console.error("Translation is not supported on this device.");
//         setTranslating(false);
//         setTranslatedText("Device does not support translation.");
//         return;
//       }

//       let translator;
//       if (translatorCapabilities?.available === "readily") {
//         translator = await ai.translator.create({
//           sourceLanguage: detectedLangCode,
//           targetLanguage: "es",
//         });
//       } else {
//         console.log("Downloading AI translation model...");
//         setDownloading(true);

//         translator = await ai.translator.create({
//           sourceLanguage: detectedLangCode,
//           targetLanguage: "es",
//           monitor(m) {
//             m.addEventListener("downloadprogress", (e) => {
//               const progress = (e.loaded / e.total) * 100;
//               setDownloadProgress(progress);
//               console.log(`Translation model downloading: ${progress.toFixed(2)}%`);
//             });
//           },
//         });

//         setDownloading(false);
//         setDownloadProgress(0);
//       }

//       // 📡 4️⃣ Translate the text
//       const translated = await translator.translate(inputText);
//       console.log("Translated Text:", translated);
//       setTranslatedText(translated);
      
//     } catch (error) {
//       console.error("Error in detection/translation:", error);
//       setTranslatedText("An error occurred during translation.");
//     } finally {
//       setTranslating(false);
//     }
//   };

//   return (
//     <div style={{ padding: "20px" }}>
//       <h1 className="text-xl font-semibold">🌟 Language Detector & Translator</h1>
      
//       <textarea 
//         rows="4"
//         cols="50"
//         value={inputText}
//         onChange={(e) => setInputText(e.target.value)}
//         placeholder="Enter text here..." 
//         className="bg-gray-200 p-3 my-2 rounded-md outline-none"
//       />

//       <br />

//       <button onClick={handleTranslate} className="bg-blue-400 text-white p-2 rounded-md" disabled={translating || downloading}>
//         {downloading ? `Downloading... ${Math.round(downloadProgress)}%` : translating ? "Translating..." : "Translate"}
//       </button>

//       {detectedLanguage && (
//         <p className="mt-2 text-green-600">
//           🌍 Detected Language: <strong>{detectedLanguage}</strong>
//         </p>
//       )}

//       {translatedText && (
//         <p className="mt-4">
//           <strong>📖 Translated Text:</strong> {translatedText}
//         </p>
//       )}

//       {downloading && (
//         <p className="mt-2 text-red-600">📥 Download Progress: 
//           <strong>{Math.round(downloadProgress)}%</strong>
//         </p>
//       )}
//     </div>
//   );
// }

// export default App;

  // const handleSummarize = async () => {
  //   const summary = await summarizeText(inputText);
  //   setOutput(summary);
  // };

  // const handleDetectLanguage = async () => {
  //   const lang = await detectLanguage(inputText);
  //   setLanguage(lang);
  // };


  // {output && <p><strong>Summary:</strong> {output}</p>}
  // {language && <p><strong>Detected Language:</strong> {language}</p>} */}

      {/* <button onClick={handleSummarize}>Summarize</button> */}
      {/* <button onClick={handleDetectLanguage}>Detect Language</button> */}

    //   {detecting
    //     ? "Detecting Language..."
    //     : translating
    //     ? "Translating..."
    //     : "Translate"}
    // </button>

    // {downloadProgress > 0 && downloadProgress < 100 && (
    //   <p>Model Download Progress: {downloadProgress.toFixed(2)}%</p>
    // )}

    // {detectedLanguage && (
    //   <p>
    //     <strong>Detected Language:</strong> {detectedLanguage}
    //   </p>
    // )}


    // import React, { useState, useCallback } from 'react';
    // import { AlertCircle, Check, Loader2 } from 'lucide-react';
    
    // // Simple custom Alert component
    // const Alert = ({ children, variant = 'default' }) => {
    //   const bgColor = variant === 'destructive' ? 'bg-red-100' : 'bg-blue-100';
    //   const textColor = variant === 'destructive' ? 'text-red-800' : 'text-blue-800';
      
    //   return (
    //     <div className={`${bgColor} ${textColor} p-4 rounded-lg flex items-center gap-2`}>
    //       {children}
    //     </div>
    //   );
    // };
    
    // const App = () => {
    //   const [text, setText] = useState("");
    //   const [summary, setSummary] = useState("");
    //   const [language, setLanguage] = useState(null);
    //   const [translation, setTranslation] = useState("");
    //   const [targetLanguage, setTargetLanguage] = useState("en");
    //   const [isProcessing, setIsProcessing] = useState(false);
    //   const [progress, setProgress] = useState(0);
    //   const [error, setError] = useState(null);
    
    //   // Check if AI APIs are available
    //   const checkAISupport = useCallback(() => {
    //     if (!('ai' in window)) {
    //       throw new Error('Chrome AI APIs are not available in this browser.');
    //     }
    //     return true;
    //   }, []);
    
    //   // Generic progress monitor setup
    //   const createProgressMonitor = (operation) => ({
    //     monitor: (m) => {
    //       m.addEventListener('downloadprogress', (e) => {
    //         const progressPercent = Math.round((e.loaded / e.total) * 100);
    //         setProgress(progressPercent);
    //         console.log(`${operation} model downloading: ${progressPercent}%`);
    //       });
    //     }
    //   });
    
    //   // Error handler
    //   const handleError = (error, operation) => {
    //     console.error(`Error during ${operation}:`, error);
    //     setError(`${operation} failed: ${error.message}`);
    //     setIsProcessing(false);
    //     setProgress(0);
    //   };
    
    //   // Check language pair availability
    //   const checkLanguagePairAvailability = async (sourceLanguage, targetLanguage) => {
    //     try {
    //       const translatorCapabilities = await window.ai.translator.capabilities();
    //       const availability = await translatorCapabilities.languagePairAvailable(sourceLanguage, targetLanguage);
          
    //       if (availability === 'no') {
    //         throw new Error(`Translation from ${sourceLanguage} to ${targetLanguage} is not supported`);
    //       }
    //       return availability;
    //     } catch (error) {
    //       throw new Error(`Failed to check language pair availability: ${error.message}`);
    //     }
    //   };
    
    //   // Summarization function
    //   const handleSummarize = async () => {
    //     setIsProcessing(true);
    //     setError(null);
    //     setSummary("");
    
    //     try {
    //       checkAISupport();
          
    //       const summarizer = await window.ai.summarizer.create({
    //         ...createProgressMonitor('Summarizer'),
    //         sharedContext: "This is a scientific article",
    //         type: "key-points",
    //         format: "markdown",
    //         length: "medium",
    //       });
    
    //       await summarizer.ready;
    
    //       const resultStream = await summarizer.summarize(text, {
    //         context: "This article is intended for a tech-savvy audience.",
    //       });
    
    //       let result = "";
    //       let previousChunk = "";
    
    //       for await (const chunk of resultStream) {
    //         const newChunk = chunk.startsWith(previousChunk)
    //           ? chunk.slice(previousChunk.length)
    //           : chunk;
    //         result += newChunk;
    //         previousChunk = chunk;
    //       }
    
    //       setSummary(result);
    //     } catch (error) {
    //       handleError(error, 'Summarization');
    //     } finally {
    //       setIsProcessing(false);
    //       setProgress(0);
    //     }
    //   };
    
    //   // Language detection function
    //   const detectLanguage = async (textToDetect) => {
    //     try {
    //       checkAISupport();
          
    //       const detector = await window.ai.languageDetector.create(createProgressMonitor('Language Detector'));
    //       await detector.ready;
          
    //       const results = await detector.detect(textToDetect);
    //       const topResult = results[0];
          
    //       if (!topResult) {
    //         throw new Error('No language detected');
    //       }
          
    //       return {
    //         detectedLanguage: topResult.detectedLanguage,
    //         confidence: topResult.confidence
    //       };
    //     } catch (error) {
    //       throw new Error(`Language detection failed: ${error.message}`);
    //     }
    //   };
    
    //   // Translation function
    //   const handleTranslate = async () => {
    //     if (!text) {
    //       setError('Please enter text to translate');
    //       return;
    //     }
    
    //     setIsProcessing(true);
    //     setError(null);
    //     setTranslation("");
    
    //     try {
    //       checkAISupport();
    
    //       // Detect language first
    //       const detectedLang = await detectLanguage(text);
    //       setLanguage(detectedLang);
    
    //       // Check if translation is available
    //       const availability = await checkLanguagePairAvailability(
    //         detectedLang.detectedLanguage,
    //         targetLanguage
    //       );
    
    //       const translator = await window.ai.translator.create({
    //         ...createProgressMonitor('Translator'),
    //         sourceLanguage: detectedLang.detectedLanguage,
    //         targetLanguage: targetLanguage,
    //       });
    
    //       await translator.ready;
    //       const translatedText = await translator.translate(text);
    //       setTranslation(translatedText);
    //     } catch (error) {
    //       handleError(error, 'Translation');
    //     } finally {
    //       setIsProcessing(false);
    //       setProgress(0);
    //     }
    //   };
    
    //   return (
    //     <div className="max-w-4xl mx-auto p-6 space-y-6">
    //       <h1 className="text-3xl font-bold flex items-center gap-2">
    //         AI Text Processor
    //       </h1>
    
    //       {error && (
    //         <Alert variant="destructive">
    //           <AlertCircle className="h-4 w-4" />
    //           <span>{error}</span>
    //         </Alert>
    //       )}
    
    //       <div className="space-y-4">
    //         <textarea
    //           rows="6"
    //           value={text}
    //           onChange={(e) => setText(e.target.value)}
    //           placeholder="Enter or paste text here..."
    //           className="w-full p-4 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
    //         />
    
    //         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    //           <div className="space-y-4">
    //             {text.length > 150 && (
    //               <button
    //                 onClick={handleSummarize}
    //                 disabled={isProcessing}
    //                 className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 disabled:opacity-50 flex items-center justify-center gap-2"
    //               >
    //                 {isProcessing ? (
    //                   <>
    //                     <Loader2 className="h-4 w-4 animate-spin" />
    //                     Processing... {progress > 0 ? `${progress}%` : ""}
    //                   </>
    //                 ) : (
    //                   "Summarize"
    //                 )}
    //               </button>
    //             )}
    
    //             {summary && (
    //               <div className="p-4 bg-gray-50 rounded-lg">
    //                 <h2 className="text-xl font-semibold mb-2">📌 Summary</h2>
    //                 <p className="whitespace-pre-wrap">{summary}</p>
    //               </div>
    //             )}
    //           </div>
    
    //           <div className="space-y-4">
    //             <div className="space-y-2">
    //               <label className="block font-semibold">Target Language:</label>
    //               <select
    //                 value={targetLanguage}
    //                 onChange={(e) => setTargetLanguage(e.target.value)}
    //                 className="w-full p-2 border rounded-lg"
    //               >
    //                 <option value="en">English</option>
    //                 <option value="fr">French</option>
    //                 <option value="es">Spanish</option>
    //                 <option value="de">German</option>
    //                 <option value="zh">Chinese</option>
    //                 <option value="ja">Japanese</option>
    //                 <option value="ko">Korean</option>
    //                 <option value="ru">Russian</option>
    //               </select>
    //             </div>
    
    //             <button
    //               onClick={handleTranslate}
    //               disabled={isProcessing}
    //               className="w-full bg-green-500 text-white p-3 rounded-lg hover:bg-green-600 disabled:opacity-50 flex items-center justify-center gap-2"
    //             >
    //               {isProcessing ? (
    //                 <>
    //                   <Loader2 className="h-4 w-4 animate-spin" />
    //                   Processing... {progress > 0 ? `${progress}%` : ""}
    //                 </>
    //               ) : (
    //                 "Translate"
    //               )}
    //             </button>
    
    //             {language && (
    //               <div className="p-4 bg-gray-50 rounded-lg">
    //                 <h2 className="text-xl font-semibold mb-2">🌎 Detected Language</h2>
    //                 <p>
    //                   {language.detectedLanguage.toUpperCase()} 
    //                   <span className="text-gray-500">
    //                     (Confidence: {(language.confidence * 100).toFixed(1)}%)
    //                   </span>
    //                 </p>
    //               </div>
    //             )}
  //   <div className="flex flex-col items-center justify-center h-full">
  //   <h2 className="text-3xl font-bold text-gray-400 mb-4">AI Powered Text Translation</h2>
  //   <p className=" text-3xl font-bold text-[#C75AF6]/70">
  //     {text}<span className="animate-pulse ">|</span>
  //   </p>
  // </div>
    //             {translation && (
    //               <div className="p-4 bg-gray-50 rounded-lg">
    //                 <h2 className="text-xl font-semibold mb-2">🌍 Translation</h2>
    //                 <p className="whitespace-pre-wrap">{translation}</p>
    //               </div>
    //             )}
    //           </div>
    //         </div>
    //       </div>
    //     </div>
    //   );
    // };
    
    // export default App;

    import React, { useState, useEffect, useRef } from 'react';
    import { Search, Send, Languages, Menu, X, Plus, Loader2 } from 'lucide-react';
    
    const STORAGE_KEY = 'translation_history';
    const SUMMARY_THRESHOLD = 150; // Define threshold for summarization
    
    // Standalone TypewriterText component
    const TypewriterText = () => {
      const [text, setText] = useState('');
      const [phraseIndex, setPhrseIndex] = useState(0);
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
              setPhrseIndex((prev) => (prev + 1) % phrases.length);
            }
          } else {
            setText(currentPhrase.slice(0, text.length + 1));
            if (text === currentPhrase) {
              setTimeout(() => setIsDeleting(true), pauseTime);
            }
          }
        }, isDeleting ? deletingSpeed : typingSpeed);
    
        return () => clearTimeout(timer);
      }, [text, isDeleting, phraseIndex, phrases]); // Added phrases to dependency array
    
      return (
        <div className="flex flex-col items-center justify-center h-full">
          <h2 className="text-3xl font-bold text-gray-400 mb-4">AI Powered Text Translation</h2>
          <p className="text-3xl font-bold text-[#C75AF6]/70">
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
    
      // Refs
      const messagesEndRef = useRef(null);
      const sidebarRef = useRef(null);
    
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
    
      // Initialize AI
      useEffect(() => {
        const initializeAI = async () => {
          try {
            if (!('ai' in window)) {
              throw new Error('Chrome AI APIs are not available in this browser.');
            }
            const progressMonitor = {
              monitor: (m) => {
                m.addEventListener('downloadprogress', (e) => {
                  setProgress(Math.round((e.loaded / e.total) * 100));
                });
              }
            };
            const newDetector = await window.ai.languageDetector.create(progressMonitor);
            await newDetector.ready;
            setDetector(newDetector);
          } catch (error) {
            console.error('Error initializing AI APIs:', error);
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
        <div className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} mb-4`}>
          <div className={`max-w-[85%] md:max-w-xl px-4 py-2 rounded-lg ${
            message.sender === 'user'
              ? 'bg-[#C75AF6] text-white'
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
                {message.sender === 'user' && message.detectedLanguage && (
                  <p className="text-xs text-white/80 mt-1">
                    {message.detectedLanguage} (Confidence: {message.confidence}%)
                  </p>
                )}
                <span className="text-xs opacity-50 mt-1 block">{message.timestamp}</span>
              </>
            )}
          </div>
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
      };
    
      // Handle send message
      const handleSendMessage = async () => {
        if (!inputText.trim() || isProcessing || !activeConversationId) return;
        setIsProcessing(true);
        
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
    
          const translator = await window.ai.translator.create({
            sourceLanguage: detectedLanguage,
            targetLanguage
          });
    
          await translator.ready;
          
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
          
          let translatedText = await translator.translate(userMessage.text);
          
          // Handle summarization for long texts if needed
          if (shouldSummarize) {
            try {
              // You would implement AI summarization here
              // This is a placeholder - in a real app, you'd use an AI service
              if (translatedText.length > SUMMARY_THRESHOLD * 0.8) {
                translatedText = `[Summary] ${translatedText.substring(0, SUMMARY_THRESHOLD)}... (full translation available)`;
              }
            } catch (summaryError) {
              console.error('Summary error:', summaryError);
              // Continue with just translation if summarization fails
            }
          }
    
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
            <div className="fixed inset-0 bg-black bg-opacity-20 z-20 md:hidden" 
                 onClick={() => setIsSidebarOpen(false)} />
          )}
    
          <div ref={sidebarRef}
               className={`fixed md:static inset-y-0 left-0 w-72 md:w-80 bg-white border-r border-gray-200
                          transform transition-transform duration-300 ease-in-out
                          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
                          z-30 flex flex-col`}>
            <div className="p-4 border-b border-gray-200">
              <button onClick={createNewChat}
                      className="w-full mb-4 p-2 flex items-center justify-center gap-2 bg-[#C75AF6] text-white 
                               rounded-lg hover:bg-[#C75AF6]/90 transition-colors">
                <Plus className="w-5 h-5" />
                New Translation
              </button>
              
              <div className="relative">
                <input type="text" 
                       value={searchQuery}
                       onChange={(e) => setSearchQuery(e.target.value)}
                       placeholder="Search conversations"
                       className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C75AF6]" />
                <Search className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
              </div>
            </div>
    
            <div className="flex-1 overflow-y-auto">
              {conversations
                .filter(conv => conv.title.toLowerCase().includes(searchQuery.toLowerCase()))
                .map(conversation => (
                  <div key={conversation.id}
                       onClick={() => {
                         setActiveConversationId(conversation.id);
                         setIsSidebarOpen(false);
                       }}
                       className={`flex items-center p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 
                                 transition-colors ${activeConversationId === conversation.id ? 'bg-[#C75AF6]/10' : ''}`}>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-800">{conversation.title}</h3>
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
              {activeConversation ? (
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
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                      placeholder={activeConversationId ? "Type text to translate..." : "Select a conversation to start"}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C75AF6] resize-none overflow-y-auto max-h-40"
                      disabled={isProcessing || !activeConversationId}
                      rows="3"
                    />
                    <span className="absolute bottom-2 right-2 text-xs text-gray-500">
                      Characters: {inputText.length}
                    </span>
                  </div>
    
                  <div className="flex flex-col space-y-2">
                    <select
                      value={targetLanguage}
                      onChange={(e) => setTargetLanguage(e.target.value)}
                      className="w-32 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C75AF6] bg-white"
                    >
                      {availableLanguages.map(lang => (
                        <option key={lang.code} value={lang.code}>{lang.name}</option>
                      ))}
                    </select>
                    <button
                      onClick={handleSendMessage}
                      disabled={isProcessing || !activeConversationId || !inputText.trim()}
                      className={`p-3 rounded-lg w-full flex justify-center items-center ${
                        isProcessing || !activeConversationId || !inputText.trim()
                          ? 'bg-gray-300 cursor-not-allowed'
                          : 'bg-[#C75AF6] hover:bg-[#C75AF6]/90'
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
    