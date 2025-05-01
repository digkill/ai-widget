export default function ChatBubble({ from, text }: { from: 'user' | 'bot'; text: string }) {
    const isUser = from === 'user';
    return (
        <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
            <div className={`px-3 py-2 rounded-lg max-w-xs break-words ${
                isUser ? 'bg-black text-white' : 'bg-gray-200 text-black'
            }`}>
                {text}
            </div>
        </div>
    );
}
