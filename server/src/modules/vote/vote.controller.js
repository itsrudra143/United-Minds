const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// 🟢 Vote on a Thread
exports.voteThread = async (req, res) => {
  const { id } = req.params; // thread id
  const { value } = req.body; // 1 or -1
  const userId = req.user?.id; // comes from JWT

  if (![1, -1].includes(value)) {
    return res
      .status(400)
      .json({ error: "Invalid vote value (must be 1 or -1)" });
  }

  try {
    const vote = await prisma.threadVote.upsert({
      where: {
        userId_threadId: {
          userId,
          threadId: parseInt(id),
        },
      },
      update: { value },
      create: { userId, threadId: parseInt(id), value },
    });

    // recompute score
    const votes = await prisma.threadVote.findMany({
      where: { threadId: parseInt(id) },
    });
    const score = votes.reduce((sum, v) => sum + v.value, 0);

    res.json({ vote, score });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// 🟢 Vote on a Reply
exports.voteReply = async (req, res) => {
  const { id } = req.params; // reply id
  const { value } = req.body;
  const userId = req.user?.id; // comes from JWT

  if (![1, -1].includes(value)) {
    return res
      .status(400)
      .json({ error: "Invalid vote value (must be 1 or -1)" });
  }

  try {
    const vote = await prisma.replyVote.upsert({
      where: {
        userId_replyId: {
          userId,
          replyId: parseInt(id),
        },
      },
      update: { value },
      create: { userId, replyId: parseInt(id), value },
    });

    // recompute score
    const votes = await prisma.replyVote.findMany({
      where: { replyId: parseInt(id) },
    });
    const score = votes.reduce((sum, v) => sum + v.value, 0);

    res.json({ vote, score });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
