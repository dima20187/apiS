

const {Schema, model, ObjectId} = require('mongoose')
const express = require('express')
const mongoose = require('mongoose')
const config = require('config')
const app = express()
const PORT = config.get('serverPort')
const authRouter = require('./routers/auth.routers')
const User = require('./models/User')
const cors = require('cors')
const MongoClient = require("mongodb").MongoClient
const mongoClient = new MongoClient(config.get('Url'));

app.use(express.json())
app.use('/api/auth', authRouter)
app.use(cors())
const start = async ()=>{    

    try{
        await mongoose.connect(config.get('Url'),{
            useNewUrlParser:true,
            useUnifiedTopology:true,
            
        })    
        const users = await User.find({})
        

        app.patch('/stock/',async(req,res)=>{   
            const di = req.query.userId
            const stock_id =Number(req.query.id)
            const ox =  await User.findById({_id:di})           
            if(ox){
               await  User.findOneAndUpdate({_id:di, "stock._id": stock_id},{$set:{"stock.$.is":false}})
            }  
         })

        app.patch('/cars/', async (req,res)=>{
            console.log(req.query.userId);
            const ox =  await User.findById({_id:req.query.userId})
            const di = req.query.userId
            if(ox){
           
            await User.findByIdAndUpdate(di,{cars: req.body})
        
        }});

        app.patch('/isVip/', async (req,res)=>{
            console.log(req.query.userId);
            const ox =  await User.findById({_id:req.query.userId})
            const di = req.query.userId
            if(ox){     
            await User.findByIdAndUpdate(di,{isVip:true})
        
        }});

        app.patch('/notVip/', async (req,res)=>{
            console.log(req.query.userId);
            const ox =  await User.findById({_id:req.query.userId})
            const di = req.query.userId
            if(ox){
               
            await User.findByIdAndUpdate(di,{isVip:false})
        
        }});

        app.get('/logn',(req,res)=>{
            res.json(users)
        })

        app.listen(PORT,()=>{
            console.log('Server start,' +  PORT)
        })
    }catch(err){
       console.log("message" + err)

    }
}

start()