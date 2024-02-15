const PORT = 1000
const express = require("express")
const { MongoClient } = require("mongodb")
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const bcrypt = require('bcrypt');
const http = require("http");
const socketIo = require("socket.io");
const multer = require('multer'); 
const storage = multer.memoryStorage();
const mongoose = require('mongoose');
const upload = multer({ storage: storage });
const bodyParser = require('body-parser');
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

const userSchema = new mongoose.Schema({
    picturePath: String,
});


// -----------------------------------------routes-------------------------------------------------------

app.post('/postFeedImg', upload.single('image'), async (req, res) => {
    const { userId, content } = req.body;

    try {
        await client.connect();
        const database = client.db('hepy-data');
        const users = database.collection('users');

        const query = { user_id: userId };

        const updateDocument = {
            $push: {
                posts: {
                    content: content,
                    image: {
                        data: req.file.buffer,
                        contentType: req.file.mimetype,
                    },
                },
            },
        };

        const updatedUser = await users.updateOne(query, updateDocument);

        res.json(updatedUser);
    } catch (err) {
        console.error('Error posting:', err);
        res.status(500).json('Internal Server Error');
    } finally {
        await client.close();
    }
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

app.post('/phone-number', async (req, res) => {
    const client = new MongoClient(uri);
    const { phoneNumber, email, password } = req.body;
    const generatedUserId = uuidv4();
    const hashedPassword = await bcrypt.hash(password, 10);

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
            email: email.toLowerCase(),
            hashed_password: hashedPassword
        };

        const insertedUser = await users.insertOne(userData);

        const token = jwt.sign({ user_id: generatedUserId, phone_number: phoneNumber }, 'your_secret_key', {
            expiresIn: 60 * 24
        });
        res.cookie('UserId', generatedUserId);
        res.status(201).json({ token, userId: generatedUserId, phone_number: phoneNumber });
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

app.post('/check-phone-number-exists', async (req, res) => {
    const client = new MongoClient(uri);
    const { phoneNumber } = req.body;

    try {
        await client.connect();
        const database = client.db('hepy-data');
        const users = database.collection('users');

        const existingUser = await users.findOne({ phone_number: phoneNumber });

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

app.post('/phonelogin', async (req, res) => {
    const client = new MongoClient(uri);
    const {phone_number, password } = req.body;

    try {
        await client.connect();
        const database = client.db('hepy-data');
        const users = database.collection('users');

        const user = await users.findOne({ phone_number });
        if (user) {
            const correctPassword = await bcrypt.compare(password, user.hashed_password);

            if (correctPassword) {
                const token = jwt.sign({ user_id: user.user_id, phone_number }, 'your_secret_key', {
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

        // Get information about the user who is liking
        const liker = await users.findOne({ user_id: userId });

        if (!liker) {
            return res.status(404).json({ error: 'Liker not found' });
        }

        // Update the liked user's document
        const likedUserQuery = { user_id: matchedUserId };
        const likedUser = await users.findOne(likedUserQuery);

        if (!likedUser) {
            return res.status(404).json({ error: 'Liked user not found' });
        }

        const likedUserUpdateDocument = {
            $push: {
                beingLiked: {
                    userId,
                    userName: liker.first_name + ' ' + liker.last_name,
                    pic: liker.Pic[0]
                }
            }
        };

        const updatedLikedUser = await users.findOneAndUpdate(
            likedUserQuery,
            likedUserUpdateDocument,
            { returnDocument: 'after' }
        );

        // Update the liker's document
        const likerQuery = { user_id: userId, 'likedProfiles.user_id': { $ne: matchedUserId } };
        const likerUpdateDocument = {
            $push: {
                likedProfiles: {
                    user_id: matchedUserId,
                    userName: likedUser.first_name + ' ' + likedUser.last_name,
                    pic: likedUser.Pic[0]
                }
            }
        };

        const updatedLiker = await users.findOneAndUpdate(
            likerQuery,
            likerUpdateDocument,
            { returnDocument: 'after' }
        );

        if (!updatedLiker) {
            return res.status(404).json({ error: 'Liker not found or already liked' });
        }

        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json('Internal Server Error');
    } finally {
        await client.close();
    }
});

// Add a new endpoint to get subscription data by userId
app.get('/getSubscription/:userId', async (req, res) => {
    const userId = req.params.userId;

    try {
        const client = new MongoClient(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        await client.connect();
        const database = client.db('hepy-data');
        const subscriptionCollection = database.collection('subscription');

        const subscriptionData = await subscriptionCollection.findOne({ userId });

        if (subscriptionData) {
            res.status(200).json({ success: true, data: subscriptionData });
        } else {
            res.status(404).json({ success: false, message: 'Subscription data not found' });
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    } finally {
        await client.close();
    }
});

app.post('/subscribe', async (req, res) => {
    const { userId, selectedPlan, selectedTime } = req.body;

    try {
        const client = new MongoClient(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        await client.connect();
        const database = client.db('hepy-data');
        const subscriptionCollection = database.collection('subscription'); 

        const subscriptionData = {
            userId,
            selectedPlan,
            selectedTime,
            timestamp: new Date(), 
        };

        await subscriptionCollection.insertOne(subscriptionData);

        res.status(200).json({ success: true, message: 'Subscription saved successfully' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    } finally {
        await client.close();
    }
});

app.post('/postFeedsUpload', upload.single('image'), async (req, res) => {
    try {
        await client.connect();
        const database = client.db('hepy-data');
        const posts = database.collection('posts');
        const users = database.collection('users');

        const user = await users.findOne({ user_id: req.body.user_id });

        const newPost = {
            user_id: req.body.user_id,
            content: req.body.content,
            likes: 0,
            comments: [],
            image: req.file.buffer,
            userName: user ? `${user.first_name} ${user.last_name}` : 'Unknown',
            userPic: user ? user.Pic[0] : '',
            timestamp: new Date(),
        };

        const insertedPost = await posts.insertOne(newPost);

        res.json(insertedPost);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        await client.close();
    }
});

app.get('/allPosts', async (req, res) => {
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const database = client.db('hepy-data');
        const posts = database.collection('posts');

        const allPosts = await posts.find({}).toArray();

        res.json(allPosts);
    } finally {
        await client.close();
    }
});

// --------Like Post-------------
app.post('/likePost/:postId', async (req, res) => {
    try {
        const client = new MongoClient(uri);
        await client.connect();

        const database = client.db('hepy-data');
        const posts = database.collection('posts');

        const postId = req.params.postId;
        const updatedPost = await posts.findOneAndUpdate(
            { _id: new ObjectId(postId) },
            { $inc: { likes: 1 } },
            { returnDocument: 'after' }
        );

        res.json(updatedPost.value);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        await client.close();
    }
});

// Unlike a Post
app.post('/unlikePost/:postId', async (req, res) => {
    try {
        const client = new MongoClient(uri);
        await client.connect();

        const database = client.db('hepy-data');
        const posts = database.collection('posts');

        const postId = req.params.postId;
        const updatedPost = await posts.findOneAndUpdate(
            { _id: new ObjectId(postId) },
            { $inc: { likes: -1 } }, // Decrement likes by 1
            { returnDocument: 'after' }
        );

        res.json(updatedPost.value);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        await client.close();
    }
});

// Add the 'saveComment' endpoint
app.post('/saveComment/:postId', async (req, res) => {
    const postId = req.params.postId;
    const { userId, commentContent } = req.body;

    try {
        const client = new MongoClient(uri);
        await client.connect();

        const database = client.db('hepy-data');
        const posts = database.collection('posts');
        const users = database.collection('users');

        const post = await posts.findOne({ _id: new ObjectId(postId) });
        const user = await users.findOne({ user_id: userId });

        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        const comment = {
            userId,
            userName: user ? `${user.first_name} ${user.last_name}` : 'Unknown',
            content: commentContent,
            timestamp: new Date(),
        };

        post.comments.push(comment);

        const updatedPost = await posts.findOneAndUpdate(
            { _id: new ObjectId(postId) },
            { $set: { comments: post.comments } },
            { returnDocument: 'after' }
        );

        res.status(201).json(updatedPost.value);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
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


// ------ Audio Saving ---------
app.post('/upload-audio', upload.single('audio'), async (req, res) => {
    try {
        const client = new MongoClient(uri);
        await client.connect();

        const database = client.db('hepy-data');
        const audioCollection = database.collection('audio');

        const audioData = {
            user_id: req.body.user_id, // Assuming you send the user_id along with the audio
            audio: {
                data: req.file.buffer,
                contentType: req.file.mimetype,
            },
        };

        const result = await audioCollection.insertOne(audioData);

        res.status(201).json({ message: 'Audio recording successfully saved in the database' });
    } catch (err) {
        console.error('Error saving audio recording:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        await client.close();
    }
}); 

// Update a User in the Database
app.put('/user', async (req, res) => {
    const client = new MongoClient(uri)
    const formData = req.body.formData

    console.log('Received FormData:', formData); // Add this line for debugging

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
