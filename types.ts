export interface Booking {
    booking: {
        durationInMinutes: number
    }
}

export interface Photographer {
    id: string
    name: string
    availabilities?: TimeSlot[]
}

export interface TimeSlot {
    starts: string
    ends: string
}