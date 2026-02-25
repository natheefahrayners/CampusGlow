let discountId = 1;
const discounts = [];

export const fetchAllDiscounts = async (req, res) => {
  res.json(discounts);
};

export const fetchDiscountById = async (req, res) => {
  const discount = discounts.find((item) => item.id === Number(req.params.id));

  if (!discount) {
    return res.status(404).json({ message: "Discount not found" });
  }

  res.json(discount);
};

export const createDiscountHandler = async (req, res) => {
  const { code, percentage } = req.body;

  if (!code || percentage === undefined) {
    return res.status(400).json({ message: "code and percentage are required" });
  }

  const discount = {
    id: discountId++,
    code,
    percentage,
    is_active: true,
    created_at: new Date().toISOString(),
  };

  discounts.push(discount);
  res.status(201).json(discount);
};

export const updateDiscountHandler = async (req, res) => {
  const discount = discounts.find((item) => item.id === Number(req.params.id));

  if (!discount) {
    return res.status(404).json({ message: "Discount not found" });
  }

  Object.assign(discount, req.body);
  res.json(discount);
};

export const deleteDiscountHandler = async (req, res) => {
  const index = discounts.findIndex((item) => item.id === Number(req.params.id));

  if (index === -1) {
    return res.status(404).json({ message: "Discount not found" });
  }

  discounts.splice(index, 1);
  res.json({ message: "Discount deleted" });
};
