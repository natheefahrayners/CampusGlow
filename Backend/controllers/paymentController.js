let paymentId = 1;
const payments = [];

export const fetchAllPayments = async (req, res) => {
  res.json(payments);
};

export const fetchPaymentById = async (req, res) => {
  const payment = payments.find((item) => item.id === Number(req.params.id));

  if (!payment) {
    return res.status(404).json({ message: "Payment not found" });
  }

  res.json(payment);
};

export const createPaymentHandler = async (req, res) => {
  const { order_id, amount, payment_method = "card", status = "pending" } = req.body;

  if (!order_id || amount === undefined) {
    return res.status(400).json({ message: "order_id and amount are required" });
  }

  const payment = {
    id: paymentId++,
    order_id,
    amount,
    payment_method,
    status,
    created_at: new Date().toISOString(),
  };

  payments.push(payment);
  res.status(201).json(payment);
};

export const updatePaymentHandler = async (req, res) => {
  const payment = payments.find((item) => item.id === Number(req.params.id));

  if (!payment) {
    return res.status(404).json({ message: "Payment not found" });
  }

  Object.assign(payment, req.body);
  res.json(payment);
};

export const deletePaymentHandler = async (req, res) => {
  const index = payments.findIndex((item) => item.id === Number(req.params.id));

  if (index === -1) {
    return res.status(404).json({ message: "Payment not found" });
  }

  payments.splice(index, 1);
  res.json({ message: "Payment deleted" });
};
