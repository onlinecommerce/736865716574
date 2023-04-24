require('./config/database')()

const item = require('./models/item-m.js');
const Category = require('./models/category-m.js');

(async function() {
  let res = await Category.countDocuments();
  if (!res) {
    let categories = require('./utils/categories');
    await Category.insertMany(categories.categories);
  }

  // to keep mongodb alive because I have encountered that
  // it stop the service if you didn't interact with it for 24hrs
  // so it will interact with it in 6hr interval, temp
  setInterval(async () => {
    let res = await item.find({ id: '1' })
  }, 1000 * 60 * 60 * 6);
})();

const app = require('./app')


// let port = process.env.PORT;
let port = 3000;
app.listen(port, () => {
  console.log(`
		▛▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▜
		▌App is now running on port http://localhost:${port}   ▐
		▙▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▟
	`);
})
