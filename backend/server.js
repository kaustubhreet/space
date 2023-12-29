const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const openaiController = require('./controllers/openai');
const speechToTextController = require('./controllers/speechToText');

// Middleware and configurations (e.g., body-parser, CORS)
app.use(express.json());
// ... other middleware as needed

// Connect to MongoDB
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/chat-app', { useNewUrlParser: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error(err));

// Socket.io configuration
io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('login', async (data) => {
        try {
          // ... perform authentication using Passport.js or similar
          const user = await authenticateUser(data.username, data.password);
          if (user) {
            socket.emit('login', { success: true, user });
          } else {
            socket.emit('login', { success: false, error: 'Invalid credentials' });
          }
        } catch (error) {
          console.error(error);
          socket.emit('login', { success: false, error: 'Authentication error' });
        }
      });

    // Handle incoming chat messages
    socket.on('chat message', async (data) => {
        const newMessage = new Message(data);
        await newMessage.save();
        io.emit('chat message', newMessage); // Broadcast to all clients
    });

    // Handle incoming messages, chat events, etc. (will be implemented in later phases)
});

//incoming audio streams and transcribe
io.on('audio stream', async (socket, audioStream) => {
    try {
      const transcript = await transcribeAudio(audioStream);
      // ... emit transcript back to client or handle as needed
    } catch (error) {
      console.error('Error transcribing audio:', error);
    }
  });
  
// OpenAI endpoint
app.post('/openai', async (req, res) => {
    const { prompt } = req.body;
    const generatedText = await openaiController.generateText(prompt);
    res.json({ generatedText });
});

app.post('/text-to-speech', async (req, res) => {
    try {
      const { text } = req.body;
      const audioData = await synthesizeText(text);
      res.setHeader('Content-Type', 'audio/mpeg');
      res.send(audioData);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to generate audio' });
    }
  });

//speech to text
io.on('audio stream', async (socket, audioStream) => {
    const audioBuffer = Buffer.from(await streamToBuffer(audioStream));
    const transcript = await speechToTextController.transcribeAudio(audioBuffer);
    console.log('Transcribed text:', transcript);
    // ... process transcript and potentially emit events to clients
});

// Helper function to convert audio stream to buffer
const streamToBuffer = async (stream) => {
    return
    new Promise((resolve, reject) => {
            const chunks = [];
            stream.on('data', (chunk) => chunks.push(chunk));
            stream.on('end',

                () => resolve(Buffer.concat(chunks)));
            stream.on('error', (err) => reject(err));
        });
};


// Server start
server.listen(5000, () => {
    console.log('Server listening on port 5000');
});
