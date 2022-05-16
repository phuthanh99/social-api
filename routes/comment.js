const router = require("express").Router();
const Comment = require("../models/Comment");

//add

router.post("/", async (req, res) => {
	const newComment = new Comment(req.body);

	try {
		const savedComment = await newComment.save();
		res.status(200).json(savedComment);
	} catch (err) {
		res.status(500).json(err);
	}
});

//get

router.get("/:postId", async (req, res) => {
	try {
		const Comments = await Comment.find({
			postId: req.params.postId,
		});
		res.status(200).json(Comments);
	} catch (err) {
		res.status(500).json(err);
	}
});

module.exports = router;
