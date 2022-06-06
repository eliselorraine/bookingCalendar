import { TimeSlot, Photographer, RequestedBooking } from "../types";
import photographers from "../photographers.json";

const pgList = photographers.photographers;

const exampleBooking = {
  booking: {
    durationInMinutes: 90,
  },
};

const examplePhotographer = {
  id: "2",
  name: "Jens Mills",
  availabilities: [
    {
      starts: "2020-11-25T08:00:00.000Z",
      ends: "2020-11-25T09:00:00.000Z",
    },
    {
      starts: "2020-11-25T13:00:00.000Z",
      ends: "2020-11-25T16:00:00.000Z",
    },
  ],
  bookings: [
    {
      id: "2",
      starts: "2020-11-25T15:00:00.000Z",
      ends: "2020-11-25T16:00:00.000Z",
    },
  ],
};

// const exampleResponse = [
//   {
//     photographer: {
//       id: "1",
//       name: "Otto Crawford",
//     },
//     timeSlot: {
//       starts: "2020-11-25T09:30:00.000Z",
//       ends: "2020-11-25T11:00:00.000Z",
//     },
//   },
//   {
//     photographer: {
//       id: "2",
//       name: "Jens Mills",
//     },
//     timeSlot: {
//       starts: "2020-11-25T13:00:00.000Z",
//       ends: "2020-11-25T14:30:00.000Z",
//     },
//   },
// ];

const exampleTimeSlot = {
  starts: "2020-11-25T09:30:00.000Z",
  ends: "2020-11-25T11:00:00.000Z",
};

const calculateTimeSlot = ({ starts, ends }: TimeSlot): number => {
  const startDate = new Date(starts);
  const endDate = new Date(ends);
  const ms = endDate.getTime() - startDate.getTime();
  const minutes = ms / 60000;
  return minutes;
};

const createSlot = (arr: TimeSlot[], { booking }: RequestedBooking) => {
  let availSlots: TimeSlot[] = [];
  arr.map((timeSlot) => {
    let ts = new Date(timeSlot.starts);
    const availMs = ts.getTime();
    const slotMs = availMs + booking.durationInMinutes * 60000;
    const endStamp = new Date(slotMs);
    const newSlot = {
      starts: timeSlot.starts,
      ends: endStamp.toISOString(),
    };
    availSlots.push(newSlot);
  });
  return availSlots;
};

// Look through the list of photographers to get their list of availabilities
const pgAvail = (
  pg: Photographer,
  { booking }: RequestedBooking
): TimeSlot[] => {
  let availArr: TimeSlot[] = [];
  pg.availabilities?.forEach((avail) => {
    let availMin = calculateTimeSlot(avail);
    if (availMin >= booking.durationInMinutes) {
      availArr.push(avail);
    }
    return;
  });
  const availSlot = createSlot(availArr, { booking });
  if (availSlot.length > 0) {
    const timeSlot = availSlot[0];
    console.log(checkForConflicts(pg, timeSlot, { booking }));
  }
  return availSlot;
};

const checkForConflicts = (
  pg: Photographer,
  availableSlot: any,
  { booking }: RequestedBooking
) => {
  const bookingsArr = pg.bookings;
  bookingsArr?.forEach((b) => {
    // look at the booking and see if it conflicts with the available Slot
    const startsMs = new Date(availableSlot.starts).getTime();
    const endsMs = new Date(availableSlot.ends).getTime();
    const bookingStartMs = new Date(b.starts).getTime();
    if (bookingStartMs >= startsMs && bookingStartMs < endsMs) {
      console.log("Conflict");
    } else {
      console.log("No conflict");
    }
  });
  return true;
};

// Create a list of time slots equivalent to the duration of requested booking
console.log(pgAvail(examplePhotographer, exampleBooking));

// Create a true availabiltiy value considering any bookings
// Find the availability time slot that includes the booking
// Split that time slot into two time slots that exclude the booking time

// what if they have more than one booking? How do we create the new time slots?