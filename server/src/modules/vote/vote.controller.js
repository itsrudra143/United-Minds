const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Original combined method (kept for backward compatibility)
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

    const voteCounts = await getThreadVoteCounts(parseInt(id));
    res.json({
      vote,
      ...voteCounts,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// New upvote thread method
exports.upvoteThread = async (req, res) => {
  const { id } = req.params;
  const userId = req.user?.id;

  try {
    const vote = await prisma.threadVote.upsert({
      where: {
        userId_threadId: {
          userId,
          threadId: parseInt(id),
        },
      },
      update: { value: 1 },
      create: { userId, threadId: parseInt(id), value: 1 },
    });

    const voteCounts = await getThreadVoteCounts(parseInt(id));
    res.json({
      vote,
      ...voteCounts,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// New downvote thread method
exports.downvoteThread = async (req, res) => {
  const { id } = req.params;
  const userId = req.user?.id;

  try {
    const vote = await prisma.threadVote.upsert({
      where: {
        userId_threadId: {
          userId,
          threadId: parseInt(id),
        },
      },
      update: { value: -1 },
      create: { userId, threadId: parseInt(id), value: -1 },
    });

    const voteCounts = await getThreadVoteCounts(parseInt(id));
    res.json({
      vote,
      ...voteCounts,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// Original combined method for replies (kept for backward compatibility)
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

    const voteCounts = await getReplyVoteCounts(parseInt(id));
    res.json({
      vote,
      ...voteCounts,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// New upvote reply method
exports.upvoteReply = async (req, res) => {
  const { id } = req.params;
  const userId = req.user?.id;

  try {
    const vote = await prisma.replyVote.upsert({
      where: {
        userId_replyId: {
          userId,
          replyId: parseInt(id),
        },
      },
      update: { value: 1 },
      create: { userId, replyId: parseInt(id), value: 1 },
    });

    const voteCounts = await getReplyVoteCounts(parseInt(id));
    res.json({
      vote,
      ...voteCounts,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// New downvote reply method
exports.downvoteReply = async (req, res) => {
  const { id } = req.params;
  const userId = req.user?.id;

  try {
    const vote = await prisma.replyVote.upsert({
      where: {
        userId_replyId: {
          userId,
          replyId: parseInt(id),
        },
      },
      update: { value: -1 },
      create: { userId, replyId: parseInt(id), value: -1 },
    });

    const voteCounts = await getReplyVoteCounts(parseInt(id));
    res.json({
      vote,
      ...voteCounts,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// Helper function to get thread vote counts
async function getThreadVoteCounts(threadId) {
  const votes = await prisma.threadVote.findMany({
    where: { threadId },
  });

  const upvotes = votes.filter((v) => v.value === 1).length;
  const downvotes = votes.filter((v) => v.value === -1).length;
  const score = votes.reduce((sum, v) => sum + v.value, 0);

  return { upvotes, downvotes, score };
}

// Helper function to get reply vote counts
async function getReplyVoteCounts(replyId) {
  const votes = await prisma.replyVote.findMany({
    where: { replyId },
  });

  const upvotes = votes.filter((v) => v.value === 1).length;
  const downvotes = votes.filter((v) => v.value === -1).length;
  const score = votes.reduce((sum, v) => sum + v.value, 0);

  return { upvotes, downvotes, score };
}
