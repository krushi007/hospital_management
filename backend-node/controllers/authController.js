const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../models/User");
const PatientProfile = require("../models/PatientProfile");

function verifyDjangoPassword(password, encoded) {
  if (!encoded || !encoded.startsWith("pbkdf2_sha256$"))
    return Promise.resolve(false);
  const parts = encoded.split("$");
  if (parts.length !== 4) return Promise.resolve(false);
  const iterations = parseInt(parts[1], 10);
  const salt = parts[2];
  const hash = parts[3];
  return new Promise((resolve, reject) => {
    crypto.pbkdf2(
      password,
      salt,
      iterations,
      32,
      "sha256",
      (err, derivedKey) => {
        if (err) return reject(err);
        resolve(derivedKey.toString("base64") === hash);
      },
    );
  });
}

exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res
      .status(400)
      .json({ detail: "Please provide email and password" });

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res
        .status(401)
        .json({ detail: "No active account found with the given credentials" });
    if (user.role === "patient")
      return res
        .status(403)
        .json({ detail: "Patient login is not available." });

    let validPassword = false;
    if (user.password.startsWith("pbkdf2_sha256$")) {
      validPassword = await verifyDjangoPassword(password, user.password);
    } else {
      validPassword = await bcrypt.compare(password, user.password);
    }
    if (!validPassword)
      return res
        .status(401)
        .json({ detail: "No active account found with the given credentials" });

    const token = jwt.sign(
      { user_id: user._id.toString(), email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );
    res.json({ access: token, refresh: token });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.register = async (req, res) => {
  const { email, password, first_name, last_name, role } = req.body;
  if (!email || !password || !first_name || !last_name)
    return res.status(400).json({ detail: "Required fields missing" });
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      username: email,
      password: hashedPassword,
      first_name,
      last_name,
      role: role || "patient",
    });
    if (!role || role === "patient") {
      await PatientProfile.create({ user: user._id });
    }
    res
      .status(201)
      .json({ id: user._id, message: "User registered successfully" });
  } catch (e) {
    if (e.code === 11000)
      return res
        .status(400)
        .json({ detail: "A user with this email already exists." });
    res.status(500).json({ error: e.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.user_id).select("-password");
    if (!user) return res.status(404).json({ detail: "Not found." });
    res.json(user);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) {
    return res
      .status(400)
      .json({ detail: "Please provide old and new password" });
  }

  try {
    const user = await User.findById(req.user.user_id);
    if (!user) {
      return res.status(404).json({ detail: "User not found" });
    }

    let validPassword = false;
    if (user.password.startsWith("pbkdf2_sha256$")) {
      validPassword = await verifyDjangoPassword(oldPassword, user.password);
    } else {
      validPassword = await bcrypt.compare(oldPassword, user.password);
    }

    if (!validPassword) {
      return res.status(400).json({ detail: "Incorrect old password" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
