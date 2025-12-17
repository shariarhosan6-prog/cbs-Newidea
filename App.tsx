import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Kanban from './components/Kanban';
import ConversationList from './components/ConversationList';
import ChatWindow from './components/ChatWindow';
import ClientIntelligence from './components/ClientIntelligence';
import { MOCK_CONVERSATIONS } from './constants';
import { Conversation, MessageType, SenderType, MessageThread, ViewState } from './types';
import { Menu, X } from 'lucide-react';
import { analyzeDocumentMock } from './services/geminiService';

function App() {
  const [currentView, setCurrentView] = useState<ViewState>('dashboard');
  
  // Chat State
  const [conversations, setConversations] = useState<Conversation[]>(MOCK_CONVERSATIONS);
  const [selectedId, setSelectedId] = useState<string>(MOCK_CONVERSATIONS[0].id);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Panel States
  const [rightPanelOpen, setRightPanelOpen] = useState(true); // Default open for visibility

  // Get selected conversation object
  const selectedConversation = conversations.find(c => c.id === selectedId) || conversations[0];
  const unreadCount = conversations.reduce((acc, curr) => acc + curr.unreadCount, 0);

  const handleSendMessage = async (text: string, type: MessageType = MessageType.TEXT, fileData?: { name: string, size: string }, thread: MessageThread = 'source') => {
    // 1. Add User Message
    const newMessage = {
      id: Date.now().toString(),
      sender: SenderType.AGENT,
      type: type,
      content: text,
      timestamp: new Date(),
      read: false,
      fileName: fileData?.name,
      fileSize: fileData?.size,
      thread: thread
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

    // 2. Simulate Reply
    setTimeout(async () => {
       if (thread === 'source') {
           if (type === MessageType.DOCUMENT && fileData) {
                const analysis = await analyzeDocumentMock(fileData.name);
                const systemMsg = {
                    id: (Date.now() + 1).toString(),
                    sender: SenderType.SYSTEM,
                    type: MessageType.SYSTEM,
                    content: `AI Analysis: Identified as ${analysis.type} (${analysis.confidence}% confidence).`,
                    timestamp: new Date(),
                    thread: 'source' as MessageThread
                };
                setConversations(prev => prev.map(c => {
                    if(c.id === selectedId) {
                        return {
                            ...c,
                            messages: [...c.messages, systemMsg],
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
                const replyMsg = {
                    id: (Date.now() + 1).toString(),
                    sender: SenderType.CLIENT,
                    type: MessageType.TEXT,
                    content: "Thanks for the update. I'll get on that right away.",
                    timestamp: new Date(),
                    read: true,
                    thread: 'source' as MessageThread
                };
                setConversations(prev => prev.map(c => {
                    if (c.id === selectedId) {
                        return { ...c, messages: [...c.messages, replyMsg] };
                    }
                    return c;
                }));
           }
       } else if (thread === 'upstream') {
            const replyMsg = {
                id: (Date.now() + 1).toString(),
                sender: SenderType.SUPER_AGENT,
                type: MessageType.TEXT,
                content: "Acknowledged. We have updated the file status on our end.",
                timestamp: new Date(),
                read: true,
                thread: 'upstream' as MessageThread
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

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'pipeline':
        return <Kanban />;
      case 'inbox':
        return (
          <div className="flex h-full w-full overflow-hidden relative">
             {/* Mobile Toggle */}
            <button 
                className="lg:hidden absolute top-4 left-4 z-50 p-2 bg-white rounded-full shadow-md text-messenger-blue"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Conversation List (Fixed Width) */}
            <div className="hidden lg:block h-full">
                <ConversationList 
                    conversations={conversations} 
                    selectedId={selectedId} 
                    onSelect={(id) => { setSelectedId(id); }}
                    isOpen={true} // Always open on desktop
                />
            </div>

            {/* Mobile Conversation Drawer */}
             <div className={`lg:hidden fixed inset-y-0 left-0 z-40 transition-transform duration-300 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <ConversationList 
                    conversations={conversations} 
                    selectedId={selectedId} 
                    onSelect={(id) => { setSelectedId(id); setMobileMenuOpen(false); }}
                    isOpen={true}
                />
             </div>
             {mobileMenuOpen && <div className="lg:hidden fixed inset-0 bg-black/50 z-30" onClick={() => setMobileMenuOpen(false)}></div>}

            {/* Chat Area (Flexible) */}
            <div className="flex-1 flex flex-col h-full relative overflow-hidden min-w-0">
                 <ChatWindow 
                    key={selectedConversation.id} 
                    conversation={selectedConversation} 
                    onSendMessage={handleSendMessage}
                    onToggleInfo={() => setRightPanelOpen(!rightPanelOpen)}
                    isInfoOpen={rightPanelOpen}
                />
            </div>

            {/* Right Intelligence Panel (Toggleable on Desktop, Drawer on Mobile) */}
            <div className={`
                absolute lg:static inset-y-0 right-0 z-30 w-full sm:w-96 bg-white border-l border-slate-200 shadow-2xl lg:shadow-none
                transition-all duration-300 ease-in-out transform
                ${rightPanelOpen ? 'translate-x-0' : 'translate-x-full lg:hidden'}
            `}>
                <div className="h-full relative">
                    {/* Mobile Close Button for Right Panel */}
                    <button 
                        onClick={() => setRightPanelOpen(false)}
                        className="lg:hidden absolute top-4 right-4 p-2 bg-slate-100 rounded-full z-50"
                    >
                        <X className="w-5 h-5 text-slate-500" />
                    </button>
                    <ClientIntelligence conversation={selectedConversation} isOpen={true} />
                </div>
            </div>
            
          </div>
        );
      case 'partners':
      case 'finance':
        return (
            <div className="flex-1 flex items-center justify-center bg-slate-50 text-slate-400">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-slate-600 mb-2">Module Coming Soon</h2>
                    <p>This module is currently under development.</p>
                </div>
            </div>
        )
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      {/* Global Sidebar (The OS Layer) */}
      <div className="hidden lg:block h-full">
        <Sidebar 
            currentView={currentView} 
            onChangeView={setCurrentView} 
            unreadCount={unreadCount} 
        />
      </div>

      {/* Mobile Nav Header */}
      <div className="lg:hidden absolute top-0 left-0 right-0 h-16 bg-slate-900 text-white flex items-center px-4 justify-between z-50">
           <span className="font-bold">Stitch OS</span>
           <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
             <Menu className="w-6 h-6" />
           </button>
      </div>

       {/* Mobile Sidebar Overlay */}
       {mobileMenuOpen && (
           <div className="fixed inset-0 z-[60] lg:hidden flex">
               <Sidebar currentView={currentView} onChangeView={(v) => { setCurrentView(v); setMobileMenuOpen(false); }} unreadCount={unreadCount} />
               <div className="flex-1 bg-black/50" onClick={() => setMobileMenuOpen(false)}></div>
           </div>
       )}

      {/* Main Content Area */}
      <main className="flex-1 h-full relative overflow-hidden flex flex-col pt-16 lg:pt-0">
         {renderContent()}
      </main>
    </div>
  );
}

export default App;