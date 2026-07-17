import { GoogleGenAI } from "@google/genai";

import {ApiError} from "./ApiError.js";
import dotenv from "dotenv";

dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY,});
export const geminiAIVector =async (prompt) =>{

    try{
        const response = await  ai.models.embedContent({
            model: "gemini-embedding-2",
            contents: prompt,
        });
        console.log(response);
        return response.embeddings[0].values;
    }catch(err){
        console.error("Gemini Vector Generation Error:", err);
        throw new ApiError("Gemini failed to generate vector embeddings", 500);
    }

}

export const geminiChat = async (prompt) => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });

        return response.text;
    } catch (err) {
        console.error("Gemini Chat Error:", err);
        throw new ApiError("Gemini failed to generate response", 500);
    }
};




