const { campgroundSchema, reviewSchema } = require("./schemas.js")
const ExpressError = require("./utils/ExpressError")
const Campground = require("./models/campground")
const Review = require("./models/review")

```
/**
 * Middleware function to check if a user is logged in
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} next - The next middleware function
 * @returns {void} Redirects to login page if not authenticated, otherwise calls next middleware
 */
```
/**
 * Validates the campground data in the request body
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {void} Calls next middleware if validation passes, throws an error if validation fails
 */
module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl
        req.flash("error", "You must be signed in")
        return res.redirect("/login")
    }
    next()
}

module.exports.validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body)
    if (error) {
        /**
         * Maps error details to a single comma-separated string message
         * @param {Object} error - The error object containing details
         * @returns {string} A comma-separated string of error messages
         */
        const msg = error.details.map((el) => el.message).join(",")
        throw new ExpressError(msg, 400)
    } else {
        next()
    }
}

/**
 * Middleware function to check if the current user is the author of a campground
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {void} Calls next middleware if user is author, otherwise redirects with error message
 */
module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params
    const campground = await Campground.findById(id)
    if (!campground.author.equals(req.user._id)) {
        req.flash("error", "You do not have permission to do that!")
        return res.redirect(`/campgrounds/${id}`)
    }
    next()
}

/**
 * Middleware to check if the current user is the author of a review
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {void} Calls next middleware if user is the author, otherwise redirects
 */
module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params
    const review = await Review.findById(reviewId)
    /**
     * Validates a review request body against a predefined schema.
     * @param {Object} req - The Express request object containing the review data in the body.
     * @param {Object} res - The Express response object (not used in this function).
     * @param {Function} next - The Express next middleware function.
     * @returns {void} Calls the next middleware if validation passes, otherwise throws an ExpressError.
     */
    if (!review.author.equals(req.user._id)) {
        req.flash("error", "You do not have permission to do that!")
        return res.redirect(`/campgrounds/${id}`)
    }
    next()
}

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body)
    if (error) {
        /**
         * Maps and joins error details into a single string message
         * @param {Object} error - The error object containing details
         * @returns {string} A comma-separated string of error messages
         */
        const msg = error.details.map((el) => el.message).join(",")
        throw new ExpressError(msg, 400)
    } else {
        next()
    }
}
