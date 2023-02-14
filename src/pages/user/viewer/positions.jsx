import React, { useState, useEffect } from 'react';
import { PositionMapping, getCurrentEvent } from "@phoenixlan/phoenix.js";
import { Table, TableCell, TableHead, SelectableTableRow, IconContainer } from "../../../components/table";
import { PageLoading } from '../../../components/pageLoading';
import { InnerContainer, InnerContainerTitle, InputCheckbox } from '../../../components/dashboard';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { position_mapping_to_string } from '../../../utils/user';

const PositionList = ({ position_mappings, showUuid, reload }) => {
    return (
        <>
            {
                position_mappings.map(position_mapping => {
                    const positionName = position_mapping_to_string(position_mapping)

                    const demote = async () => {
                        if(!position_mapping.event_uuid) {
                            return;
                        }
                        await PositionMapping.deletePositionMapping(position_mapping.uuid);
                        await reload();
                    }

                    return (
                        <SelectableTableRow onClick={demote}>
                            <TableCell consolas flex="1" visible={!showUuid}>{ position_mapping.position.uuid }</TableCell>
                            <TableCell flex="2" >{positionName}</TableCell>
                            <TableCell flex="0 5em">
                                {
                                    position_mapping.event_uuid !== null && "Fjern"
                                }
                            </TableCell>
                        </SelectableTableRow>
                    )
                })
            }
        </>
    )
}


export const UserViewerPositions = ({ user, reload: reloadUser }) => {
    const [ loading, setLoading ] = useState(false);

    const [ currentEvent, setCurrentEvent ] = useState(null);

    const [visibleUUIDPositions, setVisibleUUIDPositions] = useState(false);

    const reload = async () => {
        setLoading(true);
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
            <InputCheckbox label="Vis UUID" value={visibleUUIDPositions} onChange={() => setVisibleUUIDPositions(!visibleUUIDPositions)} />
            <InnerContainer border extramargin>
                <InnerContainerTitle>Nåværende Stillinger</InnerContainerTitle>
                <Table>
                    <TableHead border>
                        <TableCell flex="1" visible={!visibleUUIDPositions}>UUID</TableCell>
                        <TableCell flex="2">Navn</TableCell>
                        <TableCell flex="0 24px" />
                    </TableHead>
                    <PositionList reload={reloadUser} show_uuid={visibleUUIDPositions} position_mappings={user.position_mappings.filter(mapping => !mapping.event_uuid || mapping.event_uuid == currentEvent?.uuid )} />
                </Table>
            </InnerContainer>
            <InnerContainer border extramargin>
                <InnerContainerTitle>Tidligere Stillinger</InnerContainerTitle>
                <Table>
                    <TableHead border>
                        <TableCell flex="1" visible={!visibleUUIDPositions}>UUID</TableCell>
                        <TableCell flex="2">Navn</TableCell>
                        <TableCell flex="0 24px" />
                    </TableHead>
                    <PositionList reload={reloadUser} show_uuid={visibleUUIDPositions} position_mappings={user.position_mappings.filter(mapping => mapping.event_uuid && mapping.event_uuid != currentEvent?.uuid )} />
                </Table>
            </InnerContainer>
        </>
    )
}