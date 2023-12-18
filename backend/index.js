const PORT = 1000
const express = require("express")
const { MongoClient } = require("mongodb")
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const bcrypt = require('bcrypt');
const http = require("http");
const socketIo = require("socket.io");
const uri = "mongodb+srv://hepyapp:Hepy12345!@cluster0.51e0pcz.mongodb.net/?retryWrites=true&w=majority";

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "https://hepy.vercel.app/",
        methods: ["GET", "POST"],
        credentials: true,
    },
});

io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on("send_message", (data) => {
        console.log("Received message:", data);
        socket.to(data.room).emit("receive_message", data);
    });

    socket.on("disconnect", () => {
        console.log(`User disconnected: ${socket.id}`);
    });
});


app.get('/', (req, res) => {
    res.json("API is running");
});

// Sign up to the Database
app.post('/signup', async (req, res) => {
    const client = new MongoClient(uri);
    const { email, password, phoneNumber } = req.body;
    const generatedUserId = uuidv4();
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        await client.connect();
        const database = client.db('hepy-data');
        const users = database.collection('users');

        const existingUser = await users.findOne({ email });

        if (existingUser) {
            return res.status(409).json('Email already used. Please login');
        }

        const sanitizedEmail = email.toLowerCase();

        const data = {
            user_id: generatedUserId,
            email: sanitizedEmail,
            hashed_password: hashedPassword,
            phone_number: phoneNumber
        }

        const insertedUser = await users.insertOne(data);

        const token = jwt.sign({ user_id: generatedUserId, email: sanitizedEmail }, 'your_secret_key', {
            expiresIn: 60 * 24
        });
        res.cookie('UserId', generatedUserId);
        res.status(201).json({ token, userId: generatedUserId, email: sanitizedEmail });

    } catch (err) {
        console.log(err);
        res.status(500).json('Internal Server Error');
    } finally {
        await client.close();
    }
});

// Add a new endpoint to save the verified phone number

app.put('/phone-number', async (req, res) => {
    const client = new MongoClient(uri);
    const { phoneNumber } = req.body;
    const generatedUserId = uuidv4();

    try {
        await client.connect();
        const database = client.db('hepy-data');
        const users = database.collection('users');

        const existingUser = await users.findOne({ phone_number: phoneNumber });
        if (existingUser) {
            return res.status(409).json('Number already used. Please login');
        }
        const userData = {
            user_id: generatedUserId,
            phone_number: phoneNumber,
        };

        const insertedUser = await users.insertOne(userData);
        const token = jwt.sign({ user_id: generatedUserId, phone_number: phoneNumber }, 'your_secret_key', {
            expiresIn: 60 * 24
        });
        res.cookie('UserId', generatedUserId);
        res.status(201).json({ token, userId: generatedUserId, phone_number: phoneNumber, user_id: generatedUserId });
        console.log('User ID:', generatedUserId);
    } catch (err) {
        console.error('Error:', err.message);
        res.status(500).json('Internal Server Error');
    } finally {
        await client.close();
    }
});

app.post('/check-email-exists', async (req, res) => {
    const client = new MongoClient(uri);
    const { email } = req.body;

    try {
        await client.connect();
        const database = client.db('hepy-data');
        const users = database.collection('users');

        const existingUser = await users.findOne({ email });

        if (existingUser) {
            return res.json({ exists: true });
        }

        res.json({ exists: false });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        await client.close();
    }
});

app.get('/check-phone-number', (req, res) => {
    const phoneNumber = req.query.phoneNumber;
      if (usersDatabase.has(phoneNumber)) {
      res.json({ exists: true });
    } else {
      res.json({ exists: false });
    }
  });


// Log in to the Database
app.post('/login', async (req, res) => {
    const client = new MongoClient(uri);
    const { email, password } = req.body;

    try {
        await client.connect();
        const database = client.db('hepy-data');
        const users = database.collection('users');

        const user = await users.findOne({ email });

        if (user) {
            const correctPassword = await bcrypt.compare(password, user.hashed_password);

            if (correctPassword) {
                const token = jwt.sign({ user_id: user.user_id, email }, 'your_secret_key', {
                    expiresIn: 60 * 24
                });
                res.cookie('UserId', user.user_id);
                res.cookie('AuthToken', token);

                return res.status(201).json({ token, userId: user.user_id });
            }
        }

        res.status(400).json('Invalid Credentials');
    } catch (err) {
        console.log(err);
    } finally {
        await client.close();
    }
});

app.delete('/user', async (req, res) => {
    console.log('Delete account route accessed:', req.body);
    const client = new MongoClient(uri);
    const userId = req.body.userId;

    try {
        await client.connect();
        const database = client.db('hepy-data');
        const users = database.collection('users');

        const query = { user_id: userId };
        const deletedUser = await users.findOneAndDelete(query);

        if (deletedUser.value) {
            return res.status(200).json({ message: 'Account deleted successfully' });
        } else {
            return res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Error deleting account:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        await client.close();
    }
});

app.get('/user', async (req, res) => {
    const client = new MongoClient(uri)
    const userId = req.query.userId
    console.log('userId', userId)

    try {
        await client.connect()
        const database = client.db('hepy-data')
        const users = database.collection('users')

        const query = { user_id: userId }
        const user = await users.findOne(query)
        res.send(user)

    } finally {
        await client.close()
    }
})


app.get('/liked-users', async (req, res) => {
    const client = new MongoClient(uri)
    const gender = req.query.gender

    console.log('gender', gender)

    try {
        await client.connect()
        const database = client.db('hepy-data')
        const users = database.collection('users')
        const query = { Gender: { $eq: gender } }
        const foundUsers = await users.find(query).toArray()
        res.json(foundUsers)
    } finally {
        await client.close()
    }
})


app.get('/gendered-users', async (req, res) => {
    const client = new MongoClient(uri)
    const gender = req.query.gender

    console.log('gender', gender)
    try {
        await client.connect()
        const database = client.db('hepy-data')
        const users = database.collection('users')
        const query = { Gender: { $eq: gender } }
        const foundUsers = await users.find(query).toArray()
        res.json(foundUsers)
    } finally {
        await client.close()
    }
})


app.put('/addmatch', async (req, res) => {
    const client = new MongoClient(uri);
    const { userId, matchedUserId } = req.body;

    try {
        await client.connect();
        const database = client.db('hepy-data');
        const users = database.collection('users');
        const query = { user_id: userId, likedProfiles: { $ne: matchedUserId } };
        const updateDocument = {
            $push: { likedProfiles: matchedUserId }
        };
        const updatedUser = await users.findOneAndUpdate(query, updateDocument, { returnOriginal: false });

        res.send(updatedUser.value);
    } catch (err) {
        console.log(err);
        res.status(500).json('Internal Server Error');
    } finally {
        await client.close();
    }
});


// Get Messages by from_userId and to_userId
app.get('/messages', async (req, res) => {
    const { msguserId, correspondingUserId } = req.query;
    const client = new MongoClient(uri);
    console.log(msguserId, correspondingUserId);

    try {
        await client.connect();
        const database = client.db('hepy-data');
        const messages = database.collection('messages');

        const query = {
            from_userId: msguserId, to_userId: correspondingUserId
        };

        console.log('MongoDB Query:', query);

        const foundMessages = await messages.find(query).toArray();
        console.log('Found Messages:', foundMessages);

        res.send(foundMessages);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        await client.close();
    }
});


// Add a Message to our Database
app.post('/message', async (req, res) => {
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const database = client.db('hepy-data');
        const messages = database.collection('messages');

        const messageData = req.body.message;
        const insertedMessage = await messages.insertOne(messageData);
        io.emit('chat message', messageData);
        console.log('Message Sent:', messageData);

        res.json(insertedMessage);
    } catch (error) {
        console.error('Error storing the message:', error);
        res.status(500).json({ error: 'Failed to store the message.' });
    } finally {
        await client.close();
    }
});


// Update a User in the Database
app.put('/user', async (req, res) => {
    const client = new MongoClient(uri)
    const formData = req.body.formData

    console.log('Received FormData:', formData); // Add this line for debugging

    console.log(formData)

    try {
        await client.connect()
        const database = client.db('hepy-data')
        const users = database.collection('users')
        const query = { user_id: formData.user_id }

        const updateDocument = {
            $set: {
                first_name: formData.first_name,
                last_name: formData.last_name,
                DOB: formData.DOB,
            },
        }

        const insertedUser = await users.updateOne(query, updateDocument)

        res.json(insertedUser)

    } finally {
        await client.close()
    }
})

// --------------------------------About me page-----------------------------
app.put('/user1', async (req, res) => {
    const client = new MongoClient(uri)
    const formData = req.body.formData

    console.log(formData)

    try {
        await client.connect()
        const database = client.db('hepy-data')
        const users = database.collection('users')
        const query = { user_id: formData.user_id }

        const updateDocument = {
            $set: {
                Gender: formData.gender,
                Interested_in: formData.interests,
            },
        }

        const insertedUser = await users.updateOne(query, updateDocument)

        res.json(insertedUser)

    } finally {
        await client.close()
    }
})

// ----------------------------------Passion----------------------------
app.put('/user2', async (req, res) => {
    const client = new MongoClient(uri)
    const formData = req.body.formData

    console.log(formData)

    try {
        await client.connect()
        const database = client.db('hepy-data')
        const users = database.collection('users')
        const query = { user_id: formData.user_id }

        const updateDocument = {
            $set: {
                Passions: formData.passions,
            },
        }

        const insertedUser = await users.updateOne(query, updateDocument)

        res.json(insertedUser)

    } finally {
        await client.close()
    }
})

// --------------- ---------------------More Photos-----------------------------

app.put('/user3', async (req, res) => {
    const client = new MongoClient(uri)
    const formData = req.body.formData
    console.log(formData)
    try {
        await client.connect()
        const database = client.db('hepy-data')
        const users = database.collection('users')
        const query = { user_id: formData.user_id }

        const updateDocument = {
            $set: {
                Pic: formData.pic,
            },
        }

        const insertedUser = await users.updateOne(query, updateDocument)

        res.json(insertedUser)

    } finally {
        await client.close()
    }
})

// --------------------------Question of the day--------------------

app.put('/user4', async (req, res) => {
    const client = new MongoClient(uri);
    const formData = req.body.formData;

    console.log(formData);

    try {
        await client.connect();
        const database = client.db('hepy-data');
        const users = database.collection('users');
        const query = { user_id: formData.user_id };

        const updateDocument = {
            $set: {
                QO: formData.QO,
            },
        };

        const insertedUser = await users.updateOne(query, updateDocument, { upsert: true });

        res.json(insertedUser);
    } finally {
        await client.close();
    }
});


server.listen(PORT, () => console.log('Server running on port ' + PORT));
