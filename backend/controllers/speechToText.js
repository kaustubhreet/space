const speech = require('@google-cloud/speech');

const client = new speech.SpeechClient();

const transcribeAudio = async (audioContent, languageCode = 'en-US') => {
  const request = {
    audio: { content: audioContent },
    config: {
      encoding: 'LINEAR16',
      sampleRateHertz: 16000,
      languageCode: languageCode,
    },
  };

  try {
    const [response] = await client.recognize(request);
    const transcript = response.results
      .map((result) => result.alternatives[0].transcript)
      .join('\n');
    return transcript;
  } catch (error) {
    console.error(error);
    return null;
  }
};

module.exports = { transcribeAudio };
