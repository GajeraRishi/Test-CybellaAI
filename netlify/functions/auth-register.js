const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// MongoDB connection
const connectToDatabase = async () => {
  if (mongoose.connection.readyState >= 1) return;
  
  return mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
};

// User model schema
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  fullName: { type: String }
});

// Initialize the model
const User = mongoose.models.User || mongoose.model('User', userSchema);

exports.handler = async (event) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Method Not Allowed' })
    };
  }

  try {
    // Parse request body
    const { email, password, fullName } = JSON.parse(event.body);

    // Connect to database
    await connectToDatabase();

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Email already in use' })
      };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      email,
      password: hashedPassword,
      fullName
    });

    // Save user to database
    await newUser.save();

    // Return success response
    return {
      statusCode: 201,
      body: JSON.stringify({
        success: true,
        user: {
          id: newUser._id.toString(),
          email: newUser.email,
          name: newUser.fullName
        }
      })
    };
  } catch (error) {
    console.error('Registration error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Server error during registration' })
    };
  }
};