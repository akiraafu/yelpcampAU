const mongoose = require("mongoose")
const review = require("./review")
const Schema = mongoose.Schema

const ImageSchema = new Schema({
    url: String,
    filename: String,
})

/**
 * Generates a thumbnail URL from the original image URL
 * @returns {string} The URL of the thumbnail image with width set to 150 pixels
 */
ImageSchema.virtual("thumbnail").get(function () {
    return this.url.replace("upload", "upload/w_150")
})

const opts = { toJSON: { virtuals: true } }

const CampgroundSchema = new Schema(
    {
        title: String,
        images: [ImageSchema],
        geometry: {
            type: {
                type: String,
                enum: ["Point"],
                required: true,
            },
            coordinates: {
                type: [Number],
                required: true,
            },
        },

        price: Number,
        description: String,
        location: String,
        author: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        reviews: [
            {
                type: Schema.Types.ObjectId,
                ref: "Review",
            },
        ],
    },
    opts
)

/**
 * Generates a virtual property 'popUpMarkup' for the CampgroundSchema
 * @returns {string} HTML markup for a popup, containing a link to the campground and a truncated description
 */
CampgroundSchema.virtual("properties.popUpMarkup").get(function () {
    return `<strong><a href='/campgrounds/${this._id}'>${this.title}</a></strong>
    <p>${this.description.substring(0, 20)}...</p>`
})

/**
 * Middleware function to delete associated reviews when a campground is deleted
 * @param {Object} doc - The deleted campground document
 * @returns {Promise<void>} A promise that resolves when all associated reviews are deleted
 */
CampgroundSchema.post("findOneAndDelete", async function (doc) {
    if (doc) {
        await review.deleteMany({
            _id: {
                $in: doc.reviews,
            },
        })
    }
})

module.exports = mongoose.model("Campground", CampgroundSchema)
