import React, { useState, useEffect, useRef } from 'react';
import { Conversation, Message, MessageType, SenderType, MessageThread } from '../types';
import { Phone, Video, Info, Paperclip, Mic, Smile, Send, Sparkles, FileText, Download, Building2, User, Globe, Briefcase, ArrowRight } from 'lucide-react';
import { getSmartSuggestions } from '../services/geminiService';

interface Props {
  conversation: Conversation;
  onSendMessage: (text: string, type?: MessageType, fileData?: { name: string, size: string }, thread?: MessageThread) => void;
  onToggleInfo: () => void;
}

const ChatWindow: React.FC<Props> = ({ conversation, onSendMessage, onToggleInfo }) => {
  const [inputText, setInputText] = useState('');
  const [activeThread, setActiveThread] = useState<MessageThread>('source'); // 'source' or 'upstream'
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  // Filter messages based on active thread
  const activeMessages = conversation.messages.filter(m => {
    // Legacy support: if no thread defined, assume 'source'
    const msgThread = m.thread || 'source';
    return msgThread === activeThread;
  });

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [activeMessages.length, activeThread, conversation.id]);

  useEffect(() => {
    // Only generate suggestions for Client thread for now
    if (activeThread === 'source') {
        const fetchSuggestions = async () => {
        setLoadingSuggestions(true);
        const newSuggestions = await getSmartSuggestions(
            activeMessages,
            conversation.client.name,
            conversation.client.qualificationTarget
        );
        setSuggestions(newSuggestions);
        setLoadingSuggestions(false);
        };

        const lastMsg = activeMessages[activeMessages.length - 1];
        if (lastMsg && lastMsg.sender !== SenderType.AGENT) {
            fetchSuggestions();
        } else {
            setSuggestions([]); 
        }
    } else {
        setSuggestions([]);
    }
  }, [activeMessages.length, conversation.id, activeThread]);

  const handleSend = () => {
    if (!inputText.trim()) return;
    onSendMessage(inputText, MessageType.TEXT, undefined, activeThread);
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
      onSendMessage(
        `Sent a file: ${file.name}`, 
        MessageType.DOCUMENT, 
        { name: file.name, size: `${(file.size / 1024 / 1024).toFixed(2)} MB` },
        activeThread
      );
    }
  };

  const missingDocsCount = conversation.documents.filter(d => d.status === 'missing' || d.status === 'pending').length;

  // Theme configuration based on active thread
  const theme = activeThread === 'source' 
    ? {
        primary: 'bg-messenger-blue',
        gradient: 'from-messenger-blue to-blue-500',
        light: 'bg-blue-50',
        text: 'text-messenger-blue',
        border: 'border-blue-200'
      }
    : {
        primary: 'bg-indigo-600',
        gradient: 'from-indigo-600 to-purple-600',
        light: 'bg-indigo-50',
        text: 'text-indigo-600',
        border: 'border-indigo-200'
      };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50 relative">
      
      {/* Header Container */}
      <div className="absolute top-0 left-0 right-0 z-20 flex flex-col bg-white/90 backdrop-blur-xl shadow-sm border-b border-white/20">
        
        {/* Top Bar: Profile & Tools */}
        <div className="h-16 flex items-center justify-between px-6 pt-2">
            <div className="flex items-center gap-4">
                <div className="relative group cursor-pointer">
                    <img src={conversation.client.avatar} alt="Avatar" className="w-10 h-10 rounded-full ring-2 ring-white shadow-md transition-transform group-hover:scale-105 object-cover" />
                    <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></div>
                </div>
                <div>
                    <h2 className="font-bold text-slate-800 text-base leading-tight">{conversation.client.name}</h2>
                    <p className="text-[11px] font-medium text-slate-500 tracking-wide">{conversation.client.qualificationTarget}</p>
                </div>
            </div>

            <div className="flex items-center gap-2">
                <button 
                    className="p-2.5 bg-white text-slate-400 hover:text-messenger-blue hover:bg-blue-50 hover:shadow-md rounded-full transition-all border border-slate-100 lg:hidden"
                    onClick={onToggleInfo}
                >
                    <Info className="w-5 h-5" />
                </button>
            </div>
        </div>

        {/* Channel Switcher (The key feature) */}
        <div className="px-6 pb-4">
            <div className="bg-slate-100 p-1.5 rounded-xl flex relative border border-slate-200/50">
                {/* Animated Background Pill */}
                <div 
                    className={`absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-white rounded-lg shadow-[0_2px_8px_rgba(0,0,0,0.08)] transition-all duration-300 ease-out
                    ${activeThread === 'source' ? 'left-1.5' : 'left-[calc(50%+3px)] translate-x-0'}
                    `}
                ></div>

                <button 
                    onClick={() => setActiveThread('source')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold relative z-10 transition-colors duration-300
                    ${activeThread === 'source' ? 'text-slate-800' : 'text-slate-500 hover:text-slate-700'}
                    `}
                >
                    {conversation.source === 'sub_agent' ? <Building2 className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
                    {conversation.source === 'sub_agent' ? 'Sub-Agent' : 'Student'}
                    {conversation.unreadCount > 0 && activeThread !== 'source' && (
                        <span className="w-2 h-2 bg-messenger-blue rounded-full absolute top-1 right-3 ring-2 ring-slate-100"></span>
                    )}
                </button>

                <button 
                    onClick={() => setActiveThread('upstream')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold relative z-10 transition-colors duration-300
                    ${activeThread === 'upstream' ? 'text-indigo-700' : 'text-slate-500 hover:text-slate-700'}
                    `}
                >
                    <Briefcase className="w-3.5 h-3.5" />
                    Super Agent
                    {activeThread !== 'upstream' && conversation.superAgentStatus === 'submitted' && (
                         <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse absolute top-1 right-3 ring-2 ring-slate-100"></span>
                    )}
                </button>
            </div>
        </div>
      </div>

      {/* Spacer for Double Header */}
      <div className="h-[136px] shrink-0"></div>

      {/* AI Context Bar (Only for Source/Student Thread) */}
      {activeThread === 'source' && missingDocsCount > 0 && (
        <div className="mx-6 mt-4 bg-white/60 backdrop-blur-sm border border-messenger-purple/20 rounded-xl px-4 py-3 flex items-center justify-between shadow-sm animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center gap-2.5 text-sm font-medium text-slate-700">
                <div className="p-1.5 bg-messenger-purple/10 rounded-lg text-messenger-purple">
                  <Sparkles className="w-4 h-4" />
                </div>
                <span><span className="text-messenger-purple font-bold">AI Insight:</span> {missingDocsCount} documents needed.</span>
            </div>
            <button 
                onClick={() => onSendMessage("Hi, just following up on the remaining documents needed for your assessment. Could you please upload them when ready?", MessageType.TEXT, undefined, 'source')}
                className="text-xs font-semibold bg-messenger-purple text-white px-3 py-1.5 rounded-lg hover:bg-violet-600 hover:shadow-lg hover:shadow-violet-200 transition-all">
                Auto-Request
            </button>
        </div>
      )}

      {/* Super Agent Context Bar */}
      {activeThread === 'upstream' && (
         <div className="mx-6 mt-4 bg-indigo-50/80 backdrop-blur-sm border border-indigo-200 rounded-xl px-4 py-3 flex items-center justify-between shadow-sm animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center gap-2.5 text-sm font-medium text-indigo-900">
                <div className="p-1.5 bg-indigo-100 rounded-lg text-indigo-600">
                  <Globe className="w-4 h-4" />
                </div>
                <span><span className="text-indigo-700 font-bold">Upstream Status:</span> {conversation.superAgentStatus.replace('_', ' ').toUpperCase()}</span>
            </div>
            <div className="text-xs text-indigo-500 font-mono bg-white/50 px-2 py-1 rounded">ID: #SA-{conversation.id.substring(0,4)}...</div>
        </div>
      )}

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-8 scroll-smooth" ref={scrollRef}>
          {activeMessages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-4 animate-in fade-in zoom-in-95 duration-500">
                  <div className={`p-6 rounded-3xl ${theme.light} ${theme.text} shadow-inner`}>
                     {activeThread === 'source' ? <User className="w-10 h-10" /> : <Briefcase className="w-10 h-10" />}
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-slate-600 mb-1">
                        {activeThread === 'source' ? `Chat with ${conversation.client.name}` : 'Connect with Super Agent'}
                    </p>
                    <p className="text-xs text-slate-400 max-w-[200px] mx-auto">
                        {activeThread === 'source' 
                            ? 'Review documents and prepare for submission.' 
                            : 'Push validated files to the upstream RTO for processing.'}
                    </p>
                  </div>
                  {activeThread === 'upstream' && (
                       <button className="text-xs font-bold text-indigo-600 bg-indigo-50 px-4 py-2 rounded-full border border-indigo-100 hover:bg-indigo-100 transition-colors flex items-center gap-2">
                           Initiate Handoff <ArrowRight className="w-3 h-3" />
                       </button>
                  )}
              </div>
          )}

          {activeMessages.map((msg) => (
            <div
              key={msg.id}
              className={`flex w-full ${msg.sender === SenderType.AGENT ? 'justify-end' : 'justify-start'}`}
            >
               {msg.sender === SenderType.SYSTEM ? (
                   <div className="w-full flex justify-center my-4">
                       <span className="text-[10px] font-bold text-slate-500 bg-slate-100/80 backdrop-blur-sm px-4 py-1.5 rounded-full uppercase tracking-wider border border-white shadow-sm">
                           {msg.content}
                       </span>
                   </div>
               ) : (
                <div className={`flex max-w-[80%] md:max-w-[70%] ${msg.sender === SenderType.AGENT ? 'flex-row-reverse' : 'flex-row'} gap-3 group`}>
                    {/* Avatar Logic */}
                    {msg.sender !== SenderType.AGENT && (
                        <div className="self-end mb-4">
                            {msg.sender === SenderType.SUPER_AGENT ? (
                                <div className="w-8 h-8 rounded-full bg-indigo-100 border-2 border-white flex items-center justify-center text-indigo-600 shadow-md">
                                    <Briefcase className="w-4 h-4" />
                                </div>
                            ) : (
                                <img src={conversation.client.avatar} className="w-8 h-8 rounded-full shadow-md border-2 border-white" alt="" />
                            )}
                        </div>
                    )}
                    
                    <div className="flex flex-col gap-1">
                        {/* Sender Name for Upstream */}
                        {activeThread === 'upstream' && msg.sender !== SenderType.AGENT && (
                            <span className="text-[10px] text-indigo-500 font-bold ml-1">StudyPath RTO</span>
                        )}

                      <div className={`
                          relative px-5 py-3.5 shadow-sm text-[15px] leading-relaxed
                          ${msg.sender === SenderType.AGENT 
                              ? `bg-gradient-to-tr ${theme.gradient} text-white rounded-2xl rounded-tr-sm shadow-blue-200` 
                              : msg.sender === SenderType.SUPER_AGENT 
                                ? 'bg-indigo-50/80 text-indigo-900 border border-indigo-100 rounded-2xl rounded-tl-sm' 
                                : 'bg-white text-slate-700 rounded-2xl rounded-tl-sm border border-slate-100'}
                      `}>
                          {msg.type === MessageType.DOCUMENT ? (
                              <div className="flex items-center gap-3 min-w-[200px]">
                                  <div className={`p-2.5 rounded-xl ${msg.sender === SenderType.AGENT ? 'bg-white/20' : `${theme.light} ${theme.text}`}`}>
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
      </div>

      {/* Input Area */}
      <div className={`p-6 bg-white/80 backdrop-blur-md border-t z-20 transition-colors duration-300 ${activeThread === 'upstream' ? 'border-indigo-100 bg-indigo-50/30' : 'border-slate-100'}`}>
        
        {/* Smart Suggestions (Only Source) */}
        {suggestions.length > 0 && activeThread === 'source' && (
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
            <button className={`p-2.5 text-slate-400 hover:bg-white hover:shadow-sm rounded-xl transition-all ${activeThread === 'upstream' ? 'hover:text-indigo-600' : 'hover:text-messenger-blue'}`} onClick={() => fileInputRef.current?.click()}>
                <Paperclip className="w-5 h-5" />
            </button>
            <button className={`p-2.5 text-slate-400 hover:bg-white hover:shadow-sm rounded-xl transition-all hidden sm:block ${activeThread === 'upstream' ? 'hover:text-indigo-600' : 'hover:text-messenger-blue'}`}>
                <Mic className="w-5 h-5" />
            </button>
          </div>

          <div className={`flex-1 bg-white rounded-[24px] flex items-center px-2 py-2 border-2 border-transparent focus-within:shadow-soft transition-all
              ${activeThread === 'upstream' ? 'focus-within:border-indigo-200' : 'focus-within:border-messenger-blue/30'}
          `}>
            <textarea
              rows={1}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`Message ${activeThread === 'source' ? (conversation.source === 'sub_agent' ? conversation.subAgentName : conversation.client.name.split(' ')[0]) : 'Super Agent'}...`}
              className="w-full bg-transparent border-none focus:ring-0 resize-none text-sm text-slate-800 placeholder:text-slate-400 max-h-32 px-4 py-2"
              style={{ minHeight: '24px' }}
            />
            <button className={`text-slate-400 p-2 rounded-full hover:bg-slate-50 transition-colors ${activeThread === 'upstream' ? 'hover:text-indigo-600' : 'hover:text-messenger-blue'}`}>
                <Smile className="w-5 h-5" />
            </button>
          </div>

          <button 
            onClick={handleSend}
            disabled={!inputText.trim()}
            className={`p-3.5 text-white rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg transform hover:scale-105 active:scale-95
                ${activeThread === 'upstream' 
                    ? 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200' 
                    : 'bg-messenger-blue hover:bg-blue-600 shadow-blue-200'}
            `}
          >
            <Send className="w-5 h-5 ml-0.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;