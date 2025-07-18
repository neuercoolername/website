'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { toggleExpanded, addPersonalFragment } from '@/store/slices/consoleSlice';

export default function Console() {
  const dispatch = useAppDispatch();
  const { messages, isExpanded, isVisible } = useAppSelector(state => state.console);

  useEffect(() => {
    // Add random personal fragments periodically
    const interval = setInterval(() => {
      if (Math.random() < 0.3) { // 30% chance every interval
        dispatch(addPersonalFragment());
      }
    }, 45000); // Every 45 seconds

    return () => clearInterval(interval);
  }, [dispatch]);

  if (!isVisible) return null;

  return (
    <div className={`
      w-full transition-all duration-300 border-t border-white/40
      ${isExpanded ? 'h-64' : 'h-12'}
    `}>
      {/* Header */}
      <div 
        className="h-12 px-4 flex items-center justify-between cursor-pointer hover:bg-white/50"
        onClick={() => dispatch(toggleExpanded())}
      >
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="text-sm font-medium text-gray-700">Console</span>
          <span className="text-xs text-gray-500">({messages.length})</span>
        </div>
        <div className={`text-gray-500 transition-transform ${
          isExpanded ? 'rotate-180' : ''
        }`}>
          ▼
        </div>
      </div>

      {/* Messages */}
      {isExpanded && (
        <div className="h-52 overflow-y-auto px-4 pb-4">
          <div className="space-y-1 text-xs font-mono">
            {messages.slice(-20).map((message) => (
              <div
                key={message.id}
                className={`${
                  message.type === 'system' ? 'text-blue-600' :
                  message.type === 'personal' ? 'text-purple-600 italic' :
                  'text-gray-600'
                }`}
              >
                <span className="text-gray-400">
                  {new Date(message.timestamp).toLocaleTimeString('en-US', {
                    hour12: false,
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                  })}
                </span>
                {' '}
                {message.content}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}