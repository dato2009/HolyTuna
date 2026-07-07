const Favorite = require("../models/favorite");

async function getFavoriteIds(username) {
  const favorites = await Favorite.find({ username });

  return favorites.map((f) => f.productId);
}

async function isFavorited(username, productId) {
  return (
    (await Favorite.countDocuments({
      username,
      productId,
    })) > 0
  );
}

async function toggleFavorite(username, productId) {
  const existing = await Favorite.findOne({
    username,
    productId,
  });

  if (existing) {
    await Favorite.deleteOne({ _id: existing._id });
    return false;
  }

  await Favorite.create({
    username,
    productId,
  });

  return true;
}

module.exports = {
  getFavoriteIds,
  isFavorited,
  toggleFavorite,
};