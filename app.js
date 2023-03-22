const express = require('express')
const globalErrorHandler = require('./controllers/errorController');
const app = express()


var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const cors = require('cors')

app.use(cors())


app.use(express.json());

app.use("/vercel", (req, res, next)=>{
    res.status(200).json({
        status: 'success',
        message: "Vercel works"
    })
})

// authentication
const userRouter = require('./routes/user-r');
app.use('/api/v1/users', userRouter);

// for categories
const category = require('./routes/category-r');
app.use('/api/v1/categories', category);

// for item
const item = require('./routes/item-r');
app.use('/api/v1/item', item);

// for rating
const rating = require('./routes/rating-r');
app.use('/api/v1/rating', rating);

// for review
const review = require('./routes/providerreview-r');
app.use('/api/v1/review', review);

app.use(globalErrorHandler);

app.use('/api/v1/uploads', express.static("storage/"));


module.exports = app
