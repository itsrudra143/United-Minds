const prisma = require("../../db/client");

exports.createReply = async (req, res) => {
  try {
    const { thread_id, content, parent_id } = req.body;
    if (!thread_id || !content) {
      return res
        .status(400)
        .json({ error: "thread_id and content are required" });
    }

    const thread = await prisma.thread.findUnique({
      where: { id: Number(thread_id) },
    });
    if (!thread) return res.status(404).json({ error: "Thread not found" });

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

    const thread = await prisma.thread.findUnique({ where: { id: threadId } });
    if (!thread) return res.status(404).json({ error: "Thread not found" });

    const where = { threadId, parentId };

    const [total, items] = await Promise.all([
      prisma.reply.count({ where }),
      prisma.reply.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          author: { select: { id: true, name: true, avatarUrl: true } },
          children: {
            orderBy: { createdAt: "asc" },
            include: {
              author: { select: { id: true, name: true, avatarUrl: true } },
            },
            take: 5,
          },
          votes: true,
        },
      }),
    ]);

    const withScore = items.map((item) => {
      const upvotes = item.votes.filter((v) => v.value === 1).length;
      const downvotes = item.votes.filter((v) => v.value === -1).length;
      const score = item.votes.reduce((sum, v) => sum + v.value, 0);
      return {
        ...item,
        upvotes,
        downvotes,
        score,
      };
    });

    res.json({ page, limit, total, items: withScore });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getReplyById = async (req, res) => {
  try {
    const id = Number(req.params.id);
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
        votes: true,
      },
    });

    if (!reply) return res.status(404).json({ error: "Reply not found" });

    const upvotes = reply.votes.filter((v) => v.value === 1).length;
    const downvotes = reply.votes.filter((v) => v.value === -1).length;
    const score = reply.votes.reduce((sum, v) => sum + v.value, 0);

    const withScore = {
      ...reply,
      upvotes,
      downvotes,
      score,
    };

    res.json(withScore);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
