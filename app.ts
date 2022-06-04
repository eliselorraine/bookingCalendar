import express from "express";
import { Request, Response, Application } from "express";
import photographers from "./photographers.json";
// import type { Booking, Photographer, TimeSlot } from "./types";

const app: Application = express();

app.use(express.json());

app.get("/api/photographers", (_req: Request, res: Response) => {
  return res.status(200).json(photographers);
});

export default app;
