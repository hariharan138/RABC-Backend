const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstname: {
        required: true,
        type: String,
        minlength: 3,
        maxlength: 20
    },
    lastname: {
        required: true,
        type: String,

    },
    email: {
        required: true,
        type: String,
        unique: true
    },
    mobile: {
        required: true,
        type: Number,
        minlength: 10,
        maxlength: 10
    },
    password: {
        required: true,
        type: String,
        minlength: 6
    },
    gender: {
        required: true,
        type: String,
        enum: ["male", "female", "others"]
    },
    role: {
        required: true,
        type: String,
    },
        status: {
        type: String,
    }
}, {
    versionKey: false,
    timestamps: true
});

module.exports = mongoose.model("User", userSchema);

