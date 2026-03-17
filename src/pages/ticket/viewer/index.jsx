import React , { useContext, useEffect, useState } from "react";

import { DashboardBarElement, DashboardBarSelector, DashboardContent, DashboardHeader, DashboardSubtitle, DashboardTitle, InnerContainer, InnerContainerRow } from '../../../components/dashboard';

import { AuthenticationContext } from "../../../components/authentication";
import { PageLoading } from "../../../components/pageLoading";
import { useParams } from "react-router-dom";
import { Notice } from "../../../components/containers/notice";

import { getCurrentEvent, Ticket } from "@phoenixlan/phoenix.js";

import { TicketInformation } from "./ticketInformation";
import { PaymentInformation } from "./paymentInformation";

const TABS = {
    DETAILS: 1,
    PAYMENT: 2,
}

export const ViewTicket = () => {
    const { id } = useParams();
    const [error, setError] = useState(false);

    const [data, setData] = useState(null);

    const [loading, setLoading] = useState(true);
    const [activeContent, setActiveContent] = useState(TABS.DETAILS);

    // Import the following React contexts:
    const authContext = useContext(AuthenticationContext);

    const load = async () => {
        setLoading(true);

        // Get position based on UUID and return error if something fails.
        try {
            const ticket = await Ticket.getTicket(id);
            const currentEvent = await getCurrentEvent();

            setData({ticket, currentEvent});
        } catch(e) {
            setError(e);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        load().catch(e => {
            console.log(e);
        })
    }, []);

    if(loading) {
        return (<PageLoading />)
    } else if(authContext.roles.includes("admin") || authContext.roles.includes("ticket_admin")) {
        if(data) {
            return (
                <>
                    <DashboardHeader>
                        <DashboardTitle>
                            Billett
                        </DashboardTitle>
                        <DashboardSubtitle>
                            #{data.ticket.ticket_id} – {data.ticket.event.name}
                        </DashboardSubtitle>
                    </DashboardHeader>

                    <DashboardBarSelector border>
                        <DashboardBarElement active={activeContent === TABS.DETAILS} onClick={() => setActiveContent(TABS.DETAILS)}>Detaljer</DashboardBarElement>
                        <DashboardBarElement active={activeContent === TABS.PAYMENT} onClick={() => setActiveContent(TABS.PAYMENT)}>Betalingsinformasjon</DashboardBarElement>
                    </DashboardBarSelector>

                    <DashboardContent visible={activeContent === TABS.DETAILS}>
                        <TicketInformation data={data} />
                    </DashboardContent>

                    <DashboardContent visible={activeContent === TABS.PAYMENT}>
                        <PaymentInformation data={data} />
                    </DashboardContent>
                </>
            )
        } else {
            return (
                <>
                    <DashboardHeader border>
                        <DashboardTitle>
                            Billett
                        </DashboardTitle>
                    </DashboardHeader>

                    <DashboardContent>
                        <Notice type="error" visible>
                            Det oppsto en feil ved henting av informasjon for denne billetten.<br />
                            {error.message}
                        </Notice>
                    </DashboardContent>
                </>
            )
        }
    } else {
        return (
            <>
                <DashboardContent>
                    <InnerContainer rowgap>
                        <InnerContainerRow>
                            <Notice type="error" visible>
                                Du har ikke tilgang til å se billettinformasjon.
                            </Notice>
                        </InnerContainerRow>
                    </InnerContainer>
                </DashboardContent>
            </>
            )
    }
}
