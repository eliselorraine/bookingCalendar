import express from "express";
import { Request, Response, Application } from "express";
import { Photographer, RequestedBooking } from "types";
import { earliestSlot } from "./utils/index";
import photographersData from "./photographers.json";
const pgList: Photographer[] = photographersData.photographers;

const app: Application = express();

app.use(express.json());

app.get("/api/photographers", (_req: Request, res: Response) => {
  return res.status(200).json(pgList);
});

app.post("/api/photographers", (req: Request, res: Response) => {
  // Needs error handling, try catch blocks and appropriate HTTP statuses
  const reqBooking: RequestedBooking = req.body; 
  const suggestedTimes = pgList.map((p: Photographer) => {
    const earliest = earliestSlot(p, reqBooking);
    if (earliest.length >= 1) {
      const response = {
        photographer: {
          id: p.id,
          name: p.name,
        },
        timeSlot: earliest[0],
      };
      return response;
    } else {
      return;
    }
  })
  return res.status(200).json(suggestedTimes); 
})


export default app;
