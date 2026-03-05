const mongoose = require("mongoose");
const Listing = require("./models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
require("dotenv").config();

const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");

async function fixOldListings() {
  const listings = await Listing.find({});

  for (let listing of listings) {
    if (!listing.geometry || !listing.geometry.coordinates || listing.geometry.coordinates.length === 0) {
      
      try {
        let response = await geocodingClient.forwardGeocode({
          query: listing.location,
          limit: 1
        }).send();

        if (response.body.features.length > 0) {
          listing.geometry = response.body.features[0].geometry;
          await listing.save();
          console.log("Updated:", listing.title);
        } else {
          console.log("Location not found:", listing.title);
        }

      } catch (err) {
        console.log("Error updating:", listing.title);
      }
    }
  }

  console.log(" All old listings fixed!");
  mongoose.connection.close();
}

fixOldListings();