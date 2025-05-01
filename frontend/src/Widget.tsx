import ReactDOM from 'react-dom/client';
import React, { useState } from 'react';
import ChatBubble from './ChatBubble';

function Widget(props: { apiBase: string }) {
    const [open, setOpen] = useState(false);
    const [input, setInput] = useState('');
    const [log, setLog] = useState<{ from: 'user' | 'bot'; text: string }[]>([]);

    const toggle = () => setOpen(!open);

    async function send() {
        if (!input.trim()) return;

     const userMessage = { from: 'user', text: input };
        /* @ts-ignore */
       setLog((prev) => [...prev, userMessage]);

        try {
            const res = await fetch(`${props.apiBase}/api/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: input }),
            }).then(r => r.json());

            setLog((prev) => [...prev, { from: 'bot', text: res.reply }]);
        } catch {
            setLog((prev) => [...prev, { from: 'bot', text: '⚠️ Error occurred' }]);
        }

        setInput('');
    }

    return (
        <>
            {/* FAB-кнопка */}
            <button
                onClick={toggle}
                className="fixed bottom-4 right-4 z-50 w-14 h-14 rounded-full bg-black text-white shadow-lg flex items-center justify-center text-2xl hover:bg-gray-800 transition"
            >
                💬
            </button>

            {/* Панель чата */}
            <div className={`fixed bottom-20 right-4 w-96 max-w-[95vw] transition-all duration-300 shadow-xl rounded-xl border bg-white overflow-hidden flex flex-col z-50
        ${open ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-4 pointer-events-none'}
      `}>
                <div className="bg-black text-white px-4 py-2 font-bold">AI Chat</div>
                <div className="p-3 h-72 overflow-y-auto space-y-2 text-sm bg-white">
                    {log.map((msg, i) => (
                        <ChatBubble key={i} from={msg.from} text={msg.text} />
                    ))}
                </div>
                <div className="flex border-t px-3 py-2 bg-white gap-2">
                    <input
                        className="flex-1 border rounded px-2 py-1 text-sm"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && send()}
                        placeholder="Type your message..."
                    />
                    <button onClick={send} className="bg-black text-white rounded px-3 py-1 text-sm hover:bg-gray-800 transition">Send</button>
                </div>
            </div>
        </>
    );
}

declare global {
    interface Window {
        AiWidget: {
            mount: (target: HTMLElement, props: { apiBase: string }) => void;
        };
    }
}

if (typeof window !== 'undefined') {
    console.log('Шлюза!')
    window.AiWidget = {
        mount(target, props) {
            console.log('mount')
            const root = ReactDOM.createRoot(target);
            root.render(React.createElement(Widget, props));
        }
    };

    console.log(    window.AiWidget)
}