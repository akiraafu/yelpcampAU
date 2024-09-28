const User = require("../models/user")

/**
 * Renders the user registration page.
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @returns {void} Renders the "users/register" view.
 */
module.exports.renderRegister = (req, res) => {
    res.render("users/register")
}
/**
 * Logs in the registered user and redirects to the campgrounds page
 * @param {Object} registeredUser - The user object to be logged in
 * @param {Function} next - Express middleware function to pass control to the next handler
 * @returns {void} This function doesn't return a value, it redirects the user
 */

/**
 * Registers a new user and logs them in
 * @param {Object} req - Express request object containing user registration data
 * @param {Object} res - Express response object for handling the redirect
 * @returns {Promise<void>} Redirects to campgrounds page on success, or register page on failure
 */
module.exports.register = async (req, res) => {
    try {
        const { email, username, password } = req.body
        const user = new User({ email, username })
        const registeredUser = await User.register(user, password)
        req.login(registeredUser, (err) => {
            if (err) return next(err)
            req.flash("success", "welcome to Yelpcamp AU!")
            res.redirect("/campgrounds")
        })
    } catch (e) {
        req.flash("error", e.message)
        res.redirect("/register")
    }
}

/**
 * Renders the login page for users
 * @param {Object} req - The request object from Express
 * @param {Object} res - The response object from Express
 /**
  * Handles user login and redirects to the appropriate page
  * @param {Object} req - The request object containing user session and flash data
  * @param {Object} res - The response object used to redirect the user
  * @returns {void} This function does not return a value, it redirects the user
  */
 * @returns {void} Renders the login page view
 */
module.exports.renderLogin = (req, res) => {
    res.render("users/login")
}

module.exports.login = (req, res) => {
    req.flash("success", "welcome back!")
    const redirectUrl = req.session.returnTo || "/campgrounds"
    delete req.session.returnTo
    res.redirect(redirectUrl)
}

/**
 * Logs out the user and redirects to the campgrounds page
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {void} Nothing
 */
module.exports.logout = (req, res) => {
    req.logout()
    req.flash("success", "Goodbye!")
    res.redirect("/campgrounds")
}
