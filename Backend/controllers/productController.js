import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  softDeleteProduct,
} from "../models/productModel.js";

export const fetchAllProducts = async (req, res) => {
  try {
    const products = await getAllProducts();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Database error", error: error.message });
  }
};

export const fetchProductById = async (req, res) => {
  try {
    const product = await getProductById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Database error", error: error.message });
  }
};

export const createProductHandler = async (req, res) => {
  try {
    const { name, price } = req.body;

    if (!name || price === undefined) {
      return res.status(400).json({ message: "name and price are required" });
    }

    const created = await createProduct(req.body);
    const product = await getProductById(created.product_id);

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: "Database error", error: error.message });
  }
};

export const updateProductHandler = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const existing = await getProductById(id);

    if (!existing) {
      return res.status(404).json({ message: "Product not found" });
    }

    const merged = {
      category_id: req.body.category_id ?? existing.category_id,
      subcategory_id: req.body.subcategory_id ?? existing.subcategory_id,
      name: req.body.name ?? existing.name,
      description: req.body.description ?? existing.description,
      price: req.body.price ?? existing.price,
      image: req.body.image ?? existing.image,
      emoji: req.body.emoji ?? existing.emoji,
      stock_status: req.body.stock_status ?? existing.stock_status,
      is_active: req.body.is_active ?? existing.is_active,
    };

    await updateProduct(id, merged);
    const updated = await getProductById(id);

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Database error", error: error.message });
  }
};

export const deleteProductHandler = async (req, res) => {
  try {
    const affectedRows = await softDeleteProduct(req.params.id);

    if (!affectedRows) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ message: "Database error", error: error.message });
  }
};
