const textToSpeech = require('@google-cloud/text-to-speech');

const client = new textToSpeech.TextToSpeechClient();

const synthesizeText = async (text, languageCode = 'en-US') => {
  const request = {
    input: { text: text },
    voice: { languageCode: languageCode, ssmlGender: 'NEUTRAL' },
    audioConfig: { audioEncoding: 'MP3' },
  };

  try {
    const [response] = await client.synthesizeSpeech(request);
    const audioContent = response.audioContent;
    return audioContent;
  } catch (error) {
    console.error(error);
    return null;
  }
};

module.exports = { synthesizeText };
