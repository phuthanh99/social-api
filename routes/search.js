const router = require("express").Router();
const User = require("../models/User");

// search

router.get("/", async (req, res) => {
	// let data = await User.find({
	// 	$or: [{ usernames: { $regex: req.params.key } }],
	// });
	// res.send(data);
	const username = req.query.username;
	try {
		const user = await User.find({
			username: { $regex: username, $options: "$i" },
		});
		// const { password, updatedAt, ...other } = user._doc;
		res.status(200).json(user);
	} catch (err) {
		res.status(500).json(err);
	}
});

module.exports = router;
