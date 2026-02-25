// Authentication is temporarily disabled for development.
// This middleware injects a developer user id into `req.user` so routes
// that expect `req.user.user_id` continue to work. Set DEV_USER_ID
// in your environment to change the id.

export const protect = (req, res, next) => {
  const devId = Number(process.env.DEV_USER_ID || 1);
  req.user = { user_id: devId };
  return next();
};
