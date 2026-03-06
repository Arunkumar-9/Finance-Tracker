const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
const SECRET_KEY = "mysecretkey";

/* ================= MIDDLEWARE ================= */

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

/* ================= DATABASE ================= */

mongoose.connect("mongodb://127.0.0.1:27017/financeDB")
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

/* ================= USER MODEL ================= */

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String
});

const User = mongoose.model("User", userSchema);

/* ================= TRANSACTION MODEL ================= */

const transactionSchema = new mongoose.Schema({
  userId: String,
  amount: Number,
  type: String,
  category: String,
  date: {
    type: Date,
    default: Date.now
  }
});

const Transaction = mongoose.model("Transaction", transactionSchema);

/* ================= AUTH MIDDLEWARE ================= */

function authMiddleware(req, res, next) {

  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: "Access denied" });
  }

  try {

    const verified = jwt.verify(token, SECRET_KEY);
    req.userId = verified.userId;

    next();

  } catch (err) {

    res.status(400).json({ message: "Invalid token" });

  }

}

/* ================= REGISTER ================= */

app.post("/register", async (req, res) => {

  try {

    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword
    });

    await newUser.save();

    res.json({ message: "User registered successfully" });

  } catch (error) {

    console.error(error);
    res.status(500).json({ message: "Server error" });

  }

});

/* ================= LOGIN ================= */

app.post("/login", async (req, res) => {

  try {

    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid email" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { userId: user._id },
      SECRET_KEY,
      { expiresIn: "1h" }
    );

    res.json({ token });

  } catch (error) {

    console.error(error);
    res.status(500).json({ message: "Server error" });

  }

});

/* ================= GET USER ================= */

app.get("/me", authMiddleware, async (req, res) => {

  try {

    const user = await User
      .findById(req.userId)
      .select("-password");

    res.json(user);

  } catch (error) {

    console.error(error);
    res.status(500).json({ message: "Server error" });

  }

});

/* ================= ADD TRANSACTION ================= */

app.post("/add", authMiddleware, async (req, res) => {

  try {

    const newTransaction = new Transaction({
      ...req.body,
      userId: req.userId
    });

    await newTransaction.save();

    res.json({ message: "Transaction Added" });

  } catch (error) {

    console.error(error);
    res.status(500).json({ message: "Server error" });

  }

});

/* ================= GET TRANSACTIONS WITH FILTER ================= */

app.get("/transactions", authMiddleware, async (req, res) => {

  try {

    const { start, end, category } = req.query;

    let filter = {
      userId: req.userId
    };

    /* DATE FILTER */

    if (start && end) {

      const startDate = new Date(start);
      const endDate = new Date(end);

      endDate.setHours(23,59,59,999);

      filter.date = {
        $gte: startDate,
        $lte: endDate
      };

    }

    /* CATEGORY FILTER */

    if (category) {
      filter.category = category;
    }

    const transactions = await Transaction
      .find(filter)
      .sort({ date: -1 });

    res.json(transactions);

  } catch (error) {

    console.error(error);
    res.status(500).json({ message: "Server error" });

  }

});

/* ================= DELETE TRANSACTION ================= */

app.delete("/delete/:id", authMiddleware, async (req, res) => {

  try {

    await Transaction.deleteOne({
      _id: req.params.id,
      userId: req.userId
    });

    res.json({ message: "Deleted" });

  } catch (error) {

    console.error(error);
    res.status(500).json({ message: "Server error" });

  }

});

/* ================= START SERVER ================= */

const PORT = 5000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});