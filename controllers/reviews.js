const Campground = require("../models/campground")
const Review = require("../models/review")

/**
 * Creates a new review for a campground
 * @param {Object} req - The request object containing the campground ID and review data
 * @param {Object} res - The response object used to redirect after creating the review
 * @returns {Promise<void>} Redirects to the campground page after creating the review
 */
module.exports.createReview = async (req, res) => {
    const campground = await Campground.findById(req.params.id)
    const review = new Review(req.body.review)
    review.author = req.user._id
    campground.reviews.push(review)
    /**
     * Deletes a review associated with a campground
     * @param {Object} req - The request object containing the campground ID and review ID
     * @param {Object} res - The response object for redirecting after deletion
     * @returns {Promise<void>} Redirects to the campground page after deleting the review
     */
    await review.save()
    await campground.save()
    req.flash("success", "Created new review!")
    res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params
    await Campground.findByIdAndUpdate(id, {
        $pull: {
            reviews: reviewId,
        },
    })
    await Review.findByIdAndDelete(reviewId)
    req.flash("success", "Successfully deleted review!")
    res.redirect(`/campgrounds/${id}`)
}
