export const adminOnly = (req, res, next) => {
  const user = req.user;
  console.log(user.isExist.role);
  if (!user) {
    return res.status(401).json({ message: "Unauthorized, no user data" });
  }

  if (user.isExist.role !== "admin") {
    return res.status(403).json({ message: "Access denied, admin only" });
  }
    next();
};
