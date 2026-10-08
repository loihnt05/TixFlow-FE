import { mockAttendees } from "@/lib/mock/attendees";
export async function getAttendees(eventSlug?: string) { return eventSlug ? mockAttendees.filter((attendee) => attendee.eventSlug === eventSlug) : mockAttendees; }
