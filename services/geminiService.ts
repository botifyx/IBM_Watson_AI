import { GoogleGenAI, Modality } from "@google/genai";
import type { ChatMessage } from '../types';

// Assume process.env.API_KEY is configured in the environment.
const getAIClient = () => new GoogleGenAI({ apiKey: process.env.API_KEY as string });

/**
 * Cleans the raw text from Gemini API, removing conversational intros.
 * @param text The raw text from the API.
 * @returns The cleaned, markdown-ready text.
 */
function cleanGeminiResponse(text: string): string {
  // The model sometimes adds a conversational intro before the markdown.
  // We look for a markdown separator (--- or ***) and take the content after it.
  const separatorRegex = /^(?:.|\n)*?(?:\n---\n|\n\*\*\*\n)/;
  const match = text.match(separatorRegex);

  if (match) {
    // Return the text after the separator
    return text.substring(match[0].length).trim();
  }

  // If no separator is found, return the original text as a fallback.
  return text;
}


export async function generateContent(prompt: string): Promise<string> {
  try {
    const ai = getAIClient();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-pro',
      contents: prompt,
    });
    return cleanGeminiResponse(response.text);
  } catch (error) {
    console.error("Error generating content from Gemini API:", error);
    throw new Error("The AI service is currently unavailable. Please try again later.");
  }
}

export async function generateChatResponse(
  userPrompt: string, 
  history: ChatMessage[],
  location: GeolocationCoordinates | null
): Promise<string> {
  const systemPrompt = `
You are "Watsy," a friendly and expert AI assistant for 'The Unofficial Guide to IBM Watson AI'.
Your purpose is to help users navigate the site, answer questions about IBM Watson, and provide clear, concise information based on the website's content.

Your Persona:
- Knowledgeable: You are an expert on IBM Watson.
- Helpful: You guide users and answer their questions effectively.
- Friendly & Professional: Your tone is approachable yet authoritative.

User Context:
- User's preferred language (from browser): ${navigator.language}
- User's location: ${location ? `Latitude: ${location.latitude}, Longitude: ${location.longitude}` : 'Not available'}

Instructions:
1. Stay On-Topic: Your knowledge is confined to IBM Watson and related AI topics. If asked about something unrelated, politely steer the conversation back to IBM Watson.
2. Use Location: If the user's query could benefit from location-specific information (e.g., "Are there any IBM offices near me?" or "AI tech hubs"), use the provided coordinates to give a relevant answer. If location is not relevant, ignore it.
3. Be Concise: Provide answers that are easy to read in a small chat window. Use lists or short paragraphs.
4. Review Chat History: Use the provided chat history to understand the context of the conversation.
5. Do Not Hallucinate: If you don't know the answer, say so. Do not make up information.
6. Use Markdown for formatting if it enhances readability (e.g., lists, bolding).

Based on this, answer the user's latest message.
`;

  const conversationHistory = history.map(msg => `${msg.role}: ${msg.text}`).join('\n');
  const fullPrompt = `${systemPrompt}\n\nConversation History:\n${conversationHistory}\n\nuser: ${userPrompt}\nmodel:`;

  try {
    const ai = getAIClient();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-pro',
      contents: fullPrompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error generating chat response from Gemini API:", error);
    throw new Error("The AI service is currently unavailable. Please try again later.");
  }
}

export async function generateSingleVideo(prompt: string): Promise<string> {
    const ai = getAIClient();
    let operation = await ai.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt: prompt,
      config: {
        numberOfVideos: 1,
        resolution: '720p', 
        aspectRatio: '16:9'
      }
    });

    while (!operation.done) {
      // Poll every 10 seconds
      await new Promise(resolve => setTimeout(resolve, 10000));
      operation = await ai.operations.getVideosOperation({operation: operation});
    }

    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (!downloadLink) {
        throw new Error("Video generation completed, but no download link was found.");
    }

    // Fetch the video blob URL
    const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
    if (!response.ok) {
        throw new Error(`Failed to fetch video file: ${response.statusText}`);
    }
    const blob = await response.blob();
    return URL.createObjectURL(blob);
}

export async function generateSpeech(prompt: string): Promise<string> {
    const ai = getAIClient();
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: prompt }] }],
        config: {
            responseModalities: [Modality.AUDIO],
            speechConfig: {
                voiceConfig: {
                    prebuiltVoiceConfig: { voiceName: 'Kore' },
                },
            },
        },
    });
    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) {
        throw new Error("Speech generation failed, no audio data returned.");
    }
    return base64Audio;
}