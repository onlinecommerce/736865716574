// const express = require("express");
// const app = express();

// app.use(express.json());

// app.use("/home", (req, res, next) => {
// 	res.status(200).json({
// 		status: "success",
// 		message: "This works just fine"
// 	})
// });

// const PORT = 4000;
// app.listen(PORT, () => console.log(`running on port: ${PORT}`));

const connectDataBase = require('./config/database')

const dotenv = require('dotenv')

dotenv.config({ path: './config/config.env' })

const app = require('./app')

connectDataBase()

let port = process.env.PORT;
app.listen(process.env.PORT, () => {
    console.log(`
		▛▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▜
		▌App is now running on port http://localhost:${port}   ▐
		▙▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▟
	`);
})
