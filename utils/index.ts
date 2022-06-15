import photographersData from "../photographers.json";
import { TimeSlot, Photographer, RequestedBooking } from "../types";
const pgList = photographersData.photographers;

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

const exampleBooking = {
  booking: {
    durationInMinutes: 90,
  },
};

const busyPg = {
  id: "1",
  name: "Otto Crawford",
  availabilities: [
    {
      starts: "2020-11-25T06:00:00.000Z",
      ends: "2020-11-25T07:30:00.000Z",
    },
    {
      starts: "2020-11-25T09:00:00.000Z",
      ends: "2020-11-25T11:00:00.000Z",
    },
    {
      starts: "2020-11-25T11:30:00.000Z",
      ends: "2020-11-25T15:00:00.000Z",
    },
  ],
  bookings: [
    {
      id: "1",
      starts: "2020-11-25T07:00:00.000Z",
      ends: "2020-11-25T07:30:00.000Z",
    },
    {
      id: "1",
      starts: "2020-11-25T10:00:00.000Z",
      ends: "2020-11-25T11:00:00.000Z",
    },
  ],
};

console.log(
  pgList.map((p: Photographer) => {
    const earliest = earliestSlot(p, exampleBooking);
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
);
