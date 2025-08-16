const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.voteThread = async (req, res) => {
  const { id } = req.params;
  const { value } = req.body;
  const userId = req.user?.id;

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

exports.voteReply = async (req, res) => {
  const { id } = req.params;
  const { value } = req.body;
  const userId = req.user?.id;

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
