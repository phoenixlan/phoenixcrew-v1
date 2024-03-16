import React, { useState, useEffect } from 'react';
import { getCurrentEvent, User, Crew, getEvents } from "@phoenixlan/phoenix.js";
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

    const locked = !position.event_uuid;

    return (
        <SelectableTableRow onClick={locked ? null : func}>
            <TableCell flex="0 1.3rem"  mobileHide center   ><IconContainer hidden={!locked}    color="#ef6c00"><FontAwesomeIcon icon={faLock}  title="Stillingen er ikke knyttet til et arrangement, og kan ikke slettes." /></IconContainer></TableCell>
            <TableCell flex="0 1px"     mobileHide fillGray />
            <TableCell flex="3"                   >{positionName}</TableCell>
            <TableCell flex="2"                   >{position.active_position ? <>Nåværende stilling</> : <>Tidligere stilling</>}</TableCell>
            <TableCell flex="2"         mobileHide>{position.event_name??<b>Permanent stilling</b>}</TableCell>
        </SelectableTableRow>
    )
}



export const UserPositions = () => {
    const { uuid } = useParams();
    const [ loading, setLoading ] = useState(true);
    const [ window, setWindow ] = useState([]);
    const [ user, setUser ] = useState(null);

    const reloadPositionList = async () => {
        try {
            const currentEvent = await getCurrentEvent();
            const allEvents = await getEvents();
            const user = await User.getUser(uuid);

            await Promise.all(user.position_mappings.map(async (position_mapping) => {
                const position = position_mapping.position;

                // Create a boolean inside position_mapping which tells if the position is active for the current event, or not. 
                position_mapping.active_position = 
                    position_mapping.event_uuid === currentEvent.uuid ||
                    !position_mapping.event_uuid;

                // Create a variable inside position_mapping which tells what event the position was inherited from. (Inherited from event name)
                if(position_mapping.event_uuid) {
                    position_mapping.event_name = allEvents.filter(event => event.uuid === position_mapping.event_uuid).map(event => event.name);
                    position_mapping.event_time = allEvents.filter(event => event.uuid === position_mapping.event_uuid).map(event => event.start_time);
                }

                // Create a variable inside position_mapping for crew and team, used in position_mapping_to_string.
                if(position.crew_uuid) {
                    position.crew = await Crew.getCrew(position.crew_uuid);
                    if(position.team_uuid) {
                        position.team = position.crew.teams.find((team) => team.uuid === position.team_uuid)
                    }
                }

                console.log(position_mapping);
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
        await reloadPositionList();
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
                                <TableCell as="th" flex="0 1.3rem" mobileHide center title="Indikerer om stillingen kan bli slettet, eller ikke."><InnerColumnCenter>...</InnerColumnCenter></TableCell>
                                <TableCell as="th" flex="0 1px" mobileHide fillGray />
                                <TableCell as="th" flex="3">Navn</TableCell>
                                <TableCell as="th" flex="2">Status</TableCell>
                                <TableCell as="th" flex="2" mobileHide>Gjelder for arrangement</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                user.position_mappings
                                    .sort((a, b) => Number(b.active_position) - Number(a.active_position))
                                    .map(position => {
                                        let positionName = position_mapping_to_string(position);

                                        return (
                                            <Position 
                                                key={position.uuid} 
                                                position={position} 
                                                positionName={positionName}

                                                func={() => setWindow(newWindow({title: "Fjern stilling", subtitle: position.name, Component: DeletePosition, exitFunction: () => {setWindow(false); reload();}, entries: position}))} 
                                            />
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