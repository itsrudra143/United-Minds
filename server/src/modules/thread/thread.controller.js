const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Create Thread with tags
exports.createThread = async (req, res) => {
  const { title, content, category_id, tags } = req.body;
  const authorId = req.user?.id || 1; // replace 1 with auth user ID if using auth

  try {
    const thread = await prisma.thread.create({
      data: {
        title,
        content,
        categoryId: category_id,
        authorId,
        threadTags: {
          create: (Array.isArray(tags) ? tags : []).map((tagId) => ({ tagId })),
        },
      },
      include: { threadTags: true },
    });

    res.status(201).json(thread);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all threads (paginated, latest first)
exports.getThreads = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const categoryId = req.query.category_id;
  const tagName = req.query.tag;

  const where = {};

  if (categoryId) where.categoryId = parseInt(categoryId);

  try {
    let threads;
    if (tagName) {
      threads = await prisma.thread.findMany({
        where: {
          threadTags: {
            some: {
              tag: { name: tagName },
            },
          },
        },
        include: { threadTags: { include: { tag: true } }, category: true },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      });
    } else {
      threads = await prisma.thread.findMany({
        where,
        include: { threadTags: { include: { tag: true } }, category: true },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      });
    }

    res.json(threads);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get single thread by ID
exports.getThreadById = async (req, res) => {
  const { id } = req.params;
  try {
    const thread = await prisma.thread.findUnique({
      where: { id: parseInt(id) },
      include: { threadTags: { include: { tag: true } }, category: true },
    });

    if (!thread) return res.status(404).json({ error: "Thread not found" });
    res.json(thread);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
