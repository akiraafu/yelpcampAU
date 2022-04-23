const mongoose = require("mongoose")
const cities = require("./cities")
const { places, descriptors } = require("./seedHelpers")
const Campground = require("../models/campground")

mongoose.connect("mongodb://localhost:27017/yelpcamp")

const db = mongoose.connection
db.on("error", console.error.bind(console, "connection error:"))
db.once("open", () => {
    console.log("Database connected")
})

const sample = (array) => array[Math.floor(Math.random() * array.length)]

const seedDB = async () => {
    await Campground.deleteMany({})
    for (let i = 0; i < 300; i++) {
        const random1000 = Math.floor(Math.random() * 543)
        const price = Math.floor(Math.random() * 25) + 10
        const camp = new Campground({
            // Your author id
            author: "625e55c713c6a75f0ef84a2c",
            location: `${cities[random1000].city}, ${cities[random1000].admin_name}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description:
                "Lorem ipsum dolor sit amet consectetur adipisicing elit. Facilis voluptate officiis dolore accusamus. Nam quae possimus nihil quas nisi cum neque beatae voluptatum? Maxime exercitationem debitis numquam odio aperiam nostrum.",
            price,
            geometry: {
                type: "Point",
                coordinates: [cities[random1000].lng, cities[random1000].lat],
            },

            images: [
                {
                    url: "https://res.cloudinary.com/dvdtu3sr1/image/upload/v1650626506/Yelpcamp/ez09kswlaltuskqjdm9j.jpg",
                    filename: "Yelpcamp/ez09kswlaltuskqjdm9j",
                },
                {
                    url: "https://res.cloudinary.com/dvdtu3sr1/image/upload/v1650626516/Yelpcamp/ahoqhlp4hrq8s7qabeqo.jpg",
                    filename: "Yelpcamp/ahoqhlp4hrq8s7qabeqo",
                },
                {
                    url: "https://res.cloudinary.com/dvdtu3sr1/image/upload/v1650626538/Yelpcamp/bljnwo5wsj1myuytkiah.jpg",
                    filename: "Yelpcamp/bljnwo5wsj1myuytkiah",
                },
            ],
        })
        await camp.save()
    }
}

seedDB().then(() => {
    mongoose.connection.close()
})
