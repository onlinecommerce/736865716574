const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: "dmuxs0jqr",//process.env.CLOUD_NAME,
    api_key: "267245651643689",//process.env.CLOUD_KEY,
    api_secret:"h1unORd6DRKQxNUzEoEFz3JBidQ" ,//process.env.CLOUD_KEY_SECRET
});

module.exports = cloudinary;