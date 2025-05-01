import t, { useState as l } from "react";
function d() {
  const [a, n] = l(""), [c, r] = l([]);
  async function s() {
    if (a)
      try {
        const e = await fetch("http://localhost:8085/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: a })
        }).then((o) => o.json());
        r((o) => [...o, `You: ${a}`, `Bot: ${e.reply}`]), n("");
      } catch {
        r((e) => [...e, `You: ${a}`, "Bot: error"]);
      }
  }
  return t.createElement(
    "div",
    { className: "w-80 shadow-xl rounded-2xl p-4 bg-white border fixed bottom-4 right-4 bg-white z-50" },
    t.createElement("h3", { className: "font-bold text-lg mb-2" }, "AI Chat"),
    t.createElement(
      "div",
      { className: "text-sm h-48 overflow-y-auto mb-2 space-y-1" },
      c.map((e, o) => t.createElement("p", { key: o }, e))
    ),
    t.createElement(
      "div",
      { className: "flex gap-2" },
      t.createElement("input", {
        className: "flex-1 border rounded px-2 py-1 text-sm",
        value: a,
        onChange: (e) => n(e.target.value),
        onKeyDown: (e) => e.key === "Enter" && s(),
        placeholder: "Ask…"
      }),
      t.createElement("button", {
        onClick: s,
        className: "px-3 py-1 text-sm bg-black text-white rounded"
      }, "Send")
    )
  );
}
export {
  d as default
};
