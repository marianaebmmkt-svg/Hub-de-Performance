
import { GoogleGenAI } from "@google/genai";
import { MOCK_PERFORMANCE, ACTIONS_LOG } from "../constants";

export const getChatResponse = async (userMessage: string, history: any[]) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const dataContext = {
    performance: MOCK_PERFORMANCE,
    actions: ACTIONS_LOG,
    client: "Hub de Performance",
    year: 2026,
    today: "2026-01-15"
  };

  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: [
      ...history,
      { role: "user", parts: [{ text: userMessage }] }
    ],
    config: {
      systemInstruction: `Você é o Agente Estratégico do 'Hub de Performance'. 
      Contexto Atual: Hoje é 15 de Janeiro de 2026. 
      Seu tom deve ser executivo, focado em ROI e ROAS.
      Você analisa dados de Google Ads, Meta Ads e GA4.
      Dados Atuais: ${JSON.stringify(dataContext)}.
      Ao sugerir ações, use o ano de 2026 como base e projete tendências para o próximo trimestre.`,
    },
  });

  return response.text;
};

export const getMarketInsights = async (niche: string = "empréstimo consignado e crédito no Brasil em 2026") => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `Analise as tendências atuais de marketing digital para o nicho de ${niche} para o 'Hub de Performance'. 
      Foque no cenário de 2026: regulamentação, taxas e comportamento do consumidor digital.`,
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
    return { text: "Erro ao carregar insights de mercado para 2026.", sources: [] };
  }
};
