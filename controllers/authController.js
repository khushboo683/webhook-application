import User from '../models/user.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const register = async(req,res)=>{
    try{
    const {email,password} = req.body;
    let user = await User.findOne({email:email});
    if(user){
        res.status(400).json({msg:'User already registered. Please login.'});
        return;
    }
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password,salt);
    user = new User({
        email:email,
        password:hash
    })
    await user.save();
    res.status(201).json(user);
    }catch(err){
        res.status(500).json(err);
        throw err;
    }
}

export const login = async(req,res)=>{
    try{
        const {email,password} = req.body;
        const user = await User.findOne({email:email});
        if(!user){
          res.status(400).json({msg:'User not registered.'})
          return;
        }
        const isMatch= await bcrypt.compare(password,user.password);
        if(!isMatch){
            res.status(400).json({msg:'Incorrect credentials.'})
            return;
        }
        const payload ={id:user.id};
        const token = jwt.sign(payload,process.env.JWT_SECRET_KEY,{expiresIn:'1h'});
        res.status(201).json({msg:'Successfully logged in.',token:token})
    }
    catch(err){
        res.status(500).json(err);
        throw err;
    }
}