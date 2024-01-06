const Router = require('express')
const User = require('../models/User')
const jwt = require('jsonwebtoken')
const config = require('config')
const {check, validationResult} = require('express-validator')
const bcrypt = require('bcryptjs')
const router = new Router()
const authMeddleware = require('../auth.meddleware')



router.post('/registration',
[
 check('email',"Uncorrect email").isLength({min:1 , max:12}),
 check('name',"Uncorrect name").isLength({min:3 , max:12})
 
],
    async  (req,res)=>{
    try{
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({message:'Не корректный запрос' , errors})
        }
        const {email,name} = req.body;
        console.log(name)
        const candidate = await User.findOne({email})
            if(candidate){
                return res.status(400).json({message:'Пользователь с номером '+ email +  ' уже существует'})
            }
            const user = new User({email,name})
            await user.save()
            res.json({message:"Пользователь создан" + email + name })
            
    }catch(e){
        console.log(e)
        res.send({message:"Ошибка сервера"})
    }
})

router.post('/login',
    async  (req,res)=>{
    try{
        const {email,name,isVip} = req.body
        const user = await User.findOne({email})
        if(!user){
            return res.status(404).json({message:"Пользователь не найден"})
        }
           const token = jwt.sign({id: user.id}, config.get("secretKey"), {expiresIn:"1h"})
           return res.json({
                token,
                user:{
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    isVip:user.isVip,
                    cars: user.cars,
                    stock:user.stock,
                    diskSpace: user.diskSpace,
                    usedSpace: user.usedSpace,
                    avatar: user.avatar
                }
            })
            
    }catch(e){
        console.log(e)
        res.send({message:"Ошибка сервера"})
    }
})


router.get('/auth',authMeddleware,
    async  (req,res,isVip)=>{
    try{   
        const user  = await User.findOne({_id: req.user.id})
        const token = jwt.sign({id: user.id}, config.get("secretKey"), {expiresIn:"1d"})
        return res.json({
             token,
             user:{
                 id: user.id,
                 email: user.email,
                 name: user.name,
                 isVip:user.isVip,
                 cars: user.cars,
                 stock:user.stock,
                 diskSpace: user.diskSpace,
                 usedSpace: user.usedSpace,
                 avatar: user.avatar
             }
         })
    }catch(e){
        console.log(e)
        res.send({message:"Ошибка сервера"})
    }
})

router.get('/cars',authMeddleware,
    async  (req,res)=>{
    try{   
        const user  = await User.findOne({_id:req.user.id})
        if(!user){
            return res.status(404).json({message:"Пользователь не найден"})
        }
        return res.json({
             user:{
                 id:user.id,
                 cars:user.cars,
             }
         })
    }catch(e){
        console.log(e)
        res.send({message:"Ошибка сервера"})
    }
})

router.get('/stock',authMeddleware,
    async  (req,res)=>{
    try{   
        const user  = await User.findOne({_id:req.user.id})
        if(!user){
            return res.status(404).json({message:"Пользователь не найден"})
        }
        return res.json({

             user:{
                 id:user.id,
                 stock:user.stock,
             }
         })
    }catch(e){
        console.log(e)
        res.send({message:"Ошибка сервера"})
    }
})





module.exports = router

