import { TimeSlot, Photographer, RequestedBooking } from "../types";
import photographersData from "../photographers.json";

const pgList = photographersData.photographers;

const exampleBooking = {
  booking: {
    durationInMinutes: 90,
  },
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
) => {
  let availArr: TimeSlot[] = [];
  // Checks for availability greater than or equal to the duration of requested booking
  pg.availabilities?.forEach((avail) => {
    let availMin = calculateTimeSlot(avail);
    if (availMin >= booking.durationInMinutes) {
      availArr.push(avail);
    }
    return;
  });
  let availSlot = createSlot(availArr, { booking });
  const timeSlot = availSlot[0];
  availSlot = checkForConflicts(pg, availSlot, timeSlot, { booking });
  const response = {
      photographer: {
          id: pg.id,
          name: pg.name, 
      },
      timeSlot: availSlot[0],
  }
  return response;
};

const checkForConflicts = (
  pg: Photographer,
  availArr: TimeSlot[],
  availableSlot: any,
  { booking }: RequestedBooking
) => {
  const bookingsArr = pg.bookings;
  let adjustedAvailArr: TimeSlot[] = [];
  bookingsArr?.forEach((b) => {
    // look at the booking and see if it conflicts with the available Slot
    const startsMs = new Date(availableSlot.starts).getTime();
    const endsMs = new Date(availableSlot.ends).getTime();
    const bookingStartMs = new Date(b.starts).getTime();
    if (bookingStartMs >= startsMs && bookingStartMs < endsMs) {
      // Create a new time slot with the start time of the booking end
      let newEndMs = new Date(b.ends).getTime();
      newEndMs += booking.durationInMinutes * 60000;
      const newEnd = new Date(newEndMs).toISOString();
      const newAvailSlot = {
        starts: b.ends,
        ends: newEnd,
      };
      adjustedAvailArr.push(newAvailSlot);
      return adjustedAvailArr;
    } else {
      return (adjustedAvailArr = [...availArr]);
    }
  });
  return adjustedAvailArr;
};

const response = pgList.map((p) => pgAvail(p, exampleBooking)); 
console.log(response)

// console.log(pgAvail(examplePhotographerOne, exampleBooking));

// Create a list of time slots equivalent to the duration of requested booking
// Create a true availabiltiy value considering any bookings
// Find the availability time slot that includes the booking
// Split that time slot into two time slots that exclude the booking time