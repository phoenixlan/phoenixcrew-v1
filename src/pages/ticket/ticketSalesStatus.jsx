import { useContext, useMemo } from "react"
import { PageLoading } from "../../components/pageLoading";
import { DashboardContent, DashboardHeader, DashboardTitle, InnerContainer, InnerContainerRow, InnerContainerTitle, InnerContainerTitleS } from "../../components/dashboard";
import { BarElement, FlexBar } from "../../components/bar";
import { AuthenticationContext } from "../../components/authentication";
import { Notice } from "../../components/containers/notice";

import { useCurrentEvent } from "../../hooks/events/useCurrentEvent";
import { useEventTickets } from "../../hooks/tickets/useEventTickets";
import { useEventTicketTypeMappings } from "../../hooks/tickets/useEventTicketTypeMappings";
import { useActiveStoreSessions } from "../../hooks/storeSessions/useActiveStoreSessions";
import { useTicketSaleData } from "../../hooks/stats/useTicketSaleData";
import { useBrand } from "../../contexts/brand";
import { hasAnyBrandPermission } from "../../utils/roles";

const SECONDS_PER_DAY = 24 * 60 * 60;

// Tickets sold up to and including the given day of an event's ticket sale
const getSoldByDay = (salesEvent, day) => salesEvent.days
    .filter((entry) => entry.idx <= day)
    .reduce((sum, entry) => sum + entry.count, 0);

export const TicketSalesStatus = () => {
    const { brandUuid } = useBrand();

    const authContext = useContext(AuthenticationContext);

    const viewTickets = hasAnyBrandPermission(authContext.roles, brandUuid, ["ticket_admin"]);

    const { data: currentEvent, isLoading: isLoadingCurrentEvent } = useCurrentEvent(brandUuid);
    const { data: tickets = [], isLoading: isLoadingTickets } = useEventTickets(viewTickets ? currentEvent?.uuid : undefined);
    const { data: storeSessions = [], isLoading: isLoadingStoreSessions } = useActiveStoreSessions();
    const { data: mappings = [], isLoading: isLoadingMappings } = useEventTicketTypeMappings(viewTickets ? currentEvent?.uuid : undefined);
    const { data: salesData, isLoading: isLoadingSalesData } = useTicketSaleData(viewTickets ? brandUuid : undefined, true);

    const loading = viewTickets && (
        isLoadingCurrentEvent ||
        (currentEvent && (isLoadingTickets || isLoadingStoreSessions || isLoadingMappings || isLoadingSalesData))
    );

    const { groupBars, ticketTypeBars } = useMemo(() => {
        if (!currentEvent) {
            return { groupBars: [], ticketTypeBars: [] };
        }

        // Count tickets held in store sessions for this event, per ticket type
        const heldTickets = {};
        storeSessions
            .filter((storeSession) => storeSession.event_uuid === currentEvent.uuid)
            .forEach((storeSession) => {
                storeSession.entries.forEach((entry) => {
                    heldTickets[entry.ticket_type.uuid] = (heldTickets[entry.ticket_type.uuid] ?? 0) + entry.amount;
                })
            })

        const ticketsByType = {};
        tickets.forEach((ticket) => {
            ticketsByType[ticket.ticket_type.uuid] = [...(ticketsByType[ticket.ticket_type.uuid] ?? []), ticket];
        })

        const ticketSalesCaps = currentEvent.ticket_sales_caps ?? {};
        const sortedMappings = [...mappings].sort((a, b) => b.ticket_type.price - a.ticket_type.price);

        // Creates a sales bar for the tickets of the given mappings. cap is null if the tickets are unlimited
        const createBar = (key, title, barMappings, cap) => {
            const barTickets = barMappings.flatMap((mapping) => ticketsByType[mapping.ticket_type.uuid] ?? []);
            const held = barMappings.reduce((count, mapping) => count + (heldTickets[mapping.ticket_type.uuid] ?? 0), 0);

            return {
                key,
                title,
                sold: barTickets.length,
                cap,
                soldLegend: [
                    { color: "green", text: cap === null ? `${barTickets.length} billetter solgt` : `${barTickets.length} / ${cap} billetter solgt` },
                    { color: "stripedOrange", text: `${held} billetter reservert i aktive kjøp` },
                ],
                soldSegments: [
                    ...barMappings.map((mapping) => ({
                        key: mapping.uuid,
                        color: mapping.ticket_type.price ? "green" : "stripedGreen",
                        title: mapping.ticket_type.name,
                        count: (ticketsByType[mapping.ticket_type.uuid] ?? []).length
                    })),
                    {
                        key: "reservedTickets",
                        color: "stripedOrange",
                        title: "Billetter reservert i kjøp",
                        count: held
                    },
                    {
                        key: "availableTickets",
                        color: "gray",
                        title: "Tilgjengelige billetter",
                        count: cap === null ? 0 : Math.max(cap - barTickets.length - held, 0),
                        fillOnEmpty: !barTickets.length && !held
                    },
                ],
            };
        }

        // Groups also get a checkin bar, counting the tickets in the group which can be checked in
        const groupBars = Object.entries(ticketSalesCaps)
            .map(([group, cap]) => {
                const groupMappings = sortedMappings.filter((mapping) => mapping.sales_cap_groups.includes(group));
                const groupTickets = groupMappings
                    .filter((mapping) => mapping.ticket_type.grants_admission)
                    .flatMap((mapping) => ticketsByType[mapping.ticket_type.uuid] ?? []);
                const checkedIn = groupTickets.filter((ticket) => ticket.checked_in).length;

                return {
                    ...createBar(group, group, groupMappings, cap),
                    checkinLegend: [
                        { color: "green", text: `${checkedIn} / ${groupTickets.length} billetter sjekket inn` },
                    ],
                    checkinSegments: [
                        {
                            key: "checkedinTickets",
                            color: "green",
                            title: "Billetter sjekket inn",
                            count: checkedIn
                        },
                        {
                            key: "notCheckedinTickets",
                            color: "gray",
                            title: "Billetter ikke sjekket inn",
                            count: groupTickets.length - checkedIn,
                            fillOnEmpty: !checkedIn
                        },
                    ],
                };
            });

        // A ticket type is limited by its own sales cap and by the caps of its groups
        const ticketTypeBars = sortedMappings.map((mapping) => {
            const caps = [mapping.sales_cap, ...mapping.sales_cap_groups.map((group) => ticketSalesCaps[group])].filter((cap) => cap !== null && cap !== undefined);
            return createBar(mapping.uuid, mapping.ticket_type.name, [mapping], caps.length ? Math.min(...caps) : null);
        });

        return { groupBars, ticketTypeBars };
    }, [currentEvent, tickets, storeSessions, mappings]);

    const forecast = useMemo(() => {
        if (!currentEvent) {
            return null;
        }

        const now = Date.now() / 1000;
        if (now < currentEvent.booking_time) {
            return { type: "info", title: "Billettsalget har ikke startet enda" };
        }

        const previousSales = (salesData ?? []).filter((salesEvent) => salesEvent.event.uuid !== currentEvent.uuid);
        if (!previousSales.length) {
            return { type: "info", title: "Informasjon om hvor bra billettsalget går vil komme her når det finnes historisk data" };
        }

        // Extrapolate the tickets sold so far in each group linearly over the whole ticket sale
        const elapsed = Math.max(now - currentEvent.booking_time, 1);
        const duration = currentEvent.start_time - currentEvent.booking_time;
        const isProjectedSoldOut = (bar) => bar.sold / elapsed * duration >= bar.cap;
        // The event is sold out when every group is
        const soldOut = groupBars.length > 0 && groupBars.every(isProjectedSoldOut);

        // Compare the tickets sold so far with previous events at the same day of their ticket sale.
        // Days are calendar days, where the day the ticket sale starts is day 1
        const bookingDate = new Date(currentEvent.booking_time * 1000);
        bookingDate.setHours(0, 0, 0, 0);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const day = Math.round((today - bookingDate) / (SECONDS_PER_DAY * 1000)) + 1;
        const currentSales = (salesData ?? []).find((salesEvent) => salesEvent.event.uuid === currentEvent.uuid);
        const currentSold = currentSales ? getSoldByDay(currentSales, day) : 0;
        const averageSold = previousSales.reduce((sum, salesEvent) => sum + getSoldByDay(salesEvent, day), 0) / previousSales.length;
        const comparison = averageSold > 0
            ? `${Math.round(Math.abs(currentSold - averageSold) / averageSold * 100)}% ${currentSold >= averageSold ? "bedre" : "dårligere"} enn gjennomsnittet for dag ${day} i billettsalget`
            : null;

        return {
            type: soldOut ? "success" : "error",
            title: soldOut ? "Arrangementet ligger an til å bli utsolgt" : "Arrangementet ligger ikke an til å bli utsolgt",
            detail: comparison
        };
    }, [currentEvent, salesData, groupBars]);

    if(loading) {
        return (
            <PageLoading />
        )
    }

    return (
        <>
            <DashboardHeader border>
                <DashboardTitle>
                    Billettsalg-status
                </DashboardTitle>
            </DashboardHeader>
            <DashboardContent>
                <InnerContainer visible={!viewTickets}>
                    <InnerContainerRow>
                        <Notice type="error" visible={!viewTickets}>
                            Du har ikke tilgang til å se billetter.
                        </Notice>
                    </InnerContainerRow>
                </InnerContainer>

                <InnerContainer visible={viewTickets && !currentEvent}>
                    <InnerContainerRow>
                        <Notice fillWidth type="warning" visible={viewTickets && !currentEvent}>
                            Det eksisterer for øyeblikket ingen aktive arrangementer.<br/>
                        </Notice>
                    </InnerContainerRow>
                </InnerContainer>

                <InnerContainer visible={viewTickets && !!forecast}>
                    <InnerContainerRow>
                        <Notice large fillWidth type={forecast?.type} visible={!!forecast}>
                            <InnerContainerTitleS nopadding={!forecast?.detail}>{forecast?.title}</InnerContainerTitleS>
                            {forecast?.detail}
                        </Notice>
                    </InnerContainerRow>
                </InnerContainer>

                <InnerContainer rowgap visible={viewTickets && !!currentEvent}>
                    <InnerContainerRow>
                        <InnerContainer flex="1" floattop>
                            <InnerContainer>
                                <InnerContainerTitle>Billettfordeling</InnerContainerTitle>
                                <InnerContainer column extramargin border>
                                    <InnerContainerTitleS>Per gruppe</InnerContainerTitleS>
                                    {groupBars.map((bar) => (
                                        <FlexBar title={bar.title} legend={bar.soldLegend} key={bar.key}>
                                            {bar.soldSegments.map((object) => {
                                                return (<BarElement color={object.color} title={object.title} count={object.count} fillOnEmpty={object.fillOnEmpty} key={object.key} />)
                                            })}
                                        </FlexBar>
                                    ))}
                                </InnerContainer>
                                <InnerContainer column extramargin>
                                    <InnerContainerTitleS>Per billettype</InnerContainerTitleS>
                                    {ticketTypeBars.map((bar) => (
                                        <FlexBar title={bar.title} legend={bar.soldLegend} key={bar.key}>
                                            {bar.soldSegments.map((object) => {
                                                return (<BarElement color={object.color} title={object.title} count={object.count} fillOnEmpty={object.fillOnEmpty} key={object.key} />)
                                            })}
                                        </FlexBar>
                                    ))}
                                </InnerContainer>
                            </InnerContainer>
                        </InnerContainer>

                        <InnerContainer flex="1" floattop>
                            <InnerContainer>
                                <InnerContainerTitle>Innsjekkede billetter</InnerContainerTitle>
                                <InnerContainer column extramargin>
                                    <InnerContainerTitleS>Per gruppe</InnerContainerTitleS>
                                    {groupBars.map((bar) => (
                                        <FlexBar title={bar.title} legend={bar.checkinLegend} key={bar.key}>
                                            {bar.checkinSegments.map((object) => {
                                                return (<BarElement color={object.color} title={object.title} count={object.count} fillOnEmpty={object.fillOnEmpty} key={object.key} />)
                                            })}
                                        </FlexBar>
                                    ))}
                                </InnerContainer>
                            </InnerContainer>
                        </InnerContainer>
                    </InnerContainerRow>
                </InnerContainer>
            </DashboardContent>
        </>
    )
}
