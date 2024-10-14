const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const bycrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
//@desc Register a user
//@route POST /api/users/register
//@access public

const registerUser = asyncHandler( async (req,res)=>{
    const {username, email, password} = req.body;

    if(!username || !email || !password){
        res.status(400);
        throw new Error("All fields are mandatory");
    }
    const userAvailable = await User.findOne({email});

    if(userAvailable){
        res.status(400);
        throw new Error("User already registered");
    }

    //Hash password
    const hashedPassword = await bycrypt.hash(password,10);
    console.log("Hashed password",hashedPassword);
    
    const user = await User.create({
        username,
        email,
        password : hashedPassword,
    });

    if(user){
        res.status(201).json({_id : user.id,email: user.email});
    }
    else{
        res.status(400);
        throw new Error("User data is not valid");
    }

    console.log(`User created ${user})`);
    res.json({message:"Register the user"});
});


//@desc Login a user
//@route GET /api/users/login
//@access public

const loginUser = asyncHandler(async (req,res)=>{
    const {email,password} = req.body;

    if(!email || !password){
        res.status(400);
        throw new Error("All fields are mandatory");
    }

    const user = await User.findOne({email});

    //compare password with hashed password

    if(user && (await bycrypt.compare(password,user.password))){
        const accessToken = jwt.sign(
            {
            user:{
                username: user.username,
                email: user.email,
                id: user.id,
            },
        },
        process.env.ACCESS_TOKEN_SECRET,
        {expiresIn : "15m"}
    )
        res.status(200).json({accessToken});
    }
    else{
        res.json(401);
        throw new Error("email or password not valid");
    }
    res.json({message:"Login the user"});
});

//@desc Current user info
//@route GET /api/users/current
//@access private

const currentUser = asyncHandler(  (req,res)=>{
    res.json(req.user);
});

module.exports = {registerUser,loginUser,currentUser};