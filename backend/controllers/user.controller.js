import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

const generateToken = (user) =>
  jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );

export const register = async (req, res) => {
  try {
    const { name, email, phone, password, role } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({ message: 'All fields required' });
    }

    const exists = await User.findOne({ $or: [{ email }, { phone }] });
    if (exists) {
      return res.status(409).json({ message: 'User already exists' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      phone,
      passwordHash,
      role: role || 'buyer',
      isSeller: role === 'seller',
    });

    const token = generateToken(user);

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
        onboardingCompleted: user.onboardingCompleted,
      },
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });

    const token = generateToken(user);

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
        isSeller: user.isSeller,
        onboardingCompleted: user.onboardingCompleted,
      },
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// export const me = async (req, res) => {
//   const user = await User.findById(req.user.id).select('-passwordHash');
//   res.json(user);
// };
export const me = async (req, res) => {
  const user = await User.findById(req.user.id)
    .select("-passwordHash");

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json({
    id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    isSeller: user.role === "seller",
    onboardingCompleted: user.onboardingCompleted,
    createdAt: user.createdAt,
  });
};


export const completeOnboarding = async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.user.id,
    { onboardingCompleted: true },
    { new: true }
  ).select('-passwordHash');

  res.json(user);
};
