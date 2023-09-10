import React, { useState, useEffect } from 'react';
import { PositionMapping, getCurrentEvent, getEvent } from "@phoenixlan/phoenix.js";
import { Table, TableCell, TableHead, SelectableTableRow, IconContainer, TableRow, TableBody, InnerColumnCenter } from "../../../components/table";
import { PageLoading } from '../../../components/pageLoading';
import { InnerContainer, InnerContainerTitle, InputCheckbox } from '../../../components/dashboard';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { position_mapping_to_string } from '../../../utils/user';
import { faCheck, faLock, faTrash } from '@fortawesome/free-solid-svg-icons';
import { newWindow } from '../../../components/windows';
import { DeletePosition } from '../../../components/windows/types/user/deletePosition';

export const UserViewerPositions = ({ user, reload: reloadUser }) => {
    const [ currentEvent, setCurrentEvent ] = useState(null);

    const [ loading, setLoading ] = useState(true);
    const [ window, setWindow ] = useState([]);    
    
    const Position = ({ position, reload }) => {
        const [ positionEvent, setPositionEvent ]   = useState(null);

        const [ active, setActive ]                 = useState(false);
        const [ locked, setLocked ]                 = useState(false);
        
        let positionName        = position_mapping_to_string(position);
        let positionEventName   = positionEvent?.name;

        useEffect(async () => {
            if(position.event_uuid) {
                if(!positionEvent) {
                    // Get event information based on event_uuid.
                    setPositionEvent(await getEvent(position.event_uuid))
                }
            }

            // Set the position as active if position event_uuid is unset, or if event_uuid matches current event_uuid.
            setActive(
                position.event_uuid == currentEvent?.uuid ||
                !position.event_uuid
            )
    
            // Set the position as locked if position event_uuid is not set.
            setLocked(
                !position.event_uuid
            )
        }, [])
    
        const demote = async () => {
            if(position.event_uuid) {
                return setWindow(newWindow({title: "Fjern stilling", subtitle: positionName, Component: DeletePosition, exitFunction: () => {setWindow(false); reload()}, entries: position}));
            }
        }

        return (
            <SelectableTableRow onClick={demote}>
                <TableCell flex="0 1.3rem"  mobileHide center   ><IconContainer hidden={!locked}    color="#ef6c00"><FontAwesomeIcon icon={faLock}  title="Stillingen er ikke knyttet til et arrangement, og kan ikke slettes." /></IconContainer></TableCell>
                <TableCell flex="0 1px"     mobileHide fillGray />
                <TableCell flex="3"                             >{positionName}</TableCell>
                <TableCell flex="2"                             >{active ? <>Nåværende stilling</> : <>Tidligere stilling</>}</TableCell>
                <TableCell flex="2"                             >{positionEventName??<><b>Permanent stilling</b></>}</TableCell>
            </SelectableTableRow>
        )
    }

    const reload = async () => {
        setCurrentEvent(await getCurrentEvent());
        setLoading(false);
    }

    useEffect(() => {
        reload();
    }, []);

    if(loading) {
        return (<PageLoading />)
    }
    return (
        <>
            {window}
            <InnerContainer extramargin>
                <InnerContainerTitle>Stillinger</InnerContainerTitle>
                <Table>
                    <TableHead border>
                        <TableRow>
                            <TableCell as="th" center   flex="0 1.3rem"     mobileHide  title="Indikerer om stillingen kan bli slettet, eller ikke."><InnerColumnCenter>...</InnerColumnCenter></TableCell>
                            <TableCell as="th"          flex="0 1px"        mobileHide fillGray />
                            <TableCell as="th"          flex="3"                        >Navn</TableCell>
                            <TableCell as="th"          flex="2"            mobileHide  >Status</TableCell>
                            <TableCell as="th"          flex="2"            mobileHide  >Gjelder for arrangement</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            user.position_mappings.map(position => {
                                return (
                                    <Position key={position.uuid} reload={reloadUser} position={position} />
                                )
                            })
                        }
                    </TableBody>
                </Table>
            </InnerContainer>
        </>
    )
}