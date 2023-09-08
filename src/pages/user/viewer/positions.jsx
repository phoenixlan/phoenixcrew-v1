import React, { useState, useEffect } from 'react';
import { PositionMapping, getCurrentEvent } from "@phoenixlan/phoenix.js";
import { Table, TableCell, TableHead, SelectableTableRow, IconContainer, TableRow, TableBody } from "../../../components/table";
import { PageLoading } from '../../../components/pageLoading';
import { InnerContainer, InnerContainerTitle, InputCheckbox } from '../../../components/dashboard';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { position_mapping_to_string } from '../../../utils/user';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

const PositionList = ({ position_mappings, show_uuid , reload, canRemove }) => {
    const demote = async (position_mapping) => {
        if(!canRemove || !position_mapping.event_uuid) {
            return;
        }
        if(window.confirm("Er du sikker på at du vil fjerne stillingen?")) {
            await PositionMapping.deletePositionMapping(position_mapping.uuid);
            await reload();
        }
    }
    return (
        <>
            {
                position_mappings.map(position_mapping => {
                    const positionName = position_mapping_to_string(position_mapping)


                    return (
                        <SelectableTableRow onClick={() => demote(position_mapping)} key={position_mapping.uuid}>
                            <TableCell mobileHide consolas flex="1" visible={!show_uuid}>{ position_mapping.position.uuid }</TableCell>
                            <TableCell mobileFlex="1" flex="2" >{positionName}</TableCell>
                            <TableCell mobileFlex="0 24px" flex="0 24px">
                                {
                                    position_mapping.event_uuid !== null && <IconContainer><FontAwesomeIcon icon={faTrash} title="Trykk for å slette elementet" /></IconContainer>
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
            <InnerContainer mobileHide border extramargin>
                <InputCheckbox label="Vis UUID" value={visibleUUIDPositions} onChange={() => setVisibleUUIDPositions(!visibleUUIDPositions)} />
            </InnerContainer>
            <InnerContainer extramargin>
                <InnerContainerTitle>Nåværende Stillinger</InnerContainerTitle>
                <Table>
                    <TableHead border>
                        <TableRow>
                            <TableCell flex="1" visible={!visibleUUIDPositions}>UUID</TableCell>
                            <TableCell flex="2">Navn</TableCell>
                            <TableCell flex="0 24px" />
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <PositionList canRemove={true} reload={reloadUser} show_uuid={visibleUUIDPositions} position_mappings={user.position_mappings.filter(mapping => !mapping.event_uuid || mapping.event_uuid == currentEvent?.uuid )} />
                    </TableBody>
                </Table>
            </InnerContainer>
            <InnerContainer extramargin mobileHide />
            <InnerContainer extramargin>
                <InnerContainerTitle>Tidligere Stillinger</InnerContainerTitle>
                <Table>
                    <TableHead border>
                        <TableRow>
                            <TableCell flex="1" visible={!visibleUUIDPositions}>UUID</TableCell>
                            <TableCell flex="2">Navn</TableCell>
                            <TableCell flex="0 24px" />
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <PositionList canRemove={false} reload={reloadUser} show_uuid={visibleUUIDPositions} position_mappings={user.position_mappings.filter(mapping => mapping.event_uuid && mapping.event_uuid != currentEvent?.uuid )} />
                    </TableBody>
                </Table>
            </InnerContainer>
        </>
    )
}