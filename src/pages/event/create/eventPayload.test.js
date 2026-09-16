import { buildEventPayload } from "./eventPayload";

const requiredFields = {
    name: "  Phoenix Spring  ",
    theme: "",
    start_time: "2027-04-02T18:00",
    end_time: "2027-04-04T12:00",
    booking_time: "2027-03-01T12:00",
    priority_seating_delay: "30",
    seating_delay: "60",
    max_participants: "500",
    participant_age_limit_inclusive: "",
    crew_age_limit_inclusive: "",
    seatmap_uuid: "",
};

describe("event creation payload", () => {
    test("normalizes required fields and converts minute delays to seconds", () => {
        expect(buildEventPayload(requiredFields)).toEqual({
            name: "Phoenix Spring",
            start_time: Math.floor(new Date(requiredFields.start_time).getTime() / 1000),
            end_time: Math.floor(new Date(requiredFields.end_time).getTime() / 1000),
            booking_time: Math.floor(new Date(requiredFields.booking_time).getTime() / 1000),
            priority_seating_time_delta: 1800,
            seating_time_delta: 3600,
            max_participants: 500,
        });
    });

    test("includes configured optional fields", () => {
        expect(buildEventPayload({
            ...requiredFields,
            theme: "  Space  ",
            participant_age_limit_inclusive: "18",
            crew_age_limit_inclusive: "20",
            seatmap_uuid: "seatmap-uuid",
        })).toEqual(expect.objectContaining({
            theme: "Space",
            participant_age_limit_inclusive: 18,
            crew_age_limit_inclusive: 20,
            seatmap_uuid: "seatmap-uuid",
        }));
    });
});
