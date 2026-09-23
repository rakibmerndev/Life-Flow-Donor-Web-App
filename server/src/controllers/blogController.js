const { ObjectId } = require("mongodb");

// Create a blog post
const createBlog = async (req, res) => {
  try {
    const blogCollection = req.app.locals.blogCollection;
    const body = req.body;
    const result = await blogCollection.insertOne(body);
    res.status(201).send(result);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Get all blogs (Admin only)
const getAllBlogs = async (req, res) => {
  try {
    const blogCollection = req.app.locals.blogCollection;
    const result = await blogCollection.find().toArray();
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Get published blogs only
const getPublishedBlogs = async (req, res) => {
  try {
    const blogCollection = req.app.locals.blogCollection;
    const result = await blogCollection
      .find({ status: "published" })
      .toArray();
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Get blog by ID
const getBlogById = async (req, res) => {
  try {
    const blogCollection = req.app.locals.blogCollection;
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };
    const result = await blogCollection.findOne(query);
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Publish blog
const publishBlog = async (req, res) => {
  try {
    const blogCollection = req.app.locals.blogCollection;
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };
    const updatedDoc = {
      $set: {
        status: "published",
      },
    };
    const result = await blogCollection.updateOne(query, updatedDoc);
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Delete blog
const deleteBlog = async (req, res) => {
  try {
    const blogCollection = req.app.locals.blogCollection;
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };
    const result = await blogCollection.deleteOne(query);
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

module.exports = {
  createBlog,
  getAllBlogs,
  getPublishedBlogs,
  getBlogById,
  publishBlog,
  deleteBlog,
};
