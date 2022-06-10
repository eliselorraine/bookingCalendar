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

// Function that takes a photographer and returns their earliest available time slot
export const earliestSlot = (
  pg: Photographer,
  req: RequestedBooking
): TimeSlot[] | undefined => {
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

  const bookingMs = bookings?.map((b) => getMs(b));
  const availMs = availableTimeSlots?.map((a) => getMs(a));
  const reqBookMs = duration * 60000;
  const earliestAvailSlot = availMs.map((a) => {
    const slot = bookingMs?.map((b) => {
      // checking to see if the booking conflicts with the availability
      const potentialSlotEnd = a.startMs + reqBookMs;
      if (b.startMs >= a.startMs && b.startMs < potentialSlotEnd) {
        console.log("Conflict");
        return {
          starts: msToISO(b.endMs),
          ends: msToISO(b.endMs + reqBookMs),
        };
      }
      return {
        starts: msToISO(a.startMs),
        ends: msToISO(a.startMs + reqBookMs),
      };
    });
    return slot;
  });
  return earliestAvailSlot[0];
};

const exampleBooking = {
  booking: {
    durationInMinutes: 90,
  },
};

const popularPg = {
  id: "1",
  name: "Otto Crawford",
  availabilities: [
    {
      starts: "2020-11-25T08:00:00.000Z",
      ends: "2020-11-25T16:00:00.000Z",
    },
  ],
  bookings: [
    {
      id: "1",
      starts: "2020-11-25T08:30:00.000Z",
      ends: "2020-11-25T09:30:00.000Z",
    },
    {
      id: "1",
      starts: "2020-11-25T09:30:00.000Z",
      ends: "2020-11-25T011:00:00.000Z",
    },
  ],
};

console.log(earliestSlot(popularPg, exampleBooking))
