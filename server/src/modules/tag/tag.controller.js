const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Create Tag
exports.createTag = async (req, res) => {
  const { name } = req.body;
  try {
    const tag = await prisma.tag.create({
      data: { name },
    });
    res.status(201).json(tag);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get All Tags
exports.getTags = async (req, res) => {
  try {
    const tags = await prisma.tag.findMany();
    res.json(tags);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
