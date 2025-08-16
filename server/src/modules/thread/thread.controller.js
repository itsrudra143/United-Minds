const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Create Thread with tags
exports.createThread = async (req, res) => {
  const { title, content, categoryId, tagIds } = req.body;
  const authorId = req.user?.id || 1;

  try {
    const thread = await prisma.thread.create({
      data: {
        title,
        content,
        categoryId, // directly use this
        authorId,
        threadTags: {
          create: tagIds?.map((tagId) => ({ tagId })) || [],
        },
      },
      include: { threadTags: true },
    });

    res.status(201).json(thread);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

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

// const prisma = require("../../db/client");

exports.voteThread = async (req, res) => {
  try {
    const threadId = parseInt(req.params.id);
    const userId = req.user.id;
    const { value } = req.body; // expect 1 or -1

    if (![1, -1].includes(value)) {
      return res.status(400).json({ error: "Invalid vote value" });
    }

    const vote = await prisma.threadVote.upsert({
      where: { userId_threadId: { userId, threadId } },
      update: { value },
      create: { userId, threadId, value },
    });

    const result = await prisma.threadVote.aggregate({
      where: { threadId },
      _sum: { value: true },
    });

    res.json({ vote, score: result._sum.value || 0 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
