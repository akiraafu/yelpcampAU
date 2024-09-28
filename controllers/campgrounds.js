const Campground = require("../models/campground")
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding")
const mapBoxToken = process.env.MAPBOX_TOKEN
const geocoder = mbxGeocoding({ accessToken: mapBoxToken })
const { cloudinary } = require("../cloudinary")

/**
 * Retrieves all campgrounds and renders the campgrounds index page.
 * @param {Object} req - The request object from Express.js.
 * @param {Object} res - The response object from Express.js.
 * @returns {Promise<void>} Renders the campgrounds index page with the retrieved campgrounds.
 */
module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({})
    res.render("campgrounds/index", {
        campgrounds,
    })
/**
 * Creates a new campground with geocoding and image processing
 * @param {Object} req - The request object containing campground data and files
 * @param {Object} res - The response object for redirecting and flashing messages
 * @param {Function} next - The next middleware function
 * @returns {Promise<void>} Redirects to the newly created campground page
 */
}

/**
 * Renders the new campground form page
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {void} Renders the 'campgrounds/new' view
 */
module.exports.renderNewForm = (req, res) => {
    res.render("campgrounds/new")
}

module.exports.createCampground = async (req, res, next) => {
    const geoData = await geocoder
        .forwardGeocode({
            /**
             * Maps uploaded files to image objects for a campground
             * @param {Object} req - The request object containing uploaded files
             * @param {Object} campground - The campground object to update with images
             * @returns {Array} An array of image objects with url and filename properties
             */
            query: req.body.campground.location,
            limit: 1,
        })
        .send()
    const campground = new Campground(req.body.campground)
    campground.geometry = geoData.body.features[0].geometry
    campground.images = req.files.map((f) => ({ url: f.path, filename: f.filename }))
    campground.author = req.user._id
    await campground.save()
    console.log(campground)
    req.flash("success", "Successfully made a new campground!")
    res.redirect(`/campgrounds/${campground._id}`)
}

/**
 * Retrieves and displays a specific campground with its reviews and authors.
 * @param {Object} req - The request object from Express.js.
 * @param {Object} res - The response object from Express.js.
 * @returns {void} Renders the campground show page or redirects if not found.
 */
module.exports.showCampground = async (req, res) => {
    const campground = await Campground.findById(req.params.id)
        .populate({ path: "reviews", populate: { path: "author" } })
        .populate("author")
    if (!campground) {
        req.flash("error", "That campground is missing!")
        res.redirect("/campgrounds")
    }
    res.render("campgrounds/show", {
        campground,
    })
}

/**
 * Renders the edit form for a campground
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @returns {void} Renders the edit form or redirects to campgrounds page
 */
module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params
    const campground = await Campground.findById(id)
    if (!campground) {
        req.flash("error", "That campground is missing!")
        /**
         * Maps an array of file objects to an array of image objects
         * @param {Array} req.files - Array of file objects from the request
         * @returns {Array} An array of image objects with url and filename properties
         */
        res.redirect("/campgrounds")
    /**
     * Updates a campground with new information and handles image uploads/deletions
     * @param {Object} req - The request object containing campground data and files
     * @param {Object} res - The response object for redirecting and flashing messages
     * @returns {Promise<void>} Redirects to the updated campground page
     */
    }
    res.render("campgrounds/edit", {
        campground,
    })
}

module.exports.updateCampground = async (req, res) => {
    const { id } = req.params
    const campground = await Campground.findByIdAndUpdate(id, {
        ...req.body.campground,
    })
    const imgs = req.files.map((f) => ({ url: f.path, filename: f.filename }))
    campground.images.push(...imgs)
    await campground.save()
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename)
        }
        await campground.updateOne({
            $pull: { images: { filename: { $in: req.body.deleteImages } } },
        })
    }
    req.flash("success", "Successfully updated campground!")
    res.redirect(`/campgrounds/${campground._id}`)
}

/**
 * Deletes a campground from the database and redirects to the campgrounds page
 * @param {Object} req - Express request object containing the campground ID in params
 * @param {Object} res - Express response object for redirecting and flashing messages
 * @returns {void} Redirects to the campgrounds page after deletion
 */
module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params
    const campground = await Campground.findById(id)
    await Campground.findByIdAndDelete(id)
    req.flash("success", "Successfully deleted campground!")
    res.redirect("/campgrounds")
}
