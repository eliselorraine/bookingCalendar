// import { Photographer, TimeSlot } from "../types";

const exampleResponse = [
  {
    photographer: {
      id: "1",
      name: "Otto Crawford",
    },
    timeSlot: {
      starts: "2020-11-25T09:30:00.000Z",
      ends: "2020-11-25T11:00:00.000Z",
    },
  },
  {
    photographer: {
      id: "2",
      name: "Jens Mills",
    },
    timeSlot: {
      starts: "2020-11-25T13:00:00.000Z",
      ends: "2020-11-25T14:30:00.000Z",
    },
  },
];

// export default function availableTimeSlotsForBooking(
//   durationInMinutes: number
// ): {
//   photographer: Photographer;
//   timeSlot: TimeSlot;
// }[] {
//   return exampleResponse;
// }
