const openai = require('openai');

openai.apiKey = process.env.OPENAI_API_KEY; // Set your OpenAI API key as an environment variable

const generateText = async (prompt, maxTokens = 150) => {
  try {
    const response = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: prompt,
      max_tokens: maxTokens,
      n: 1,
      stop: null,
      temperature: 0.7,
    });
    return response.data.choices[0].text;
  } catch (error) {
    console.error(error);
    return 'Error generating text from OpenAI';
  }
};

module.exports = { generateText };
