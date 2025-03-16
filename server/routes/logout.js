import { Router } from "express";

const router = Router();

router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
      if (err) {
          return res.status(500).json({ message: "Failed to log out" });
      }
      res.clearCookie('connect.sid'); // clear the session cookie
      res.json({ message: "Logged out successfully" });
  });
});

export default router;