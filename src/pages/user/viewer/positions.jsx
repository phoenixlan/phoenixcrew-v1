import React, { useState, useEffect } from 'react';
import { getCurrentEvent, getEvent, User, Crew } from "@phoenixlan/phoenix.js";
import { Table, TableCell, TableHead, SelectableTableRow, IconContainer, TableRow, TableBody, InnerColumnCenter } from "../../../components/table";
import { PageLoading } from '../../../components/pageLoading';
import { InnerContainer, InnerContainerTitle } from '../../../components/dashboard';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { position_mapping_to_string } from '../../../utils/user';
import { faLock } from '@fortawesome/free-solid-svg-icons';
import { newWindow } from '../../../components/windows';
import { DeletePosition } from '../../../components/windows/types/user/deletePosition';
import { useParams } from 'react-router-dom/cjs/react-router-dom';


export const Position = ({ position, func, positionName }) => {
    //const [ currentEvent, setCurrentEvent ]     = useState(null);
    const [ eventName, setEventName ]           = useState(null);

    const [ active, setActive ] = useState(false);
    const [ locked, setLocked ] = useState(false);

    useEffect(async () => {
        // Get current event and set its uuid.
        const currentEvent = await getCurrentEvent();

        // Set the position as active if position event_uuid is unset, or if event_uuid matches current event_uuid.
        if(currentEvent) {
            setActive(
                position.event_uuid == currentEvent.uuid ||
                !position.event_uuid
            )
        }

        // Set the position as locked if position event_uuid is not set.
        setLocked(
            !position.event_uuid
        )

        // Set event name if event is set
        if(position.event_uuid) {
            // Get event information based on event_uuid.
            const event = await getEvent(position.event_uuid);
            setEventName(event.name);
        }


    }, [])

    return (
        <SelectableTableRow onClick={locked ? null : func}>
            <TableCell flex="0 1.3rem"  mobileHide center   ><IconContainer hidden={!locked}    color="#ef6c00"><FontAwesomeIcon icon={faLock}  title="Stillingen er ikke knyttet til et arrangement, og kan ikke slettes." /></IconContainer></TableCell>
            <TableCell flex="0 1px"     mobileHide fillGray />
            <TableCell flex="3"                             >{positionName}</TableCell>
            <TableCell flex="2"                             >{active ? <>Nåværende stilling</> : <>Tidligere stilling</>}</TableCell>
            <TableCell flex="2"                             >{eventName ? eventName : <><b>Permanent stilling</b></>}</TableCell>
        </SelectableTableRow>
    )
}



export const UserPositions = () => {
    const { uuid } = useParams();

    const [ currentEvent, setCurrentEvent ] = useState(null);
    const [ loading, setLoading ] = useState(true);
    const [ window, setWindow ] = useState([]);
    const [ user, setUser ] = useState(null);

    const reloadPositionList = async () => {
        const user = await User.getUser(uuid);

        try {
            console.log(user);
            await Promise.all(user.position_mappings.map(async (position_mapping) => {
                const position = position_mapping.position;
                if(position.crew_uuid) {
                    position.crew = await Crew.getCrew(position.crew_uuid);
                    if(position.team_uuid) {
                        position.team = position.crew.teams.find((team) => team.uuid == position.team_uuid)
                    }
                }
            }));
            setUser(user);
        } catch(e) {
            console.log(e);
        } finally {
            setLoading(false);
        }

    }

    useEffect(async () => {
        reloadPositionList();
    }, [])

    const reload = async () => {
        reloadPositionList();
    }

    if(loading) {
        return (<PageLoading />)
    } else {
        return (
            <>
                {window}
                <InnerContainer extramargin>
                    <InnerContainerTitle>Stillinger</InnerContainerTitle>
                    <Table>
                        <TableHead border>
                            <TableRow>
                                <TableCell as="th" flex="0 1.3rem" mobileHide center   title="Indikerer om stillingen kan bli slettet, eller ikke."><InnerColumnCenter>...</InnerColumnCenter></TableCell>
                                <TableCell as="th" flex="0 1px"    mobileHide fillGray />
                                <TableCell as="th" flex="3" >Navn</TableCell>
                                <TableCell as="th" flex="2"        mobileHide>Status</TableCell>
                                <TableCell as="th" flex="2"        mobileHide>Gjelder for arrangement</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                user.position_mappings.map(position => {
                                    
                                    let positionName = position_mapping_to_string(position);
                                    let positionStatus = "Y";
                                    let positionEvent = "Z";

                                    return (
                                        <Position 
                                            key={position.uuid} 
                                            position={position} 
                                            positionName={positionName}
                                            positionStatus={positionStatus}
                                            positionEvent={positionEvent}
                                            
                                            func={() => setWindow(newWindow({title: "Fjern stilling", Component: DeletePosition, exitFunction: () => {setWindow(false); reload();}, entries: position}))} />
                                    )
                                })
                            }
                        </TableBody>
                    </Table>
                </InnerContainer>
            </>
        )
    }
}