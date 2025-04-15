import { useState } from "react";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: "AIzaSyCYtw6_R8ky7jYfbeabzBqD1467FoPr1JI",
});

function App() {
  const [mensagem, setMensagem] = useState("");
  const [incluirPrefixo, setIncluirPrefixo] = useState(false);
  const [idioma, setIdioma] = useState("pt");
  const [resposta, setResposta] = useState("");
  const [carregando, setCarregando] = useState(false);

  const gerarCommit = async () => {
    if (!mensagem.trim()) return;

    setCarregando(true);
    setResposta("");

    const idiomaTexto =
      idioma === "pt" ? "Português" : idioma === "en" ? "Inglês" : "Espanhol";

    const prompt = `
      Você é um gerador automático de mensagens de commit.  
      Com base na descrição abaixo, gere **apenas o título da mensagem de commit**, seguindo estas regras:

      • Seja objetivo e direto: a mensagem deve ter no máximo 1 linha.  
      • A mensagem deve estar no idioma: ${idiomaTexto}.  
      • NÃO inclua corpo, rodapé ou explicações extras — apenas o texto final do commit.

      Sobre o uso de prefixos (feat, fix, chore, etc.):
      - O uso de prefixo ${incluirPrefixo ? "é obrigatório" : "NÃO obrigatório"}.
      - Se usar prefixo, siga o padrão do Conventional Commits:  
        tipo(opcionalEscopo): descrição  
        Ex: feat(auth): adicionar suporte a login

      Descrição da alteração:
      "${mensagem}"

      Agora, gere a melhor mensagem de commit possível conforme essas regras.
    `;
    try {
      const result = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: prompt,
      });

      const text = result.text?.trim();

      if (text) {
        setResposta(text);
      } else {
        setResposta("A resposta veio vazia. Tente novamente.");
      }
    } catch (error) {
      console.error("Erro ao gerar commit:", error);
      setResposta("Erro ao gerar commit. Verifique a chave da API ou tente novamente.");
    }

    setCarregando(false);
  };

  const copiar = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      alert("Commit copiado para a área de transferência!");
    } catch {
      alert("Erro ao copiar.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0f4ff] to-[#e0eaff] flex items-center justify-center p-4">
    <div className="bg-white/70 backdrop-blur-xl shadow-xl rounded-2xl p-8 w-full max-w-xl border border-white/30 space-y-6">
      <h1 className="text-3xl font-bold text-center text-indigo-600 tracking-tight">
        Commit Generator AI 🚀
      </h1>
  
      <div>
        <label htmlFor="mensagem" className="block text-sm font-medium text-gray-700 mb-1">
          What did you change?
        </label>
        <textarea
          id="mensagem"
          rows={4}
          className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none bg-white/80 backdrop-blur"
          placeholder="Describe your changes here..."
          value={mensagem}
          onChange={(e) => setMensagem(e.target.value)}
        />
      </div>
  
      <div className="flex items-center gap-2">
      <input
        id="prefixo"
        type="checkbox"
        className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
        checked={incluirPrefixo}
        onChange={(e) => setIncluirPrefixo(e.target.checked)}
      />
      <label htmlFor="prefixo" className="text-sm text-gray-700 flex items-center gap-1">
        Use prefix (feat:, fix:, etc.)
      </label>
    </div>

  
      <div>
        <label htmlFor="idioma" className="block text-sm font-medium text-gray-700 mb-1">
          Language
        </label>
        <select
          id="idioma"
          className="w-full border border-gray-300 rounded-lg p-3 bg-white/80 backdrop-blur"
          value={idioma}
          onChange={(e) => setIdioma(e.target.value)}
        >
          <option value="pt">Portuguese</option>
          <option value="en">English</option>
          <option value="es">Spanish</option>
        </select>
      </div>
  
      <button
        onClick={gerarCommit}
        disabled={carregando}
        className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-50"
      >
        {carregando ? "Generating..." : "Generate Commit"}
      </button>
  
      {resposta && (
        <div className="mt-4 space-y-2">
          <label className="block text-sm font-medium text-gray-700">Result:</label>
          <div className="bg-gray-100/70 p-4 rounded-md text-sm text-gray-800 whitespace-pre-wrap shadow-inner">
            {resposta}
          </div>
          <button
            onClick={() => copiar(resposta)}
            className="text-sm text-indigo-600 hover:underline"
          >
            Copy to clipboard
          </button>
        </div>
      )}
    </div>
  </div>
  );
}
export default App;
