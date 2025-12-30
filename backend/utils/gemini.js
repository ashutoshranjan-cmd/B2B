import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const generateProductDetails = async ({ name, category, description }) => {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `
You are an expert e-commerce product content writer.

Product name: ${name}
Category: ${category}
Basic description: ${description}

Generate the following in JSON format ONLY:

{
  "highlights": [5 short bullet points],
  "specifications": {
    "Specification name": "value"
  },
  "longDescription": "Detailed SEO-friendly paragraph"
}

Rules:
- Do not include markdown
- Do not include explanations
- Output pure JSON only
`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();

  return JSON.parse(text);
};
