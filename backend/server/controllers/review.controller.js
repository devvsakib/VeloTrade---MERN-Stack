import Review from "../models/Review.js";

export const getProductReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ productId: req.params.productId }).populate(
            "userId",
            "name"
        );
        res.json(reviews);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const addReview = async (req, res) => {
    try {
        const { rating, comment } = req.body;

        let review = await Review.findOne({
            productId: req.params.productId,
            userId: req.user._id
        });

        if (review) {
            review.rating = rating;
            review.comment = comment;
            await review.save();
        } else {
            review = await Review.create({
                productId: req.params.productId,
                userId: req.user._id,
                rating,
                comment
            });
        }

        res.json(review);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
