const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Create Category
exports.createCategory = async (req, res) => {
  const { name } = req.body;
  try {
    const category = await prisma.category.create({
      data: { name },
    });
    res.status(201).json(category);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get Categories
exports.getCategories = async (req, res) => {
  try {
    const categories = await prisma.category.findMany();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
