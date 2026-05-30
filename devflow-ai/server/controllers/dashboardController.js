const Project = require("../models/Project");
const Chat = require("../models/Chat");

// @desc    Get dashboard analytics data
// @route   GET /api/dashboard/stats
// @access  Private
const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user._id;

    const [projects, chats] = await Promise.all([
      Project.find({ owner: userId }),
      Chat.find({ user: userId }),
    ]);

    const totalProjects = projects.length;
    const completedProjects = projects.filter((p) => p.status === "completed").length;
    const inProgressProjects = projects.filter((p) => p.status === "in-progress").length;
    const totalAIChats = chats.reduce((acc, chat) => acc + chat.messages.length, 0);

    // Projects by status for chart
    const projectsByStatus = {
      planning: projects.filter((p) => p.status === "planning").length,
      "in-progress": inProgressProjects,
      completed: completedProjects,
      "on-hold": projects.filter((p) => p.status === "on-hold").length,
    };

    // Recent projects (last 5)
    const recentProjects = await Project.find({ owner: userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .select("title status priority progress createdAt");

    // Average progress
    const avgProgress =
      projects.length > 0
        ? Math.round(projects.reduce((acc, p) => acc + p.progress, 0) / projects.length)
        : 0;

    res.json({
      stats: {
        totalProjects,
        completedProjects,
        inProgressProjects,
        totalAIChats,
        avgProgress,
      },
      projectsByStatus,
      recentProjects,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { getDashboardStats };
