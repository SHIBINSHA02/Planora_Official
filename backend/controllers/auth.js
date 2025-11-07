// backend/controllers/auth.js

const registerUser = async (name, email, password) => {
    try {
        const user = new User({ name, email, password });
        await user.save();
        console.log('User registered:', user);
    } catch (error) {
        console.error('Registration failed:', error.message);
    }
};


const User =require('../models/auth');

exports.newUser = async(req,res) =>{
    try{
        const {name,email,password} =req.body;
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields: name, email, and password.'
            });

        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: 'A user with this email address already exists.'
            });
        }

        const user = new User({
            name,
            email,
            password
        });

        const savedUser = await user.save();
        res.status(201).json({
            success: true,
            message: 'User registered successfully!',
            user: {
                id: savedUser._id,
                name: savedUser.name,
                email: savedUser.email,
                createdAt: savedUser.createdAt
            }
        });
    } catch (error) {
        
        console.error('Registration failed:', error.message);
        res.status(500).json({
            success: false,
            message: 'Server error during user registration.',
            error: error.message
        });
    }
}
