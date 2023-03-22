const express = require("express");
const app = express();

app.use(express.json());

app.use("/home", (req, res, next) => {
	res.status(200).json({
		status: "success",
		message: "This works just fine"
	})
});

const PORT = 4000;
app.listen(PORT, () => console.log(`running on port: ${PORT}`));
