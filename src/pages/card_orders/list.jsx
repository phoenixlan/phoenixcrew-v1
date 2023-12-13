import React , { useEffect, useState } from "react";
import { CardOrder, Crew, getCurrentEvent } from "@phoenixlan/phoenix.js";
import { PageLoading } from "../../components/pageLoading"
import { faCheck, faPrint } from "@fortawesome/free-solid-svg-icons";
import { DashboardContent, DashboardHeader, DashboardBarSelector, DashboardBarElement, DashboardTitle, InnerContainer, InputCheckbox } from "../../components/dashboard";
import { Table, TableCell, CrewColorBox, IconContainer, SelectableTableRow, TableHead, TableRow } from "../../components/table";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const CardOrderList = () => {
    const [loading, setLoading] = useState(true);
    const [showCompleted, setshowCompleted] = useState(false);  
    const [unfilteredOrders, setunfilteredOrders] = useState([]);
    const [orders, setOrders] = useState([]);
    const [crews, setCrews] = useState([]);
    const [activeContent, setActiveContent ] = useState(1);


    useEffect(async () => {
        let cardOrders = await CardOrder.getAllCardOrders()
        cardOrders = cardOrders.filter(order => order.state !== "CANCELLED")
        setunfilteredOrders(cardOrders)
        setOrders(cardOrders.filter(order => order.state !== "FINISHED"))

        const crews = await Promise.all((await Crew.getCrews()).map(async (crew) => {
            return await Crew.getCrew(crew.uuid);
        }))
        setCrews(crews)

        setLoading(false);
    }, []);

    if(loading) {
        return (
            <PageLoading />
        )
    }

    const printOrder = async (order) => {
        const result = await CardOrder.generateCardFromOrder(order.uuid);
        if(result.ok) {
            //? Can we make a helper function for this?
            const href = window.URL.createObjectURL(await result.blob());
            const link = document.createElement('a');
            link.href = href;
            link.setAttribute('download', `card-${order.subject_user.firstname}-${order.subject_user.uuid}.png`); //or any other extension
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            const updatedOrder = await CardOrder.getCardOrder(order.uuid)
            updateOrdersState(updatedOrder)
        } else {
            alert(result.error);
        }
    }

    const finishOrder = async (order) => {
        const finishedOrder = await CardOrder.finishCardOrder(order.uuid)
        updateOrdersState(finishedOrder)
    }

    const updateOrdersState = (updatedOrder) => {
        let updatedOrders = orders.map((order) => {
            return order.uuid === updatedOrder.uuid ? updatedOrder : order
        })
        if (!showCompleted) {
            updatedOrders = updatedOrders.filter(order => order.state !== "FINISHED")
        }
        setOrders(updatedOrders)
    }

    const handleShowCompleted = () => {
        setshowCompleted(!showCompleted)
        if (!showCompleted) {
            setOrders(unfilteredOrders)
        } else {
            setOrders(unfilteredOrders.filter(order => order.state !== "FINISHED"))
        }
    }

    const placeCrewOrders = (crew) => {
        crew.positions.forEach((position) => {
            const currentEvent = getCurrentEvent()
            position.position_mappings.filter((position_mapping) => position_mapping.event_uuid == currentEvent.event_uuid).forEach((mapping) => {
                const user = mapping.user
                CardOrder.createCardOrder(user.uuid)
            })
        })
    }

    return (<>
    <DashboardHeader border>
        <DashboardTitle>
            Crew-kort
        </DashboardTitle>
    </DashboardHeader>
    <DashboardBarSelector border>
        <DashboardBarElement active={activeContent == 1} onClick={() => setActiveContent(1)}>Ordre</DashboardBarElement>
        <DashboardBarElement active={activeContent == 2} onClick={() => setActiveContent(2)}>Crew</DashboardBarElement>
    </DashboardBarSelector>
    
    <DashboardContent visible={activeContent == 1}>
        <InnerContainer mobileHide>
            <InputCheckbox label="Vis ferdige ordre" value={showCompleted} onChange={() => handleShowCompleted()}/>
        </InnerContainer>

        <InnerContainer>
            <Table>
                <TableHead border>
                    <TableRow>
                        <TableCell as="th" flex="6" mobileFlex="3">Navn</TableCell>
                        <TableCell as="th" flex="1" mobileHide>Status</TableCell>
                        <TableCell as="th" center flex="0 24px" mobileHide title="Print alle kort"><IconContainer><FontAwesomeIcon icon={faPrint}></FontAwesomeIcon></IconContainer></TableCell>
                        <TableCell as="th" center flex="0 24px" mobileHide title="Fullfør alle ordre"><IconContainer><FontAwesomeIcon icon={faCheck}></FontAwesomeIcon></IconContainer></TableCell>
                    </TableRow>
                </TableHead>
            
                {orders.map(order => { return (
                    <SelectableTableRow key={order.uuid}>
                        <TableCell flex="6" mobileFlex="3">{order.subject_user.firstname} {order.subject_user.lastname}</TableCell>
                        <TableCell flex="1" mobileHide>{order.state}</TableCell>
                        <TableCell center flex="0 24px" mobileHide title="Print kort" onClick={()=>{printOrder(order)}}><IconContainer><FontAwesomeIcon icon={faPrint}/></IconContainer></TableCell>
                        <TableCell center flex="0 24px" mobileHide title="Fullfør ordre" onClick={()=>{finishOrder(order)}}><IconContainer><FontAwesomeIcon icon={faCheck}/></IconContainer></TableCell>
                    </SelectableTableRow>
                )})}
            </Table>
        </InnerContainer>
    </DashboardContent>

    <DashboardContent visible={activeContent == 2}>
        <InnerContainer>
            <Table>
                <TableHead border>
                    <TableRow>
                        <TableCell as="th" flex="0 42px" mobileHide>Farge</TableCell>
                        <TableCell as="th" flex="6" mobileFlex="3">Navn</TableCell>
                        <TableCell as="th" flex="10" mobileHide>Beskrivelse</TableCell>
                        <TableCell as="th" center flex="0 24px" mobileHide title="Trykk for å bestille kort for crew"><IconContainer>...</IconContainer></TableCell>
                    </TableRow>
                </TableHead>
            {crews.map(crew => { return (
                <SelectableTableRow>
                    <TableCell flex="0 42px" mobileHide><CrewColorBox hex={crew.hex_color} /></TableCell>
                    <TableCell flex="6" mobileFlex="3">{ crew.name }</TableCell>
                    <TableCell flex="10" mobileHide>{ crew.description }</TableCell>
                    <TableCell center flex="0 24px" mobileHide title="Trykk for å bestille kort for crew" onClick={()=>{placeCrewOrders(crew)}}><IconContainer><FontAwesomeIcon icon={faPrint}/></IconContainer></TableCell>
                </SelectableTableRow>
            )})}
            </Table>
        </InnerContainer>
    </DashboardContent>

    </>)
}