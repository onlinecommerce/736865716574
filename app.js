const express = require('express')
const globalErrorHandler = require('./controllers/errorController');
const app = express()
const User = require("./models/user-m");


var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const cors = require('cors')

app.use(cors())


app.use(express.json());

app.use("/vercel", async (req, res, next)=>{
    let user = await User.find({}).select("-id");
    res.status(200).json({
        status: 'success',
        user
    })
})

// authentication
const userRouter = require('./routes/user-r');
app.use('/users', userRouter);

// for categories
const category = require('./routes/category-r');
app.use('/categories', category);

// for item
const item = require('./routes/item-r');
app.use('/item', item);

// for rating
const rating = require('./routes/rating-r');
app.use('/rating', rating);

// for review
const review = require('./routes/providerreview-r');
app.use('/review', review);

app.use(globalErrorHandler);

app.use('/uploads', express.static("storage/"));


module.exports = app
