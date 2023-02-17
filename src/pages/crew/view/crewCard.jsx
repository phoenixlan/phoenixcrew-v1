import React, { useState, useEffect } from 'react';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPrint } from "@fortawesome/free-solid-svg-icons";

import { PageLoading } from "../../../components/pageLoading"

import { InnerContainer} from "../../../components/dashboard";
import { getCurrentEvent, User } from "@phoenixlan/phoenix.js";
import { SelectableTableRow, TableCell, Table, TableBody, IconContainer } from '../../../components/table';

export const CrewViewCrewCard = ({ crew }) => {
    const [ currentEvent, setCurrentEvent ] = useState();
    const [ loading, setLoading ] = useState(true);

    const currentEventFilter = (position_mapping) => !position_mapping.event_uuid || position_mapping.event_uuid == currentEvent.uuid;

    const load = async () => {
        setLoading(true)
        const currentEvent = await getCurrentEvent();
        setCurrentEvent(currentEvent);
        setLoading(false);
    }

    const printCard = async (user) => {
        const result = await User.getCrewCard(user.uuid);
        if(result.ok) {
            const href = window.URL.createObjectURL(await result.blob());

            const link = document.createElement('a');
            link.href = href;
            link.setAttribute('download', `card-${user.firstname}-${user.uuid}.png`); //or any other extension
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } else {
            alert("error");
        }
    }

    useEffect(async () => {
        await load();
    }, [])

    if(loading) {
        return (
            <PageLoading />
        )
    }
    else {
        const memberMap = new Map();
        crew.positions.forEach((position) => {
            position.position_mappings.filter(currentEventFilter).forEach((mapping) => {
                const user = mapping.user
                if(!memberMap.has(user.uuid)) {
                    memberMap.set(user.uuid, user);
                }
            })
        })
        const members = Array.from(memberMap.values());

        return (<>
            <InnerContainer>
                <Table>
                    <TableBody>
                        {
                            members.map( user => (
                                <SelectableTableRow 
                                    onClick={ 
                                        e => { printCard(user) }
                                    } 
                                    title="Trykk for å printe" 
                                    key={user.uuid}
                                >
                                    <TableCell>{ user.firstname } { user.lastname }</TableCell>
                                    <TableCell flex="0 24px" mobileHide><IconContainer><FontAwesomeIcon icon={faPrint}/></IconContainer></TableCell>
                                </SelectableTableRow>
                            ))
                        }
                    </TableBody>
                </Table>
            </InnerContainer>
        </>)
    }
}