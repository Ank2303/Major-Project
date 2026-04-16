require("dotenv").config();
const mongoose = require("mongoose");
const Listing = require("./models/listing");
async function updateCategory(){
    await mongoose.connect(process.env.ATLASDB_URL);
    const listings=await Listing.find({});
    for (let listing of listings) {
  let title = listing.title.toLowerCase();
  let category = "Trending";

  if (title.includes("cottage")) category = "Cottage";
  else if (title.includes("beach")) category = "Beaches";
  else if (title.includes("mountain")) category = "Mountains";
  else if (title.includes("city") || title.includes("cities")) category = "Iconic Cities";
  else if (title.includes("villa")) category = "Villa";
  else if (title.includes("treehouse")) category = "Treehouse";
  else if (title.includes("castle")) category = "Castle";
  else if (title.includes("chalet")) category = "Chalet";
  else if (title.includes("cabin")) category = "Cabin";
  else if (title.includes("apartment")) category = "Apartment";
  else if (title.includes("oasis")) category = "Oasis";

console.log("Updating:", listing.title, "→", category);
  await Listing.findByIdAndUpdate(listing._id, { category });
}
 console.log("Updated categories!");
  mongoose.connection.close();
}
updateCategory();