
import { GoogleGenAI } from "@google/genai";
import { MOCK_PERFORMANCE, ACTIONS_LOG } from "../constants";

export const getChatResponse = async (userMessage: string, history: any[]) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // Prepara o contexto de dados para a IA
  const dataContext = {
    performance: MOCK_PERFORMANCE,
    actions: ACTIONS_LOG,
    client: "Hub de Performance da Mari"
  };

  // Upgraded to gemini-3-pro-preview for complex strategic analysis as per guidelines
  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: [
      ...history,
      { role: "user", parts: [{ text: userMessage }] }
    ],
    config: {
      systemInstruction: `Você é a IA Analista Estratégica do 'Hub de Performance da Mari'. 
      Seu tom é profissional, direto e focado em resultados de marketing digital.
      Você tem acesso a estes dados: ${JSON.stringify(dataContext)}.
      Ao analisar, cite métricas específicas como CPA, Conversões e Investimento. 
      Ajude o gestor a tomar decisões baseadas nos dados fornecidos.`,
    },
  });

  return response.text;
};

export const getMarketInsights = async (niche: string = "empréstimo consignado e crédito no Brasil") => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    // Upgraded to gemini-3-pro-preview for advanced reasoning and market analysis
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `Analise as tendências atuais de marketing digital para o nicho de ${niche} para o 'Hub de Performance da Mari'. 
      Foque em CPC médio e volume de busca atual.`,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    return {
      text: response.text,
      sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
    };
  } catch (error) {
    console.error("Error fetching Gemini insights:", error);
    return { text: "Erro ao carregar insights de mercado.", sources: [] };
  }
};
