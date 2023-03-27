require('./config/database')()

const dotenv = require('dotenv')
const item = require('./models/item-m.js');

(function() {
  // to keep mongodb alive because I have encountered that
  // it stop the service if you didn't interact with it for 24hrs
  // so it will interact with it in 6hr interval
  setInterval(async () => {
    let res = await item.find({id: '1'})
  }, 1000 * 60 * 60 * 6);
})() 

dotenv.config({ path: './config/config.env' })

const app = require('./app')


let port = process.env.PORT;
app.listen(process.env.PORT, () => {
    console.log(`
		▛▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▜
		▌App is now running on port http://localhost:${port}   ▐
		▙▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▟
	`);
})
