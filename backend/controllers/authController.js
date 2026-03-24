const User = require('../models/User');
const generateToken = require('../utils/generateToken');

const registerUser = async (req, res) => {
  console.log('=== REGISTER API CALLED ===');
  console.log('Request Body:', req.body);
  
  try {
    const { name, email, password, role } = req.body;
    
    // Check if all fields are present
    if (!name || !email || !password) {
      console.log('Missing fields:', { name, email, password });
      return res.status(400).json({ 
        message: 'Please provide name, email and password' 
      });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      console.log('User already exists:', email);
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({ name, email, password, role });

    console.log('User created successfully:', user._id);
    
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id)
    });
  } catch (error) {
    console.log('Error in register:', error.message);
    res.status(500).json({ message: error.message });
  }
};

const loginUser = async (req, res) => {
  console.log('=== LOGIN API CALLED ===');
  console.log('Request Body:', req.body);
  
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      console.log('Login successful:', email);
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id)
      });
    } else {
      console.log('Invalid credentials:', email);
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.log('Error in login:', error.message);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { registerUser, loginUser };