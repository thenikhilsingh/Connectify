const indexController = async (req, res) => {
  try {
    res.status(200).json({ success: true, message: "Backend is running!" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error!" });
  }
};

module.exports = indexController;
