const { User } = require('../model/user');
const jwt = require('jsonwebtoken');

const signup = async (req, res) => {
    const { name, email, password, profileImage } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({
            msg: "All fields are required"
        })
    }
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ msg: 'User already exists' });

        const newUser = new User({ name, email, password, profileImage });
        await newUser.save();

        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.status(201).json({
            msg: 'User created successfully',
            user: newUser,
            token
        });
    } catch (e) {
        res.status(500).json({ msg: `Error creating user: ${e.message}` });
    }
};

const signin = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({
            msg: "All fields are required"
        })
    }
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ msg: 'User does not exist' });

        const isMatch = await user.comparePassword(password);
        if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.status(200).json({
            msg: 'User signin  successfully',
            user,
            token
        });
    } catch (e) {
        res.status(500).json({ msg: `Error signing in: ${e.message}` });
    }
};

const getUserInfo = async (req, res) =>{
    try{
        const user = await User.findById(req.user.id).select('-password');
        

        if(!user){
            return res.status(404).json({msg: 'User not found'});
        }
        res.status(200).json(user);

    }catch(e){
        res.status(500).json({ msg: `Error getting user info: ${e.message} ` });
    }
}

module.exports = { signup, signin, getUserInfo };
 