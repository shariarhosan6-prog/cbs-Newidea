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
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [conversation.messages, conversation.id]);

  useEffect(() => {
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

    const lastMsg = conversation.messages[conversation.messages.length - 1];
    if (lastMsg && lastMsg.sender !== SenderType.AGENT) {
      fetchSuggestions();
    } else {
        setSuggestions([]); 
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
      onSendMessage(`Sent a file: ${file.name}`, MessageType.DOCUMENT, {
        name: file.name,
        size: `${(file.size / 1024 / 1024).toFixed(2)} MB`
      });
    }
  };

  const missingDocsCount = conversation.documents.filter(d => d.status === 'missing' || d.status === 'pending').length;

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50 relative">
      
      {/* Glassmorphism Header */}
      <div className="h-20 absolute top-0 left-0 right-0 glass-panel border-b border-white/20 flex items-center justify-between px-8 z-20 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="relative group cursor-pointer">
            <img src={conversation.client.avatar} alt="Avatar" className="w-11 h-11 rounded-full ring-2 ring-white shadow-md transition-transform group-hover:scale-105" />
             <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
          </div>
          <div>
            <h2 className="font-bold text-slate-800 text-lg leading-tight">{conversation.client.name}</h2>
            <p className="text-xs font-medium text-slate-500 tracking-wide">{conversation.client.qualificationTarget}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="p-2.5 bg-white text-slate-400 hover:text-messenger-blue hover:bg-blue-50 hover:shadow-md rounded-full transition-all border border-slate-100">
            <Phone className="w-5 h-5" />
          </button>
          <button className="p-2.5 bg-white text-slate-400 hover:text-messenger-blue hover:bg-blue-50 hover:shadow-md rounded-full transition-all border border-slate-100">
            <Video className="w-5 h-5" />
          </button>
          <button 
            className="p-2.5 bg-white text-slate-400 hover:text-messenger-blue hover:bg-blue-50 hover:shadow-md rounded-full transition-all border border-slate-100 lg:hidden"
            onClick={onToggleInfo}
          >
            <Info className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Spacer for Header */}
      <div className="h-20 shrink-0"></div>

      {/* AI Context Bar */}
      {missingDocsCount > 0 && (
        <div className="mx-6 mt-4 bg-white/60 backdrop-blur-sm border border-messenger-purple/20 rounded-xl px-4 py-3 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2.5 text-sm font-medium text-slate-700">
                <div className="p-1.5 bg-messenger-purple/10 rounded-lg text-messenger-purple">
                  <Sparkles className="w-4 h-4" />
                </div>
                <span><span className="text-messenger-purple font-bold">AI Insight:</span> {missingDocsCount} documents needed.</span>
            </div>
            <button 
                onClick={() => onSendMessage("Hi, just following up on the remaining documents needed for your assessment. Could you please upload them when ready?", MessageType.TEXT)}
                className="text-xs font-semibold bg-messenger-purple text-white px-3 py-1.5 rounded-lg hover:bg-violet-600 hover:shadow-lg hover:shadow-violet-200 transition-all">
                Auto-Request
            </button>
        </div>
      )}

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-8" ref={scrollRef}>
          {conversation.messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex w-full ${msg.sender === SenderType.AGENT ? 'justify-end' : 'justify-start'}`}
            >
               {msg.sender === SenderType.SYSTEM ? (
                   <div className="w-full flex justify-center my-4">
                       <span className="text-[11px] font-semibold text-slate-500 bg-slate-200/50 backdrop-blur-md px-4 py-1 rounded-full uppercase tracking-wider border border-white/50">
                           {msg.content}
                       </span>
                   </div>
               ) : (
                <div className={`flex max-w-[80%] md:max-w-[70%] ${msg.sender === SenderType.AGENT ? 'flex-row-reverse' : 'flex-row'} gap-3 group`}>
                    {msg.sender !== SenderType.AGENT && (
                        <img src={conversation.client.avatar} className="w-8 h-8 rounded-full self-end mb-4 shadow-sm" alt="" />
                    )}
                    
                    <div className="flex flex-col gap-1">
                      <div className={`
                          relative px-5 py-3.5 shadow-sm text-[15px] leading-relaxed
                          ${msg.sender === SenderType.AGENT 
                              ? 'bg-gradient-to-tr from-messenger-blue to-blue-500 text-white rounded-2xl rounded-tr-sm shadow-blue-200' 
                              : 'bg-white text-slate-700 rounded-2xl rounded-tl-sm border border-slate-100'}
                      `}>
                          {msg.type === MessageType.DOCUMENT ? (
                              <div className="flex items-center gap-3 min-w-[200px]">
                                  <div className={`p-2.5 rounded-xl ${msg.sender === SenderType.AGENT ? 'bg-white/20' : 'bg-slate-100 text-messenger-blue'}`}>
                                      <FileText className="w-6 h-6" />
                                  </div>
                                  <div className="flex flex-col">
                                      <span className="font-semibold text-sm truncate max-w-[150px]">{msg.fileName}</span>
                                      <span className={`text-xs ${msg.sender === SenderType.AGENT ? 'text-blue-100' : 'text-slate-400'}`}>{msg.fileSize}</span>
                                  </div>
                                  <button className={`ml-auto p-1.5 rounded-lg transition-colors ${msg.sender === SenderType.AGENT ? 'hover:bg-white/20' : 'hover:bg-slate-100'}`}>
                                      <Download className="w-4 h-4" />
                                  </button>
                              </div>
                          ) : (
                              <p className="whitespace-pre-wrap">{msg.content}</p>
                          )}
                      </div>
                      <span className={`text-[10px] font-medium text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity ${msg.sender === SenderType.AGENT ? 'text-right' : 'text-left'}`}>
                            {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            {msg.sender === SenderType.AGENT && (msg.read ? ' • Read' : ' • Sent')}
                      </span>
                    </div>
                </div>
               )}
            </div>
          ))}
          {isTyping && (
             <div className="flex justify-start gap-3">
                 <img src={conversation.client.avatar} className="w-8 h-8 rounded-full self-end mb-4" alt="" />
                 <div className="bg-white px-5 py-4 rounded-2xl rounded-tl-sm border border-slate-100 shadow-sm">
                     <div className="flex gap-1.5">
                         <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce"></span>
                         <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce delay-100"></span>
                         <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce delay-200"></span>
                     </div>
                 </div>
             </div>
          )}
      </div>

      {/* Input Area */}
      <div className="p-6 bg-white/80 backdrop-blur-md border-t border-slate-100 z-20">
        
        {/* Smart Suggestions */}
        {suggestions.length > 0 && (
            <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
                {suggestions.map((sug, idx) => (
                    <button 
                        key={idx}
                        onClick={() => setInputText(sug)}
                        className="whitespace-nowrap px-4 py-2 bg-white text-messenger-blue text-xs font-semibold rounded-xl border border-blue-100 shadow-sm hover:shadow-md hover:bg-messenger-blue hover:text-white transition-all flex items-center gap-1.5 transform hover:-translate-y-0.5"
                    >
                        <Sparkles className="w-3.5 h-3.5" />
                        {sug}
                    </button>
                ))}
            </div>
        )}

        <div className="flex items-end gap-3 max-w-4xl mx-auto">
          <div className="flex items-center gap-1 pb-2.5">
             <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileUpload} />
            <button className="p-2.5 text-slate-400 hover:bg-slate-100 hover:text-messenger-blue rounded-xl transition-all" onClick={() => fileInputRef.current?.click()}>
                <Paperclip className="w-5 h-5" />
            </button>
            <button className="p-2.5 text-slate-400 hover:bg-slate-100 hover:text-messenger-blue rounded-xl transition-all hidden sm:block">
                <Mic className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 bg-slate-100 rounded-[24px] flex items-center px-2 py-2 border-2 border-transparent focus-within:border-messenger-blue/30 focus-within:bg-white focus-within:shadow-soft transition-all">
            <textarea
              rows={1}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              className="w-full bg-transparent border-none focus:ring-0 resize-none text-sm text-slate-800 placeholder:text-slate-400 max-h-32 px-4 py-2"
              style={{ minHeight: '24px' }}
            />
            <button className="text-slate-400 hover:text-messenger-blue p-2 rounded-full hover:bg-slate-50 transition-colors">
                <Smile className="w-5 h-5" />
            </button>
          </div>

          <button 
            onClick={handleSend}
            disabled={!inputText.trim()}
            className="p-3.5 bg-messenger-blue text-white rounded-2xl hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-200 transform hover:scale-105 active:scale-95"
          >
            <Send className="w-5 h-5 ml-0.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;