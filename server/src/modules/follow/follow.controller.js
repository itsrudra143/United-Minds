const prisma = require("../../db/client");

// Follow a user
exports.followUser = async (req, res) => {
  try {
    const { followingId } = req.body;
    const followerId = req.user?.id;

    if (!followerId) {
      return res
        .status(401)
        .json({ error: "You must be logged in to follow users" });
    }

    if (!followingId) {
      return res.status(400).json({ error: "followingId is required" });
    }

    // Check if the user exists
    const user = await prisma.user.findUnique({
      where: { id: Number(followingId) },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Can't follow yourself
    if (Number(followerId) === Number(followingId)) {
      return res.status(400).json({ error: "You cannot follow yourself" });
    }

    // Check if already following
    const existingFollow = await prisma.follower.findUnique({
      where: {
        followerId_followingId: {
          followerId: Number(followerId),
          followingId: Number(followingId),
        },
      },
    });

    if (existingFollow) {
      return res
        .status(400)
        .json({ error: "You are already following this user" });
    }

    // Create the follow relationship
    const follow = await prisma.follower.create({
      data: {
        followerId: Number(followerId),
        followingId: Number(followingId),
      },
      include: {
        following: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
      },
    });

    // Get the updated follower count
    const followerCount = await prisma.follower.count({
      where: { followingId: Number(followingId) },
    });

    res.status(201).json({
      follow,
      followerCount,
      message: "Successfully followed user",
    });
  } catch (error) {
    console.error("Error following user:", error);
    res.status(500).json({ error: error.message });
  }
};

// Unfollow a user
exports.unfollowUser = async (req, res) => {
  try {
    const { followingId } = req.params;
    const followerId = req.user?.id;

    if (!followerId) {
      return res
        .status(401)
        .json({ error: "You must be logged in to unfollow users" });
    }

    if (!followingId) {
      return res.status(400).json({ error: "followingId is required" });
    }

    // Check if the follow relationship exists
    const follow = await prisma.follower.findUnique({
      where: {
        followerId_followingId: {
          followerId: Number(followerId),
          followingId: Number(followingId),
        },
      },
    });

    if (!follow) {
      return res.status(404).json({ error: "You are not following this user" });
    }

    // Delete the follow relationship
    await prisma.follower.delete({
      where: {
        id: follow.id,
      },
    });

    // Get the updated follower count
    const followerCount = await prisma.follower.count({
      where: { followingId: Number(followingId) },
    });

    res.json({
      followerCount,
      message: "Successfully unfollowed user",
    });
  } catch (error) {
    console.error("Error unfollowing user:", error);
    res.status(500).json({ error: error.message });
  }
};

// Get followers of a user
exports.getUserFollowers = async (req, res) => {
  try {
    const { userId } = req.params;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const followers = await prisma.follower.findMany({
      where: { followingId: Number(userId) },
      include: {
        follower: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
            createdAt: true,
          },
        },
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: "desc" },
    });

    const total = await prisma.follower.count({
      where: { followingId: Number(userId) },
    });

    res.json({
      page,
      limit,
      total,
      followers: followers.map((f) => f.follower),
    });
  } catch (error) {
    console.error("Error getting user followers:", error);
    res.status(500).json({ error: error.message });
  }
};

// Get users that a user is following
exports.getUserFollowing = async (req, res) => {
  try {
    const { userId } = req.params;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const following = await prisma.follower.findMany({
      where: { followerId: Number(userId) },
      include: {
        following: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
            createdAt: true,
          },
        },
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: "desc" },
    });

    const total = await prisma.follower.count({
      where: { followerId: Number(userId) },
    });

    res.json({
      page,
      limit,
      total,
      following: following.map((f) => f.following),
    });
  } catch (error) {
    console.error("Error getting user following:", error);
    res.status(500).json({ error: error.message });
  }
};

// Check if user is following another user
exports.checkFollowing = async (req, res) => {
  try {
    const { targetUserId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: "You must be logged in" });
    }

    const follow = await prisma.follower.findUnique({
      where: {
        followerId_followingId: {
          followerId: Number(userId),
          followingId: Number(targetUserId),
        },
      },
    });

    // Get follower and following counts
    const [followerCount, followingCount] = await Promise.all([
      prisma.follower.count({ where: { followingId: Number(targetUserId) } }),
      prisma.follower.count({ where: { followerId: Number(targetUserId) } }),
    ]);

    res.json({
      isFollowing: !!follow,
      followerCount,
      followingCount,
    });
  } catch (error) {
    console.error("Error checking follow status:", error);
    res.status(500).json({ error: error.message });
  }
};
