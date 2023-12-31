const mongoose= require('mongoose');
const Schema= mongoose.Schema;
const Comments=new Schema({
    username:{type:String},
    username_sign:{type:String},
    avatar:{type:String},
    comment:{type:String}
})
const Post= new Schema({ 
    username:{type:String},
    username_sign:{type:String},
    avatar:{type:String},
    date:{type:Date ,default:Date.now},
    location:{type:String},
    job:{type:String},
    startday:{type:Date},
    enday:{type:Date},
    experience:{type:Number},
    lowest_salary:{type:Number},
    highest_salary:{type:Number},
    decripstion:{type:String},
    images:{type:Array},
    listComments:[{type:Comments}]
});
module.exports = mongoose.model('Post',Post);