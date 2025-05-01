import React, { useState } from 'react';

export default function Widget() {
    const [input, setInput] = useState('');
    const [log, setLog] = useState<string[]>([]);

    async function send() {
        if (!input) return;
        try {
            const r = await fetch('http://localhost:8085/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: input }),
            }).then((r) => r.json());
            setLog((l) => [...l, `You: ${input}`, `Bot: ${r.reply}`]);
            setInput('');
        } catch {
            setLog((l) => [...l, `You: ${input}`, `Bot: error`]);
        }
    }

    return React.createElement("div", { className: "w-80 shadow-xl rounded-2xl p-4 bg-white border fixed bottom-4 right-4 bg-white z-50" },
        React.createElement("h3", { className: "font-bold text-lg mb-2" }, "AI Chat"),
        React.createElement("div", { className: "text-sm h-48 overflow-y-auto mb-2 space-y-1" },
            log.map((m, i) => React.createElement("p", { key: i }, m))
        ),
        React.createElement("div", { className: "flex gap-2" },
            React.createElement("input", {
                className: "flex-1 border rounded px-2 py-1 text-sm",
                value: input,
                onChange: (e) => setInput(e.target.value),
                onKeyDown: (e) => e.key === "Enter" && send(),
                placeholder: "Ask…"
            }),
            React.createElement("button", {
                onClick: send,
                className: "px-3 py-1 text-sm bg-black text-white rounded"
            }, "Send")
        )
    );
}
