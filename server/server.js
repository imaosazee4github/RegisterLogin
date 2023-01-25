const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();




const userRoute = require('./route/userRoute');
const app = express();

const jwtSecret = process.env.JWT_SECRET;

mongoose.connect(process.env.MONGO_URL, {useNewUrlParser: true, useUnifiedTopology: true})
const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('Connected to Database'));

app.use(cors());
app.use(express.json())
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

const port = process.env.PORT || 4000;

//clapp.use('/api', userRoute);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
}
)

const User = require('./model/userModel');

app.post("/register", async(req, res) => {
    const {name, email, password} = req.body;
    const hashedPassword = await bcrypt.hash(password, 12);
    try {
        const user = olduser = User.findOne({email});
        if (oldUser)
            return res.status(200).json({message: "User already exists"});

    
        await User.create({name, 
            email, 
            password: hashedPassword,
        });
        res.status(201).json({message: "User created successfully"});

    }catch (error) {
        res.status(500).json({message: "Error creating user"});
    }

});

app.post("/login", async(req, res) => {
    const { email, password } = req.body;
        const user = await User.findOne ({email});
        if (!user) {
            return res.status(400).json({message: "User does not exist"});
        }

       if (await bcrypt.compare(password, user.password)){
        const token = jwt.sign({}, jwtSecret) 

        res.status (200).json({message: "User logged in successfully", token});
      

       } else {
              res.status(404).json({message: "password or email not found"});
         }

         res.status(500).json({message: "User logged in successfully"});

    });
