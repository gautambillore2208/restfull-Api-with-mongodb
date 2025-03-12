// const mongoose = require("mongoose");
import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    firstName:String,
    lastName:String,
    hobby:Array,

});


const user= mongoose.model("User",userSchema);

export default user