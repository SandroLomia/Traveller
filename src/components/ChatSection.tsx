'use client';

import { useChat } from '@ai-sdk/react';
import { Send, User, Bot, MapPin } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface Location {
  name: string;
  lat: number;
  lng: number;
  description?: string;
}

interface ChatSectionProps {
  onAddLocation: (location: Location) => void;
  onInteractionSound?: () => void;
}

export default function ChatSection({ onAddLocation, onInteractionSound }: ChatSectionProps) {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/chat',
    onToolCall({ toolCall }) {
      if (toolCall.toolName === 'add_location') {
        const { name, lat, lng, description } = toolCall.args as Location;
        onAddLocation({ name, lat, lng, description });
      }
    },
  });

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-full bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xl overflow-hidden">
      <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 bg-sky-500 text-white flex items-center gap-2">
        <Bot size={20} />
        <h2 className="font-semibold">Travel Planner AI</h2>
      </div>

      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-4"
      >
        {messages.length === 0 && (
          <div className="text-center py-10 space-y-2">
            <p className="text-zinc-500">Ask me anything about your next trip!</p>
            <div className="flex flex-wrap justify-center gap-2">
              <button
                onClick={() => {
                  onInteractionSound?.();
                  handleInputChange({ target: { value: 'Suggest a 3-day trip to Tokyo' } } as unknown as React.ChangeEvent<HTMLInputElement>);
                }}
                className="text-xs bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 px-3 py-1 rounded-full transition-colors"
              >
                Tokyo trip
              </button>
              <button
                onClick={() => {
                  onInteractionSound?.();
                  handleInputChange({ target: { value: 'What are the best beaches in Italy?' } } as unknown as React.ChangeEvent<HTMLInputElement>);
                }}
                className="text-xs bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 px-3 py-1 rounded-full transition-colors"
              >
                Italy beaches
              </button>
            </div>
          </div>
        )}

        {messages.map((m) => (
          <div
            key={m.id}
            className={cn(
              "flex gap-3 max-w-[85%]",
              m.role === 'user' ? "ml-auto flex-row-reverse" : "mr-auto"
            )}
          >
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
              m.role === 'user' ? "bg-amber-500" : "bg-sky-500"
            )}>
              {m.role === 'user' ? <User size={16} className="text-white" /> : <Bot size={16} className="text-white" />}
            </div>
            <div className={cn(
              "p-3 rounded-2xl text-sm shadow-sm",
              m.role === 'user'
                ? "bg-amber-500 text-white rounded-tr-none"
                : "bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 rounded-tl-none"
            )}>
              {m.content}

              {m.toolInvocations?.map((toolInvocation) => {
                const { toolCallId, toolName, state } = toolInvocation;

                if (toolName === 'add_location' && state === 'result') {
                  const { name } = toolInvocation.result;
                  return (
                    <div key={toolCallId} className="mt-2 flex items-center gap-1 text-xs font-medium text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-900/30 p-2 rounded-lg">
                      <MapPin size={12} />
                      <span>Added {name} to map</span>
                    </div>
                  );
                }
                return null;
              })}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-3 mr-auto">
            <div className="w-8 h-8 rounded-full bg-sky-500 flex items-center justify-center shrink-0 animate-pulse">
              <Bot size={16} className="text-white" />
            </div>
            <div className="p-3 rounded-2xl bg-zinc-100 dark:bg-zinc-800 rounded-tl-none">
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce"></span>
                <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
              </div>
            </div>
          </div>
        )}
      </div>

      <form
        onSubmit={(event) => {
          onInteractionSound?.();
          handleSubmit(event);
        }}
        className="p-4 border-t border-zinc-200 dark:border-zinc-800 flex gap-2"
      >
        <input
          value={input}
          onChange={handleInputChange}
          placeholder="Type your message..."
          className="flex-1 bg-zinc-100 dark:bg-zinc-800 border-none rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-sky-500 outline-none transition-all"
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="bg-sky-500 hover:bg-sky-600 disabled:opacity-50 disabled:hover:bg-sky-500 text-white p-2 rounded-xl transition-colors"
        >
          <Send size={20} />
        </button>
      </form>
    </div>
  );
}
