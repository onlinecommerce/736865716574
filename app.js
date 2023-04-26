const express = require('express')
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const sanitize = require('express-mongo-sanitize');
const xss = require("xss-clean")
const compress = require('compression');
const hpp = require('hpp');
const globalErrorHandler = require('./controllers/errorController');
const app = express()

const cors = require('cors')

app.use(cors())
app.use(function (req, res, next) {
    const allowedOrigins = ['https://front-hazel-eta.vercel.app/', 'https://front-di0l.onrender.com/', 'http://localhost:5173'];
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    } else {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header("Access-Control-Allow-credentials", true);
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, UPDATE");
    next()
})

app.use(express.json());

app.enable("trust-proxy");
app.use(helmet({
    crossOriginEmbedderPolicy: false,
    originAgentCluster: true
}));

// limiter
const limiter = rateLimit({
    max: 100,
    windowMS: 60 * 60 * 1000,
    message: "Too many request from this IP, please f-off"
});

app.use("/api", limiter);

// sanitize
app.use(sanitize());

app.use(xss());

app.use(compress());

app.use(
    hpp({
        whitelist: [
            "id",
            "_id",
            "itemId",
            "limit",
            "skip",
            "search",
            "page",
            "reviewId",
            "rate",
            "userId",
            "userName",
            "user_id",
            "role",
            "order",
            "distinct",
            "category",
            "subcategory",
            "recommand"
        ]
    })
)

app.use(express.json({
    limit: "10kb"
}));
app.use(express.urlencoded({
    extended: true,
    limit: "10kb"
}));

// authentication
const userRouter = require('./routes/user-r');
app.use('/api/user', userRouter);

// for categories
const category = require('./routes/category-r');
app.use('/api/category', category);

// for item
const item = require('./routes/item-r');
app.use('/api/item', item);

// for rating
const rating = require('./routes/rating-r');
app.use('/api/rating', rating);

// for review
const review = require('./routes/providerreview-r');
app.use('/api/review', review);

app.use(globalErrorHandler);

app.use('/uploads', express.static("storage/"));


module.exports = app