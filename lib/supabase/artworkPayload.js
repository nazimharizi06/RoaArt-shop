function buildArtworkPayload(values) {
  const price = Number(values.price);
  const quantity = Number(values.quantity ?? 1);

  return {
    title: values.title,
    description: values.description || null,
    price: Number.isFinite(price) ? price : 0,
    medium: values.medium || null,
    category: values.category || null,
    quantity: Number.isFinite(quantity) ? quantity : 1,
    is_available: values.availability,
    featured: values.featured,
  };
}

module.exports = {
  buildArtworkPayload,
};
