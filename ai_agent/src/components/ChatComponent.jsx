import { useState, useEffect, useRef } from "react";

export const ChatBox = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const socketRef = useRef(null);

    useEffect(() => {
        const ws = new WebSocket("ws://localhost:8000/ws/chat/");
        socketRef.current = ws;

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            setMessages((prev) => [...prev, { sender: "bot", text: data.response }]);
        };

        ws.onclose = () => console.log("WebSocket disconnected");

        return () => ws.close();
    }, []);

    const sendMessage = () => {
        if (!input.trim()) return;
        socketRef.current.send(JSON.stringify({ text: input }));
        setMessages((prev) => [...prev, { sender: "user", text: input }]);
        setInput("");
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-[#0c0823]">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-xl p-6 space-y-4">
                <h2 className="text-2xl font-bold text-center text-blue-800 flex items-center justify-center gap-2">
                    <span>💬</span> Chat Assistant
                </h2>

                <div className="h-64 overflow-y-auto border bg-gray-100 rounded-lg p-4 flex flex-col space-y-3">
                    {messages.map((msg, i) => (
                        <div
                            key={i}
                            className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm ${
                                msg.sender === "user"
                                    ? "bg-blue-600 text-white self-end rounded-br-sm"
                                    : "bg-gray-300 text-gray-800 self-start rounded-bl-sm"
                            }`}
                        >
                            {msg.text}
                        </div>
                    ))}
                </div>

                <div className="flex gap-2">
                    <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                        placeholder="Type your message..."
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                    />
                    <button
                        onClick={sendMessage}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg"
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
};
