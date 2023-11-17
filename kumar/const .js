const express = require('express');
const mongoose = require('mongoose');
const app = express();

// MongoDB connection setup
mongoose.connect('mongodb://localhost:27017/blogDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
const postSchema = new mongoose.Schema({
  title: String,
  content: String
});
const Post = mongoose.model('Post', postSchema);

// Express middleware setup
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

app.get('/posts', (req, res) => {
  // Fetch all posts from MongoDB
  Post.find({}, (err, foundPosts) => {
    if (!err) {
      res.send(foundPosts);
    } else {
      res.send(err);
    }
  });
});

app.post('/posts', (req, res) => {
  // Create a new post in MongoDB
  const newPost = new Post({
    title: req.body.title,
    content: req.body.content
  });
  newPost.save((err) => {
    if (!err) {
      res.redirect('/');
    } else {
      res.send(err);
    }
  });
});

// Other CRUD operations (Update and Delete) can be implemented similarly

// Server listening
app.listen(3000, () => {
  console.log('Server started on port 3000');
});