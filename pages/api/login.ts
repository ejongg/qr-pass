import type { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.status(404).end();
    return;
  }

  if (!process.env.SECRET) {
    throw new Error("SECRET not set");
  }

  if (
    req.body.email !== process.env.ADMIN_EMAIL ||
    req.body.password !== process.env.ADMIN_PASSWORD
  ) {
    res.status(401).send({ message: "No permission" });
  }

  return jwt.sign({ role: "admin" }, process.env.SECRET, { expiresIn: "1h" });
}
