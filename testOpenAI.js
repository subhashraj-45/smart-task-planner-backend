import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config({ path: "./key.env" });

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

(async () => {
  try {
    const response = await client.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: "Hello!" }],
      temperature: 0
    });
    console.log("Response:", response.choices[0].message.content);
  } catch (err) {
    console.error("OpenAI Error:", err.response ? err.response.data : err);
  }
})();
