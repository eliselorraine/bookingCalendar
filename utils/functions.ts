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

  return availArr;
};

// Create a true availabiltiy value considering any bookings
// Find the availability time slot that includes the booking
// Split that time slot into two time slots that exclude the booking time
const pgBookings = (pg: Photographer): TimeSlot[] => {
  let bookingStart = "";
  let bookingEnd = "";
  let availStart = "";
  let availEnd = "";

  pg.bookings?.forEach((b) => {
    bookingStart = b.starts;
    bookingEnd = b.ends;
  });

  pg.availabilities?.forEach((a) => {
    availStart = a.starts;
    availEnd = a.ends;
  });

  const unbookedAvailTimes: TimeSlot[] = [
    {
      starts: availStart,
      ends: bookingStart,
    },
    {
      starts: bookingEnd,
      ends: availEnd,
    },
  ];

  pg.availabilities = unbookedAvailTimes;
  console.log(pgAvail(pg, exampleBooking));

  return unbookedAvailTimes;
};

// what if they have more than one booking? How do we create the new time slots?

console.log(pgBookings(examplePhotographer));
