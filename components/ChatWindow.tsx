import React, { useState, useEffect, useRef } from 'react';
import { Conversation, Message, MessageType, SenderType } from '../types';
import { Phone, Video, Info, Paperclip, Mic, Smile, Send, Sparkles, FileText, Download } from 'lucide-react';
import { getSmartSuggestions } from '../services/geminiService';

interface Props {
  conversation: Conversation;
  onSendMessage: (text: string, type?: MessageType, fileData?: { name: string, size: string }) => void;
  onToggleInfo: () => void;
}

const ChatWindow: React.FC<Props> = ({ conversation, onSendMessage, onToggleInfo }) => {
  const [inputText, setInputText] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  useEffect(() => {
    // Scroll to bottom when conversation changes or messages added
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [conversation.messages, conversation.id]);

  useEffect(() => {
    // Fetch AI suggestions when context changes
    const fetchSuggestions = async () => {
      setLoadingSuggestions(true);
      const newSuggestions = await getSmartSuggestions(
        conversation.messages,
        conversation.client.name,
        conversation.client.qualificationTarget
      );
      setSuggestions(newSuggestions);
      setLoadingSuggestions(false);
    };

    // Debounce a bit or only call if last message wasn't from agent
    const lastMsg = conversation.messages[conversation.messages.length - 1];
    if (lastMsg && lastMsg.sender !== SenderType.AGENT) {
      fetchSuggestions();
    } else {
        setSuggestions([]); // Clear if we just replied
    }
  }, [conversation.messages.length, conversation.id]);

  const handleSend = () => {
    if (!inputText.trim()) return;
    onSendMessage(inputText);
    setInputText('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Mock upload
      onSendMessage(`Sent a file: ${file.name}`, MessageType.DOCUMENT, {
        name: file.name,
        size: `${(file.size / 1024 / 1024).toFixed(2)} MB`
      });
    }
  };

  const missingDocsCount = conversation.documents.filter(d => d.status === 'missing' || d.status === 'pending').length;

  return (
    <div className="flex-1 flex flex-col h-full bg-white relative">
      {/* Header */}
      <div className="h-16 border-b border-gray-200 flex items-center justify-between px-6 bg-white shrink-0 z-20 shadow-sm">
        <div className="flex items-center gap-3">
           {/* Mobile menu triggers could go here */}
          <div className="relative">
            <img src={conversation.client.avatar} alt="Avatar" className="w-10 h-10 rounded-full" />
             <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-messenger-green border-2 border-white rounded-full"></div>
          </div>
          <div>
            <h2 className="font-bold text-gray-900 leading-tight">{conversation.client.name}</h2>
            <p className="text-xs text-gray-500">{conversation.client.qualificationTarget}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-messenger-blue">
          <button className="p-2 hover:bg-blue-50 rounded-full transition-colors">
            <Phone className="w-5 h-5" />
          </button>
          <button className="p-2 hover:bg-blue-50 rounded-full transition-colors">
            <Video className="w-5 h-5" />
          </button>
          <button 
            className="p-2 hover:bg-blue-50 rounded-full transition-colors lg:hidden"
            onClick={onToggleInfo}
          >
            <Info className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* AI Context Bar */}
      {missingDocsCount > 0 && (
        <div className="bg-messenger-purple/5 border-b border-messenger-purple/10 px-6 py-2 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-medium text-messenger-purple">
                <Sparkles className="w-3 h-3" />
                <span>AI Insight: {missingDocsCount} documents still needed for assessment.</span>
            </div>
            <button 
                onClick={() => onSendMessage("Hi, just following up on the remaining documents needed for your assessment. Could you please upload them when ready?", MessageType.TEXT)}
                className="text-xs bg-white text-messenger-purple border border-messenger-purple/20 px-2 py-1 rounded hover:bg-messenger-purple hover:text-white transition-colors">
                Auto-Request
            </button>
        </div>
      )}

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-6 bg-[#F5F7FA]" ref={scrollRef}>
        <div className="space-y-6">
          {conversation.messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex w-full ${msg.sender === SenderType.AGENT ? 'justify-end' : 'justify-start'}`}
            >
               {msg.sender === SenderType.SYSTEM ? (
                   <div className="w-full flex justify-center my-2">
                       <span className="text-[10px] font-medium text-gray-400 bg-gray-200/50 px-3 py-1 rounded-full uppercase tracking-wide">
                           {msg.content}
                       </span>
                   </div>
               ) : (
                <div className={`flex max-w-[70%] ${msg.sender === SenderType.AGENT ? 'flex-row-reverse' : 'flex-row'} gap-2`}>
                    {msg.sender !== SenderType.AGENT && (
                        <img src={conversation.client.avatar} className="w-8 h-8 rounded-full self-end mb-1" alt="" />
                    )}
                    
                    <div className={`
                        relative px-4 py-3 rounded-2xl shadow-sm text-[15px]
                        ${msg.sender === SenderType.AGENT 
                            ? 'bg-messenger-blue text-white rounded-br-none' 
                            : 'bg-white text-gray-800 border border-gray-100 rounded-bl-none'}
                    `}>
                        {msg.type === MessageType.DOCUMENT ? (
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-lg ${msg.sender === SenderType.AGENT ? 'bg-blue-500' : 'bg-gray-100'}`}>
                                    <FileText className="w-6 h-6" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-semibold text-sm truncate max-w-[150px]">{msg.fileName}</span>
                                    <span className="text-xs opacity-80">{msg.fileSize}</span>
                                </div>
                                <button className="ml-2 p-1 hover:bg-black/10 rounded">
                                    <Download className="w-4 h-4" />
                                </button>
                            </div>
                        ) : (
                            <p className="whitespace-pre-wrap">{msg.content}</p>
                        )}
                        
                        <span className={`text-[10px] absolute -bottom-5 ${msg.sender === SenderType.AGENT ? 'right-0' : 'left-0'} text-gray-400 w-max`}>
                            {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            {msg.sender === SenderType.AGENT && (msg.read ? ' • Read' : ' • Sent')}
                        </span>
                    </div>
                </div>
               )}
            </div>
          ))}
          {isTyping && (
             <div className="flex justify-start gap-2">
                 <img src={conversation.client.avatar} className="w-8 h-8 rounded-full self-end mb-1" alt="" />
                 <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-none border border-gray-100">
                     <div className="flex gap-1">
                         <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                         <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></span>
                         <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></span>
                     </div>
                 </div>
             </div>
          )}
        </div>
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-gray-200">
        
        {/* Smart Suggestions */}
        {suggestions.length > 0 && (
            <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-hide">
                {suggestions.map((sug, idx) => (
                    <button 
                        key={idx}
                        onClick={() => setInputText(sug)}
                        className="whitespace-nowrap px-3 py-1.5 bg-messenger-blue/5 text-messenger-blue text-xs font-medium rounded-full border border-messenger-blue/20 hover:bg-messenger-blue hover:text-white transition-colors flex items-center gap-1"
                    >
                        <Sparkles className="w-3 h-3" />
                        {sug}
                    </button>
                ))}
            </div>
        )}

        <div className="flex items-end gap-3">
          <div className="flex items-center gap-2 pb-2 text-gray-400">
             <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileUpload} />
            <button className="p-2 hover:bg-gray-100 rounded-full text-messenger-blue transition-colors" onClick={() => fileInputRef.current?.click()}>
                <Paperclip className="w-5 h-5" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors hidden sm:block">
                <Mic className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 bg-gray-100 rounded-[20px] flex items-center px-4 py-2 border border-transparent focus-within:border-messenger-blue/50 focus-within:bg-white focus-within:ring-2 focus-within:ring-messenger-blue/10 transition-all">
            <textarea
              rows={1}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              className="w-full bg-transparent border-none focus:ring-0 resize-none text-sm max-h-32 py-2"
              style={{ minHeight: '24px' }}
            />
            <button className="text-gray-400 hover:text-messenger-blue ml-2">
                <Smile className="w-5 h-5" />
            </button>
          </div>

          <button 
            onClick={handleSend}
            disabled={!inputText.trim()}
            className="p-3 bg-messenger-blue text-white rounded-full hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md transform hover:scale-105"
          >
            <Send className="w-5 h-5 ml-0.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;