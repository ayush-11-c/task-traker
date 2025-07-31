import jwt from "jsonwebtoken";
import { GoogleGenAI } from "@google/genai";

const cookieOption = {
  maxAge: 2 * 24 * 60 * 60 * 1000,
  httpOnly: true,
  secure: true,
  sameSite: "None",
};

const sendToken = (user, status, res, message) => {
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
  return res.status(status).cookie("token", token, cookieOption).json({
    success: true,
    message,
  });
};

const ai = new GoogleGenAI({
  apiKey: "AIzaSyDudZd8GXBZj44EmXkmHJPJI77GkXjKqB4",
});
const generateResponse = async ({ title, description }) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: {
        text: `make this title ${title} and description ${description} more engaging and attractive and professional Return only a JSON object with keys "title" and "description", where each is a more engaging and professional version of:
Title: "${title}"
Description: "${description}" `,
      },
    });

    const parts = response.candidates[0].content.parts;
    console.log("AI Response Parts:", parts);

    // Fix: Use 'parts' instead of 'responseParts'
    const jsonString = parts[0].text.replace(/```json|```/g, "").trim();

    // Parse the JSON
    const data = JSON.parse(jsonString);
    console.log("Parsed AI Response Data:", data);

    // Extract title and description
    const newTitle = data.title;
    const newDescription = data.description;

    console.log("Title:", newTitle);
    console.log("Description:", newDescription);

    // Return the enhanced data
    return {
      title: newTitle,
      description: newDescription,
    };
  } catch (error) {
    console.error("Error generating AI response:", error);
    throw new Error("Failed to generate AI response");
  }
};
export { sendToken, cookieOption, generateResponse };
