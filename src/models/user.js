const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const secret = require('../config').secret

const userSchema = new mongoose.Schema({ 
    firstname: {
        type : String
    },
    lastname: {
        type : String
    },
    email: {
        type : String,  
        required: [true, 'Please enter your Email'],
        unique: true, // this is not working for some reason...
        lowercase: true,
        trim: true,
		index: true,
        validator: (v) => { // or use -> match: [/\S+@\S+\.\S+/, 'is invalid']
            if (!validator.isEmail(v)) throw Error('Email non valide!')
        }
    },
    password: {
        type : String,  
        require: true,
        validator: (v) => {
            if (!validator.isLength(v, { min: 4, max: 24 })) 
                throw Error('Le mot de passe doitêtre entre 4 et 24 caractères!')
        }
    },
    authTokens: [{
        authToken: {
            type: String,
            require: true
        }
    }]
}, {timestamps: true})

userSchema.methods.toJSON = function() {
    const user = this.toObject()

    delete user.password
    delete user.authTokens

    return user
}

userSchema.methods.generateAuthTokenAndSaveUser = async function() {
    
    const today = new Date();
    const exp = new Date(today);
    exp.setDate(today.getDate() + 60);
    
    // generate auth token
    const authToken = jwt.sign({ 
		_id: this._id.toString(),
        exp: parseInt(exp.getTime() / 1000),
	}, secret)
    this.authTokens.push({ authToken })
    await this.save()
    return authToken
}

userSchema.statics.findUser = async (email, password) => {
    try{
        const user = await User.findOne({ email })
        if (!user) throw new Error('Erreur, pas possible de se connecter!')

        const isPasswordValid = await bcrypt.compare(password, user.password)
        if (!isPasswordValid) throw new Error('Erreur, pas possible de se connecter!')

        return user
    } catch(e) {
        console.error(e)
    }
}

userSchema.pre('save', async function() {
    if(this.isModified('password')) this.password = await bcrypt.hash(this.password, 8)
})

const User = mongoose.model('User', userSchema);

module.exports = User