const express = require('express');
const path = require('path');
const http = require('http');
const socketIo = require('socket.io');
const formatMessage = require('./utils/chatMessage');
const { MongoClient } = require('mongodb');

const dbName = 'chatApp';
const chatCollectionName = 'chats';
const userCollectionName = 'onlineUsers';

const port = 5000;

// MongoDB Atlas URI
// const mongoUri = "mongodb+srv://oishimarziakhanam7:.w2eFGZ2a.@5nck@cluster0.7vn5o.mongodb.net/";
const mongoUri = "mongodb+srv://abc:abc@cluster0.kfpqf.mongodb.net/carecircle?retryWrites=true&w=majority&appName=Cluster0";

// Initialize Express app and HTTP server
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

let dbConnection;

// Function to establish MongoDB connection
async function connectToMongo() {
  if (!dbConnection) {
    try {
      dbConnection = await MongoClient.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
      console.log('Successfully connected to MongoDB Atlas');
    } catch (err) {
      console.error('MongoDB Atlas connection error:', err);
      process.exit(1);
    }
  }
  return dbConnection.db(dbName);
}

// Handle new client connections
io.on('connection', (socket) => {
  console.log('A new user connected with ID: ' + socket.id);

  let sender = null;
  let receiver = null;

  // Handle receiving user details
  socket.on('userDetails', async (data) => {
    sender = data.fromUser;
    receiver = data.toUser;

    const db = await connectToMongo();
    const onlineUsers = db.collection(userCollectionName);
    const chatHistory = db.collection(chatCollectionName);

    try {
      const user = { ID: socket.id, name: sender };

      // Add the user to the online users collection if they aren't already there
      const existingUser = await onlineUsers.findOne({ name: sender });
      if (!existingUser) {
        await onlineUsers.insertOne(user);
        console.log(`${sender} is now online`);
      }

      // Retrieve the chat history between the sender and receiver
      const history = await chatHistory.find({
        $or: [
          { from: sender, to: receiver },
          { from: receiver, to: sender }
        ],
      }).project({ _id: 0 }).toArray();

      // Send the chat history to the client
      socket.emit('output', history);
    } catch (err) {
      console.error('Error processing user details:', err);
    }
  });

  // Handle receiving a chat message
  socket.on('chatMessage', async (data) => {
    const db = await connectToMongo();
    const chatHistory = db.collection(chatCollectionName);
    const onlineUsers = db.collection(userCollectionName);

    try {
      // Format and log the message
      const formattedMessage = formatMessage(data);
      formattedMessage.message = data.message;
      console.log(formattedMessage, data);

      // Save the message to the chat collection
      await chatHistory.insertOne(formattedMessage);
      socket.emit('message', formattedMessage); // Send the message back to the sender

      // Check if the recipient is online and send the message to them
      const recipient = await onlineUsers.findOne({ name: data.toUser });
      if (recipient) {
        socket.to(recipient.ID).emit('message', formattedMessage);
      }
    } catch (err) {
      console.error('Error processing chat message:', err);
    }
  });

  // Handle user disconnections
  socket.on('disconnect', async () => {
    const db = await connectToMongo();
    const onlineUsers = db.collection(userCollectionName);

    try {
      await onlineUsers.deleteOne({ ID: socket.id });
      console.log('User ' + socket.id + ' disconnected');
    } catch (err) {
      console.error('Error handling disconnection:', err);
    }
  });
});

// Serve static files from the "front" folder
app.use(express.static(path.join(__dirname, 'front')));
// Start the server
server.listen(port, () => {
  console.log(`Chat server is running on port ${port}`);
});
