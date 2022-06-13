import { earliestSlot, calculateTimeSlot, checkForConflict } from "./index";

const exampleBooking = {
  booking: {
    durationInMinutes: 90,
  },
};

const examplePg = {
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
  ],
};

describe("the earliest available slot function", () => {
  it("should return an array of time slots", () => {
    const returned = earliestSlot(examplePg, exampleBooking);
    if (typeof returned !== "undefined") {
      expect(returned[0]).toHaveProperty("starts");
    }
  });
  it("should return the earliest time slot available and adjust for booking conflicts", () => {
    const expected = [
      {
        starts: "2020-11-25T09:30:00.000Z",
        ends: "2020-11-25T11:00:00.000Z",
      },
    ];
    const returned = earliestSlot(examplePg, exampleBooking);
    expect(returned).toStrictEqual(expected);
  });
  it("should handle multiple bookings", () => {
    const popularPg = {
      id: "1",
      name: "Otto Crawford",
      availabilities: [
        {
          starts: "2020-11-25T06:00:00.000Z",
          ends: "2020-11-25T07:00:00.000Z",
        },
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
          ends: "2020-11-25T11:00:00.000Z",
        },
      ],
    };
    const expected = [
      {
        starts: "2020-11-25T11:00:00.000Z",
        ends: "2020-11-25T12:30:00.000Z",
      },
    ];
    const returned = earliestSlot(popularPg, exampleBooking);
    expect(returned).toStrictEqual(expected);
  });
  it("should handle choppy availability", () => {
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
    const expected = [
      {
        starts: "2020-11-25T11:30:00.000Z",
        ends: "2020-11-25T13:00:00.000Z",
      },
    ];
    const returned = earliestSlot(busyPg, exampleBooking);
    expect(returned).toStrictEqual(expected);
  });
});

describe("the check for conflict function", () => {
  it("should return false if there is not a conflict between the two time slots", () => {
    const testA = {
        starts: "2020-11-25T08:00:00.000Z",
        ends: "2020-11-25T16:00:00.000Z",
      };
      
      const testB = {
        starts: "2020-11-25T16:30:00.000Z",
        ends: "2020-11-25T17:30:00.000Z",
      };
      expect(checkForConflict(testA, testB)).toStrictEqual(false)
  });
  it("should return true if there is a conflict between the two time slots", () => {
    const testA = {
        starts: "2020-11-25T08:00:00.000Z",
        ends: "2020-11-25T16:00:00.000Z",
      };
      
      const testB = {
        starts: "2020-11-25T15:30:00.000Z",
        ends: "2020-11-25T17:30:00.000Z",
      };
      expect(checkForConflict(testA, testB)).toStrictEqual(true)
  });
});
