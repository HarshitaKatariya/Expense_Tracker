const mongoose = require('mongoose')

const expenseSchema = new mongoose.Schema({
    user: {
        type : mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true 
    },
    amount :{
        type : Number,
        required : true
    },
    category :{
        type : String,
        required : true
    },
    date :{
        type : Date,
        default: Date.now
    },
    description:{
        type : String,
        default : ''
    }
},{timestamps : true})

const Expense = mongoose.model('Expense', expenseSchema);
module.exports = Expense;