export interface RequestedBooking {
    booking: {
        durationInMinutes: number
    }
}

export interface Photographer {
    id: string
    name: string
    availabilities?: TimeSlot[]
    bookings?: Booking[]
}

export interface TimeSlot {
    starts: string
    ends: string
}

export interface Booking {
    id: string
    starts: string
    ends: string
}