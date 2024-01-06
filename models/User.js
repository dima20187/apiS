const {Schema, model, ObjectId} = require('mongoose')


const User = new Schema({
    email: {type: String, required: true, unique: true},
    cars: {type: Array},
    name: {type: String, required: true},
    isVip:{type: Boolean,default:false},
    stock: {type: Array,default:[{
        _id: 1,
        name: "Бесплатная замена масла",
        is: true,
    },{
        _id: 2,
        name: "Бесплатная диагностика подвески",
        is: true,
    },{
        _id: 3,
        name: "Бесплатная удаление сколов",
        is: true,
    },{
        _id: 4,
        name: "Скидка 20% на слесарные работы",
        is: true,
    }]},
    diskSpace: {type: Number, default: 1024**3*10},
    usedSpace: {type: Number, default: 0},
   
}) 
module.exports = model('User', User)