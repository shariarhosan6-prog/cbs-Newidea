import React, { useState, useEffect } from 'react';
import ConversationList from './components/ConversationList';
import ChatWindow from './components/ChatWindow';
import ClientIntelligence from './components/ClientIntelligence';
import { MOCK_CONVERSATIONS } from './constants';
import { Conversation, MessageType, SenderType } from './types';
import { Menu, X } from 'lucide-react';
import { analyzeDocumentMock } from './services/geminiService';

function App() {
  const [conversations, setConversations] = useState<Conversation[]>(MOCK_CONVERSATIONS);
  const [selectedId, setSelectedId] = useState<string>(MOCK_CONVERSATIONS[0].id);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [rightPanelOpen, setRightPanelOpen] = useState(false); // Hidden by default on mobile/tablet

  // Get selected conversation object
  const selectedConversation = conversations.find(c => c.id === selectedId) || conversations[0];

  const handleSendMessage = async (text: string, type: MessageType = MessageType.TEXT, fileData?: { name: string, size: string }) => {
    // 1. Add User Message
    const newMessage = {
      id: Date.now().toString(),
      sender: SenderType.AGENT,
      type: type,
      content: text,
      timestamp: new Date(),
      read: false,
      fileName: fileData?.name,
      fileSize: fileData?.size
    };

    setConversations(prev => prev.map(c => {
      if (c.id === selectedId) {
        return {
          ...c,
          messages: [...c.messages, newMessage],
          lastActive: new Date(),
        };
      }
      return c;
    }));

    // 2. Simulate Client Reply (or AI processing of file)
    setTimeout(async () => {
       if (type === MessageType.DOCUMENT && fileData) {
            // AI Analysis Simulation
            const analysis = await analyzeDocumentMock(fileData.name);
            
            const systemMsg = {
                id: (Date.now() + 1).toString(),
                sender: SenderType.SYSTEM,
                type: MessageType.SYSTEM,
                content: `AI Analysis: Identified as ${analysis.type} (${analysis.confidence}% confidence).`,
                timestamp: new Date()
            };
            
            setConversations(prev => prev.map(c => {
                if(c.id === selectedId) {
                    return {
                        ...c,
                        messages: [...c.messages, systemMsg],
                        // Update document status if it matched
                        documents: c.documents.map(d => 
                           d.status === 'missing' && analysis.type.toLowerCase().includes(d.name.toLowerCase().split(' ')[0]) 
                           ? { ...d, status: 'verified', confidence: analysis.confidence }
                           : d
                        )
                    }
                }
                return c;
            }));

       } else {
           // Simple text reply mock
            const replyMsg = {
                id: (Date.now() + 1).toString(),
                sender: SenderType.CLIENT,
                type: MessageType.TEXT,
                content: "Thanks for the update. I'll get on that right away.",
                timestamp: new Date(),
                read: true
            };
            setConversations(prev => prev.map(c => {
                if (c.id === selectedId) {
                    return { ...c, messages: [...c.messages, replyMsg] };
                }
                return c;
            }));
       }
    }, 2000);
  };

  return (
    <div className="flex h-screen bg-white overflow-hidden relative">
      
      {/* Mobile Menu Button */}
      <button 
        className="lg:hidden absolute top-4 left-4 z-50 p-2 bg-white rounded-full shadow-md text-messenger-blue"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      >
        {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Left Sidebar - Conversation List */}
      <ConversationList 
        conversations={conversations} 
        selectedId={selectedId} 
        onSelect={(id) => {
          setSelectedId(id);
          setMobileMenuOpen(false);
        }}
        isOpen={mobileMenuOpen}
      />

      {/* Main Chat Area */}
      <ChatWindow 
        conversation={selectedConversation} 
        onSendMessage={handleSendMessage}
        onToggleInfo={() => setRightPanelOpen(!rightPanelOpen)}
      />

      {/* Right Sidebar - Intelligence Panel */}
      {/* Hidden on mobile unless toggled, Always visible on XL screens unless manually toggled (simplified for this demo) */}
      <div className={`
         fixed inset-0 z-30 bg-black/20 lg:hidden transition-opacity
         ${rightPanelOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}
      `} onClick={() => setRightPanelOpen(false)}></div>

      <div className={`hidden lg:block h-full relative`}>
         <ClientIntelligence conversation={selectedConversation} isOpen={true} />
      </div>
      
      {/* Mobile/Tablet Drawer for Right Panel */}
      <div className="lg:hidden">
         <ClientIntelligence conversation={selectedConversation} isOpen={rightPanelOpen} />
      </div>

    </div>
  );
}

export default App;