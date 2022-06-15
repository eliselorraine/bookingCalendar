import express from "express";
import { Request, Response, Application } from "express";
import { Photographer, RequestedBooking, TimeSlot } from "types";
// import { earliestSlot } from "utils";
import photographersData from "./photographers.json";
const pgList = photographersData.photographers;

const app: Application = express();

app.use(express.json());

app.get("/api/photographers", (_req: Request, res: Response) => {
  return res.status(200).json(pgList);
});

app.post("/api/photographers", (req: Request, res: Response) => {
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

export const calculateTimeSlot = ({ starts, ends }: TimeSlot): number => {
  const startDate = new Date(starts);
  const endDate = new Date(ends);
  const ms = endDate.getTime() - startDate.getTime();
  const minutes = ms / 60000;
  return minutes;
};

export const getMs = (slot: TimeSlot) => {
  const startDate = new Date(slot.starts);
  const endDate = new Date(slot.ends);
  const startMs = startDate.getTime();
  const endMs = endDate.getTime();
  return {
    startMs,
    endMs,
  };
};

export const msToISO = (num: number): string => {
  const dateStr = new Date(num).toISOString();
  return dateStr;
};

export const checkForConflict = (a: TimeSlot, b: TimeSlot): boolean => {
  const msA = getMs(a);
  const msB = getMs(b);
  if (msB.startMs >= msA.startMs && msB.startMs < msA.endMs) {
    return true;
  }
  return false;
};

const createTimeSlot = (slot: TimeSlot, min: number): TimeSlot => {
  const ms = getMs(slot);
  const durationInMs = min * 60000;
  const newEnd = ms.startMs + durationInMs;
  return {
    starts: msToISO(ms.startMs),
    ends: msToISO(newEnd),
  };
};

// Function that takes a photographer and returns their earliest available time slot
export const earliestSlot = (pg: Photographer, req: RequestedBooking) => {
  const availability = pg.availabilities;
  const bookings = pg.bookings;
  const duration = req.booking.durationInMinutes;
  let availableTimeSlots: TimeSlot[] = [];
  // remove time slots that aren't long enough
  availability?.forEach((a) => {
    const availMin = calculateTimeSlot(a);
    if (availMin >= duration) {
      availableTimeSlots.push(a);
    }
    return;
  });

  //   const bookingMs = bookings?.map((b) => getMs(b));
  const earliestPossible = availableTimeSlots?.map((a) => {
    let earliest: TimeSlot = createTimeSlot(a, duration);
    // Loop through bookings to see if any conflict with earliest
    // If so, grab the booking that conflicts and create new timeSlot from end of booking
    if (bookings) {
      bookings.forEach((b) => {
        if (checkForConflict(earliest, b)) {
          const ms = getMs(b);
          const newStart = msToISO(ms.endMs);
          const newEnd = msToISO(ms.endMs + duration * 60000);
          earliest = {
            starts: newStart,
            ends: newEnd,
          };
        }
        return earliest;
      });
    }
    return earliest;
  });
  const response = {
    photographer: {
      id: pg.id,
      name: pg.name,
    },
    timeSlot: earliestPossible[0],
  };

  // check for conflict in availability

  return earliestPossible;
};


export default app;
