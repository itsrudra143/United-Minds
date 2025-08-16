const prisma = require("../../db/client");

/**
 * POST /api/replies
 * Body: { thread_id: number, content: string, parent_id?: number }
 * Auth required
 */
exports.createReply = async (req, res) => {
  try {
    const { thread_id, content, parent_id } = req.body;
    if (!thread_id || !content) {
      return res
        .status(400)
        .json({ error: "thread_id and content are required" });
    }

    // ensure thread exists
    const thread = await prisma.thread.findUnique({
      where: { id: Number(thread_id) },
    });
    if (!thread) return res.status(404).json({ error: "Thread not found" });

    // if parent_id provided, ensure it exists and belongs to the same thread
    if (parent_id) {
      const parent = await prisma.reply.findUnique({
        where: { id: Number(parent_id) },
      });
      if (!parent)
        return res.status(400).json({ error: "parent_id is invalid" });
      if (parent.threadId !== Number(thread_id)) {
        return res
          .status(400)
          .json({ error: "Parent reply belongs to a different thread" });
      }
    }

    const authorId = req.user?.id;
    if (!authorId) return res.status(401).json({ error: "Unauthorized" });

    const reply = await prisma.reply.create({
      data: {
        content,
        threadId: Number(thread_id),
        authorId: Number(authorId),
        parentId: parent_id ? Number(parent_id) : null,
      },
      include: {
        author: { select: { id: true, name: true, avatarUrl: true } },
        parent: { select: { id: true } },
      },
    });

    res.status(201).json(reply);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * GET /api/replies/thread/:threadId?page=&limit=&parent_id=
 * - Lists replies for a thread
 * - If parent_id is provided -> list only children of that parent
 * - Else lists top-level replies (parent_id = null)
 * - Latest first, paginated
 */
exports.getThreadReplies = async (req, res) => {
  try {
    const threadId = Number(req.params.threadId);
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 10);
    const parentIdRaw = req.query.parent_id;
    const parentId =
      parentIdRaw === undefined
        ? null
        : parentIdRaw === "null"
        ? null
        : Number(parentIdRaw);

    // ensure thread exists
    const thread = await prisma.thread.findUnique({ where: { id: threadId } });
    if (!thread) return res.status(404).json({ error: "Thread not found" });

    const where = {
      threadId,
      parentId: parentId, // null for top-level; a number for children
    };

    const [total, items] = await Promise.all([
      prisma.reply.count({ where }),
      prisma.reply.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          author: { select: { id: true, name: true, avatarUrl: true } },
          // Include one level of children (if you want nested preview)
          children: {
            orderBy: { createdAt: "asc" },
            include: {
              author: { select: { id: true, name: true, avatarUrl: true } },
            },
            take: 5, // small preview; adjust if needed
          },
        },
      }),
    ]);

    res.json({
      page,
      limit,
      total,
      items,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * GET /api/replies/:id
 * - Fetch single reply with its children (one level)
 */
exports.getReplyById = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid reply ID" });
    }

    const reply = await prisma.reply.findUnique({
      where: { id },
      include: {
        author: { select: { id: true, name: true, avatarUrl: true } },
        thread: { select: { id: true, title: true } },
        parent: { select: { id: true } },
        children: {
          orderBy: { createdAt: "asc" },
          include: {
            author: { select: { id: true, name: true, avatarUrl: true } },
          },
        },
        _count: { select: { children: true } }, // ✅ count of child replies
      },
    });

    if (!reply) return res.status(404).json({ error: "Reply not found" });

    res.json(reply);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const prisma = require("../../db/client");

exports.voteReply = async (req, res) => {
  try {
    const replyId = parseInt(req.params.id);
    const userId = req.user.id;
    const { value } = req.body;

    if (![1, -1].includes(value)) {
      return res.status(400).json({ error: "Invalid vote value" });
    }

    const vote = await prisma.replyVote.upsert({
      where: { userId_replyId: { userId, replyId } },
      update: { value },
      create: { userId, replyId, value },
    });

    const result = await prisma.replyVote.aggregate({
      where: { replyId },
      _sum: { value: true },
    });

    res.json({ vote, score: result._sum.value || 0 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
