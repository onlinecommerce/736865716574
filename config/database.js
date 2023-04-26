const connectDataBase = () => {
  // const MONGO_URL = "mongodb+srv://mulerfrommarss:12I9FtwXhg4X4YbE@onlineshopping.ulu8wue.mongodb.net/?retryWrites=true&w=majority";
  const MONGO_URL = "mongodb://localhost:27017/foodPrice";
  const mongoose = require('mongoose')

  mongoose.Promise = global.Promise;
  mongoose.connect(MONGO_URL, {
    useNewUrlParser: true
  }).then(
    () => {
      console.log('Database is connected')
    },
    err => {
      console.log('Can not connect to the database' + err)
    }
  );
}

module.exports = connectDataBase
