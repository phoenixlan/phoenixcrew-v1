const toUnixTime = value => Math.floor(new Date(value).getTime() / 1000);

export const buildEventPayload = data => {
    const payload = {
        name: data.name.trim(),
        start_time: toUnixTime(data.start_time),
        end_time: toUnixTime(data.end_time),
        booking_time: toUnixTime(data.booking_time),
        priority_seating_time_delta: Number(data.priority_seating_delay) * 60,
        seating_time_delta: Number(data.seating_delay) * 60,
        ticket_sales_caps: Object.fromEntries(data.ticket_sales_caps.map(row => [row.group.trim(), Number(row.cap)])),
    };

    const theme = data.theme.trim();
    if(theme) payload.theme = theme;
    if(data.participant_age_limit_inclusive !== "") {
        payload.participant_age_limit_inclusive = Number(data.participant_age_limit_inclusive);
    }
    if(data.crew_age_limit_inclusive !== "") {
        payload.crew_age_limit_inclusive = Number(data.crew_age_limit_inclusive);
    }
    if(data.seatmap_uuid) payload.seatmap_uuid = data.seatmap_uuid;

    return payload;
};
