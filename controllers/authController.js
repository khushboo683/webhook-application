import User from '../models/user.js';
import bcrypt from 'bcryptjs';

export const register = async(req,res)=>{
    try{
    const {email,password} = req.body;
    let user = await User.findOne({email:email});
    if(user){
        res.sendStatus(400).json({msg:'User already registered. Please login.'});
    }
    const salt = bcrypt.genSalt(10);
    const hash = bcrypt.hash(password,salt);
    user = new User({
        email:email,
        password:hash
    })
    await user.save();
    res.sendStatus(201).json(user);
    }catch(err){
        res.sendStatus(500).json({msg:err});
    }
}

export const login = async(req,res)=>{
    try{
        const {email,password} = req.body;
        const user = await User.findOne({email:email});
        if(!user){
          res.sendStatus(400).json({msg:'User not registered.'})
        }
        const isMatch= bcrypt.compare(password,user.password);
        if(!isMatch){
            res.sendStatus(400).json({msg:'Incorrect credentials.'})
        }
        const payload ={id:user.id};
        const token = jwt.sign(payload,process.env.JWT_SECRET_KEY,{expiresIn:'1h'});
        res.setHeader('Authorization', `Bearer ${token}`);
        res.sendStatus(201).json({msg:'Successfully logged in.'})
    }
    catch(err){
        res.sendStatus(500).json(err);
    }
}