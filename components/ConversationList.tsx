import React from 'react';
import { Conversation } from '../types';
import { Search, Circle, Clock, CheckCircle2, MessageSquare } from 'lucide-react';

interface Props {
  conversations: Conversation[];
  selectedId: string;
  onSelect: (id: string) => void;
  isOpen: boolean;
}

const ConversationList: React.FC<Props> = ({ conversations, selectedId, onSelect, isOpen }) => {
  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'high': return 'bg-messenger-red';
      case 'medium': return 'bg-messenger-orange';
      case 'low': return 'bg-messenger-green';
      default: return 'bg-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
        case 'active': return <Clock className="w-3 h-3 text-messenger-orange" />;
        case 'completed': return <CheckCircle2 className="w-3 h-3 text-messenger-green" />;
        default: return <MessageSquare className="w-3 h-3 text-blue-400" />;
    }
  };

  return (
    <div className={`
      ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      fixed lg:static inset-y-0 left-0 z-40
      w-80 h-full bg-white border-r border-gray-200 flex flex-col transition-transform duration-300 ease-in-out
    `}>
      {/* Header & Search */}
      <div className="p-4 border-b border-gray-100">
        <h1 className="text-xl font-bold text-gray-800 mb-4">Messages</h1>
        <div className="relative">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search clients..."
            className="w-full bg-gray-100 text-sm text-gray-700 rounded-full pl-9 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-messenger-blue/20 transition-all"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex px-4 py-2 gap-4 text-sm font-medium text-gray-500 border-b border-gray-100">
        <button className="text-messenger-blue border-b-2 border-messenger-blue pb-2">Active</button>
        <button className="hover:text-gray-800 pb-2">Leads</button>
        <button className="hover:text-gray-800 pb-2">Done</button>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto">
        {conversations.map((conv) => (
          <div
            key={conv.id}
            onClick={() => onSelect(conv.id)}
            className={`
              relative p-3 flex items-start gap-3 cursor-pointer hover:bg-gray-50 transition-colors border-l-4
              ${selectedId === conv.id ? 'bg-blue-50/50 border-messenger-blue' : 'border-transparent'}
            `}
          >
            {/* Avatar */}
            <div className="relative">
              <img
                src={conv.client.avatar}
                alt={conv.client.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <span className={`absolute bottom-0 right-0 w-3 h-3 border-2 border-white rounded-full ${conv.status === 'active' ? 'bg-messenger-green' : 'bg-gray-400'}`}></span>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-baseline mb-1">
                <h3 className={`text-sm truncate ${selectedId === conv.id ? 'font-semibold text-gray-900' : 'font-medium text-gray-800'}`}>
                  {conv.client.name}
                </h3>
                <span className="text-xs text-gray-400 whitespace-nowrap">
                    {new Date(conv.lastActive).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <p className={`text-xs truncate mb-1 ${conv.unreadCount > 0 ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
                {conv.messages[conv.messages.length - 1]?.content || 'No messages yet'}
              </p>
              
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${getPriorityColor(conv.priority)}`}></span>
                <div className="flex items-center gap-1 text-[10px] bg-gray-100 px-2 py-0.5 rounded-full text-gray-600">
                    {getStatusIcon(conv.status)}
                    {conv.currentStep}
                </div>
              </div>
            </div>

            {/* Unread Badge */}
            {conv.unreadCount > 0 && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <div className="w-5 h-5 bg-messenger-blue text-white text-[10px] font-bold flex items-center justify-center rounded-full">
                  {conv.unreadCount}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ConversationList;