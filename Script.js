
import express from "express";
import mongoose from "mongoose";
import User from "./User.js";

const app = express();


const PORT = process.env.PORT || 5200; 


// Middleware
app.use(express.json());


mongoose.connect("mongodb://localhost:27017", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.once("open", () => console.log("Connected to MongoDB"));
db.on("error", (err) => console.error(" MongoDB connection error:", err));


app.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});


app.get("/users/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});


app.post("/user", async (req, res) => {
  try {
    const { firstName, lastName, hobby } = req.body;

    if (!firstName || !lastName || !hobby) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newUser = new User({ firstName, lastName, hobby });
    await newUser.save();

    res.status(201).json({ message: "User added successfully", newUser });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});



app.put("/user/:id", async (req, res) => {
  try {
    const { firstName, lastName, hobby } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { firstName, lastName, hobby },
      { new: true }
    );

    if (!updatedUser) return res.status(404).json({ message: "User not found" });

    res.json({ message: "User updated successfully", updatedUser });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});


app.delete("/user/:id", async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);

    if (!deletedUser) return res.status(404).json({ message: "User not found" });

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});


app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
