import React , { useEffect, useState } from "react";
import { CardOrder } from "@phoenixlan/phoenix.js";
import { PageLoading } from "../../components/pageLoading"
import { faCheck, faPrint } from "@fortawesome/free-solid-svg-icons";
import { DashboardContent, DashboardHeader, DashboardSubtitle, DashboardTitle, InnerContainer, InputCheckbox } from "../../components/dashboard";
import { Table, TableCell, CrewColorBox, IconContainer, SelectableTableRow, TableHead, TableRow } from "../../components/table";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const CardOrderList = () => {
    const [loading, setLoading] = useState(true);
    const [orders, setOrders] = useState([]);
    const [showCompleted, setshowCompleted] = useState(false);  

    useEffect(async () => {
        let orders = await CardOrder.getAllCardOrders()
        setOrders(orders.filter(order => order.state !== "CANCELLED"))

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
        const updatedOrders = orders.map((order) => {
            return order.uuid === updatedOrder.uuid ? updatedOrder : order
        })
        setOrders(updatedOrders)
    }

    return (<>
    <DashboardHeader border>
        <DashboardTitle>
            Crew-kort
        </DashboardTitle>
    </DashboardHeader>
    <DashboardContent>
        <InnerContainer mobileHide>
            <InputCheckbox label="Vis ferdige ordre" value={showCompleted} onChange={() => setshowCompleted(!showCompleted)} />
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
    </>)
}