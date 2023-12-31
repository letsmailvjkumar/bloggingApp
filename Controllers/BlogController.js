const express = require("express");
const BlogRouter = express.Router();
const Blog = require("../Models/BlogModel");
const { BlogDataValidator } = require("../Utils/BlogUtils");
const User = require("../Models/UserModel");

BlogRouter.post("/create-blog", async (req, res) => {
  console.log(req.body);

  const { title, textBody } = req.body;
  const userId = req.session.user.userId;
  const creationDateTime = Date.now();

  try {
    await BlogDataValidator({ title, textBody });
  } catch (error) {
    return res.send({
      status: 400,
      message: "Data invalidate",
      error: error,
    });
  }

  try {
    const userDb = await User.verifyUserId({ userId });
  } catch (error) {
    return res.send({
      status: 400,
      error: error,
    });
  }
  //model(constructor)<-----obj(Controller)
  try {
    const blogObj = new Blog({ title, textBody, userId, creationDateTime });
    const blogDb = await blogObj.createBlog();
    
    return res.send({
      status: 201,
      message: "Blog Created Successfully",
      data: blogDb,
    });
  } catch (error) {
    return res.send({
      status: 500,
      message: "Database error",
      error: error,
    });
  }
});

// /get-blogs?skip=5
BlogRouter.get("/get-blogs", async (req, res) => {
  const SKIP = parseInt(req.query.skip) || 0;

  try {
    const blogDb = await Blog.getBlogs({ SKIP });

    return res.send({
      status: 200,
      message: "Read Success",
      data: blogDb,
    });
  } catch (error) {
    return res.send({
      status: 500,
      message: "Database error",
      error: error,
    });
  }
});

// /my-blogs?skip=2
BlogRouter.get("/my-blogs", async (req, res) => {
  const SKIP = parseInt(req.query.skip) || 0;
  const userId = req.session.user.userId;

  try {
    const myblogDb = await Blog.myBlogs({ SKIP, userId });

    return res.send({
      status: 200,
      message: "Read success",
      data: myblogDb,
    });
  } catch (error) {
    console.log(error);
    return res.send({
      status: 500,
      message: "Database error",
      error: error,
    });
  }
});

// edit blog
BlogRouter.post('/edit-blog', async (req, res) => {
  const { title, textBody } = req.body.data;
  const blogId = req.body.blogId;
  const userId = req.session.user.userId;

  try{
    await BlogDataValidator({ title, textBody });
  } catch(error) {
    return res.send({
      status: 400,
      message:"Data invalidate",
      error: error,
    })
  }

  // find the user with the blog
  try{
    const blogDb = await Blog.getBlogWithId({blogId});
    // console.log(blogDb.userId, userId);

    // check the ownership
    // method-1 -> convert to string and compare
    // method-2 -> object.equals method

    if(!blogDb.userId.equals(userId)){
      return res.send({
        status: 401,
        message: "Not authorized to edit",
      })
    }
    
    // not allowed to edit after 30 minutes
    const diff = new Date(String(Date.now()) - blogDb.creationDateTime).getTime() / (1000 * 60);
    
    if( diff > 30){
      return res.send({
        status: 400,
        message: "Not allowed to edit after 30 mins"
      })
    }
 
    const blogObj = new Blog({
      title,
      textBody,
      userId,
      creationDateTime: blogDb.creationDateTime,
      blogId,
    });

    const oldBlogDb = await blogObj.updateBlog();

    return res.send({
      status: 200,
      message: "Blog has been edited successfully",
      data: oldBlogDb,
    });

  }catch(error) {
    console.log(error);
    return res.send({
      status:500,
      message:"Database error",
      error:error,
    })
  }

});

BlogRouter.post("/delete-blog", async (req, res) => {
  const blogId = req.body.blogId;
  const userId = req.session.user.userId;

  try {
    const blogDb = await Blog.getBlogWithId({ blogId });

    //check the ownership
    if (!blogDb.userId.equals(userId)) {
      return res.send({
        status: 401,
        message: "Not authorized to delete the blog",
      });
    }

    //delete the blog
    const deletedBlog = await Blog.deleteBlog({ blogId });

    return res.send({
      status: 200,
      message: "Blog Deleted Successfully",
      data: deletedBlog,
    });
  } catch (error) {
    return res.send({
      status: 500,
      message: "Database error",
      error: error,
    });
  }
});

module.exports = BlogRouter;