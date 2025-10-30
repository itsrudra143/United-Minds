const prisma = require("../../db/client");

// Create a repost
exports.createRepost = async (req, res) => {
  try {
    const { threadId, comment } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: "You must be logged in to repost" });
    }

    if (!threadId) {
      return res.status(400).json({ error: "threadId is required" });
    }

    // Check if thread exists
    const thread = await prisma.thread.findUnique({
      where: { id: Number(threadId) },
    });

    if (!thread) {
      return res.status(404).json({ error: "Thread not found" });
    }

    // Check if user has already reposted this thread
    const existingRepost = await prisma.repost.findUnique({
      where: {
        userId_threadId: {
          userId: Number(userId),
          threadId: Number(threadId),
        },
      },
    });

    if (existingRepost) {
      return res
        .status(400)
        .json({ error: "You have already reposted this thread" });
    }

    // Create the repost
    const repost = await prisma.repost.create({
      data: {
        userId: Number(userId),
        threadId: Number(threadId),
        comment: comment || null,
      },
      include: {
        user: {
          select: { id: true, name: true, avatarUrl: true },
        },
        thread: {
          include: {
            author: { select: { id: true, name: true, avatarUrl: true } },
            category: true,
            threadTags: { include: { tag: true } },
            votes: true,
            _count: { select: { replies: true } },
          },
        },
      },
    });

    // Calculate the score for the thread
    const threadWithScore = {
      ...repost.thread,
      score: repost.thread.votes.reduce((sum, v) => sum + v.value, 0),
      upvotes: repost.thread.votes.filter((v) => v.value === 1).length,
      downvotes: repost.thread.votes.filter((v) => v.value === -1).length,
    };

    // Return the repost with thread score included
    res.status(201).json({
      ...repost,
      thread: threadWithScore,
    });
  } catch (error) {
    console.error("Error creating repost:", error);
    res.status(500).json({ error: error.message });
  }
};

// Get reposts by user
exports.getUserReposts = async (req, res) => {
  try {
    const { userId } = req.params;
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 10);

    const reposts = await prisma.repost.findMany({
      where: { userId: Number(userId) },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        user: {
          select: { id: true, name: true, avatarUrl: true },
        },
        thread: {
          include: {
            author: { select: { id: true, name: true, avatarUrl: true } },
            category: true,
            threadTags: { include: { tag: true } },
            votes: true,
            _count: { select: { replies: true } },
          },
        },
      },
    });

    // Calculate scores for each thread
    const repostsWithScores = reposts.map((repost) => {
      const threadWithScore = {
        ...repost.thread,
        score: repost.thread.votes.reduce((sum, v) => sum + v.value, 0),
        upvotes: repost.thread.votes.filter((v) => v.value === 1).length,
        downvotes: repost.thread.votes.filter((v) => v.value === -1).length,
      };

      return {
        ...repost,
        thread: threadWithScore,
      };
    });

    const totalReposts = await prisma.repost.count({
      where: { userId: Number(userId) },
    });

    res.json({
      page,
      limit,
      total: totalReposts,
      reposts: repostsWithScores,
    });
  } catch (error) {
    console.error("Error fetching user reposts:", error);
    res.status(500).json({ error: error.message });
  }
};

// Get reposts for a thread
exports.getThreadReposts = async (req, res) => {
  try {
    const { threadId } = req.params;
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 10);

    const reposts = await prisma.repost.findMany({
      where: { threadId: Number(threadId) },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        user: {
          select: { id: true, name: true, avatarUrl: true },
        },
      },
    });

    const totalReposts = await prisma.repost.count({
      where: { threadId: Number(threadId) },
    });

    res.json({
      page,
      limit,
      total: totalReposts,
      reposts,
    });
  } catch (error) {
    console.error("Error fetching thread reposts:", error);
    res.status(500).json({ error: error.message });
  }
};

// Delete a repost
exports.deleteRepost = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res
        .status(401)
        .json({ error: "You must be logged in to delete a repost" });
    }

    // Find the repost
    const repost = await prisma.repost.findUnique({
      where: { id: Number(id) },
    });

    if (!repost) {
      return res.status(404).json({ error: "Repost not found" });
    }

    // Check if user owns the repost
    if (repost.userId !== Number(userId)) {
      return res
        .status(403)
        .json({ error: "You can only delete your own reposts" });
    }

    // Delete the repost
    await prisma.repost.delete({
      where: { id: Number(id) },
    });

    res.json({ message: "Repost deleted successfully" });
  } catch (error) {
    console.error("Error deleting repost:", error);
    res.status(500).json({ error: error.message });
  }
};
