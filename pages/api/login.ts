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

  const body = JSON.parse(req.body);

  if (
    body.email !== process.env.ADMIN_EMAIL ||
    body.password !== process.env.ADMIN_PASSWORD
  ) {
    res.status(401).send({ message: "Invalid credentials" });
    return;
  }

  res.json({
    accessToken: jwt.sign({ role: "admin" }, process.env.SECRET, {
      expiresIn: "1h",
    }),
  });
}
