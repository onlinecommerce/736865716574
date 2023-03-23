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
