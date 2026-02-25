import {
  getAllOrders,
  getOrderById,
  createOrder,
  createOrderItems,
  updateOrderStatus,
  deleteOrder,
} from "../models/Order.js";

const buildOrderNumber = () => `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

export const fetchAllOrders = async (req, res) => {
  try {
    const orders = await getAllOrders();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Database error", error: error.message });
  }
};

export const fetchOrderById = async (req, res) => {
  try {
    const order = await getOrderById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: "Database error", error: error.message });
  }
};

export const createOrderHandler = async (req, res) => {
  try {
    const { user_id, total_amount, status, items = [] } = req.body;

    if (!user_id || total_amount === undefined) {
      return res.status(400).json({ message: "user_id and total_amount are required" });
    }

    const orderId = await createOrder(
      user_id,
      buildOrderNumber(),
      total_amount,
      status ?? "pending"
    );

    await createOrderItems(orderId, items);

    const order = await getOrderById(orderId);
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: "Database error", error: error.message });
  }
};

export const updateOrderStatusHandler = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: "status is required" });
    }

    const affectedRows = await updateOrderStatus(req.params.id, status);

    if (!affectedRows) {
      return res.status(404).json({ message: "Order not found" });
    }

    const order = await getOrderById(req.params.id);
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: "Database error", error: error.message });
  }
};

export const deleteOrderHandler = async (req, res) => {
  try {
    const affectedRows = await deleteOrder(req.params.id);

    if (!affectedRows) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json({ message: "Order deleted" });
  } catch (error) {
    res.status(500).json({ message: "Database error", error: error.message });
  }
};
