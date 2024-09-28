mapboxgl.accessToken = mapToken
const map = new mapboxgl.Map({
    container: "cluster-map",
    style: "mapbox://styles/mapbox/light-v10",
    center: [133.86, -25.95],
    zoom: 3,
})

map.addControl(new mapboxgl.NavigationControl())

/**
 * Sets up a Mapbox GL JS map with clustered campground data and interactive features
 * @param {Object} map - The Mapbox GL JS map instance
 * @param {Object} campgrounds - GeoJSON data of campground locations
 * @returns {void} This function doesn't return a value, it modifies the map instance
 */
map.on("load", () => {
    // console.log("map loaded!")
    // Add a new source from our GeoJSON data and
    // set the 'cluster' option to true. GL-JS will
    // add the point_count property to your source data.
    map.addSource("campgrounds", {
        type: "geojson",
        // Point to GeoJSON data. This example visualizes all M1.0+ earthquakes
        // from 12/22/15 to 1/21/16 as logged by USGS' Earthquake hazards program.
        data: campgrounds,
        cluster: true,
        clusterMaxZoom: 14, // Max zoom to cluster points on
        clusterRadius: 50, // Radius of each cluster when clustering points (defaults to 50)
    })

    map.addLayer({
        id: "clusters",
        type: "circle",
        source: "campgrounds",
        filter: ["has", "point_count"],
        paint: {
            // Use step expressions (https://docs.mapbox.com/mapbox-gl-js/style-spec/#expressions-step)
            // with three steps to implement three types of circles:
            //   * Blue, 20px circles when point count is less than 100
            //   * Yellow, 30px circles when point count is between 100 and 750
            //   * Pink, 40px circles when point count is greater than or equal to 750
            "circle-color": [
                "step",
                ["get", "point_count"],
                "#a7c957",
                10,
                "#6a994e",
                30,
                "#386641",
            ],
            "circle-radius": ["step", ["get", "point_count"], 15, 10, 20, 30, 25],
        },
    })

    map.addLayer({
        id: "cluster-count",
        type: "symbol",
        source: "campgrounds",
        filter: ["has", "point_count"],
        layout: {
            "text-field": "{point_count_abbreviated}",
            "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
            "text-size": 12,
        },
    })

    map.addLayer({
        id: "unclustered-point",
        type: "circle",
        source: "campgrounds",
        filter: ["!", ["has", "point_count"]],
        paint: {
            "circle-color": "#11b4da",
            "circle-radius": 4,
            "circle-stroke-width": 1,
            "circle-stroke-color": "#fff",
        },
    })

    // inspect a cluster on click
    map.on("click", "clusters", (e) => {
        const features = map.queryRenderedFeatures(e.point, {
            layers: ["clusters"],
        })
        const clusterId = features[0].properties.cluster_id
        ```
        /**
         * Expands a cluster on the map to a zoomed-in view of its contents
         * @param {string} clusterId - The ID of the cluster to expand
         * @param {Function} callback - Callback function that receives error and zoom level
         * @returns {void} This method doesn't return a value
         */
        ```
        map.getSource("campgrounds").getClusterExpansionZoom(clusterId, (err, zoom) => {
            if (err) return

            map.easeTo({
                center: features[0].geometry.coordinates,
                zoom: zoom,
            })
        })
    })

    // When a click event occurs on a feature in
    // the unclustered-point layer, open a popup at
    // the location of the feature, with
    // description HTML from its properties.
    map.on("click", "unclustered-point", (e) => {
        /**
         * Adds a mouseenter event listener to clusters on the map
         * @param {string} "mouseenter" - The event type to listen for
         * @param {string} "clusters" - The layer ID to apply the event listener to
         * @param {Function} callback - The function to execute when the event occurs
         * @returns {undefined} This method does not return a value
         */
        // console.log("uncluster point clicked!")
        const { popUpMarkup } = e.features[0].properties
        const coordinates = e.features[0].geometry.coordinates.slice()

        // Ensure that if the map is zoomed out such that
        // multiple copies of the feature are visible, the
        // popup appears over the copy being pointed to.
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360
        }

        new mapboxgl.Popup().setLngLat(coordinates).setHTML(popUpMarkup).addTo(map)
    })

    map.on("mouseenter", "clusters", () => {
        // console.log("mousing over a cluster")
        map.getCanvas().style.cursor = "pointer"
    })
    ```
    /**
     * Handles the mouseleave event for cluster layers on the map
     * @param {string} "mouseleave" - The event type to listen for
     * @param {string} "clusters" - The name of the layer to apply the event listener to
     * @returns {void} This method doesn't return a value
     */
    ```
    map.on("mouseleave", "clusters", () => {
        map.getCanvas().style.cursor = ""
    })
})
