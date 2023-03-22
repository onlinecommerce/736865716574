/* const mongoose = require('mongoose');

const connectDataBase = () => {
    mongoose.connect(process.env.DB_LOCAL_URI).then(con => {
        console.log(`MongoDB connected with HOST: ${con.connection.host}`);
    })
}

module.exports = connectDataBase */


// MongoClient.connect(mongoDbUri, settings, function(err, dbref) {
// if (!err) {
//   console.log("Mongodb connected");
//   db = dbref;
// }else{
//   console.log("Error while connecting to mongoDB" + err);
// }
// });

const connectDataBase = () => {
    const MONGO_URL = "mongodb+srv://mooler_z:e2dGSpqZVkIFi1Ie@onlineshopping.ulu8wue.mongodb.net/?retryWrites=true&w=majority";
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

/* const connectDataBase = () => {
    const {
        MongoClient,
        ServerApiVersion
    } = require('mongodb');
    const uri = "mongodb+srv://mooler_z:e2dGSpqZVkIFi1Ie@onlineshopping.ulu8wue.mongodb.net/?retryWrites=true&w=majority";
    const client = new MongoClient(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverApi: ServerApiVersion.v1
    });
    client.connect(err => {
        const collection = client.db("test").collection("devices");
        console.log(collection);
        // perform actions on the collection object
        client.close();
    });
} */

module.exports = connectDataBase