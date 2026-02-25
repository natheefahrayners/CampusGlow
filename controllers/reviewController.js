let reviewId = 1;
const reviews = [];

export const fetchAllReviews = async (req, res) => {
  res.json(reviews);
};

export const fetchReviewById = async (req, res) => {
  const review = reviews.find((item) => item.id === Number(req.params.id));

  if (!review) {
    return res.status(404).json({ message: "Review not found" });
  }

  res.json(review);
};

export const createReviewHandler = async (req, res) => {
  const { product_id, user_id, rating, comment = "" } = req.body;

  if (!product_id || !user_id || rating === undefined) {
    return res
      .status(400)
      .json({ message: "product_id, user_id and rating are required" });
  }

  const review = {
    id: reviewId++,
    product_id,
    user_id,
    rating,
    comment,
    created_at: new Date().toISOString(),
  };

  reviews.push(review);
  res.status(201).json(review);
};

export const updateReviewHandler = async (req, res) => {
  const review = reviews.find((item) => item.id === Number(req.params.id));

  if (!review) {
    return res.status(404).json({ message: "Review not found" });
  }

  Object.assign(review, req.body);
  res.json(review);
};

export const deleteReviewHandler = async (req, res) => {
  const index = reviews.findIndex((item) => item.id === Number(req.params.id));

  if (index === -1) {
    return res.status(404).json({ message: "Review not found" });
  }

  reviews.splice(index, 1);
  res.json({ message: "Review deleted" });
};
