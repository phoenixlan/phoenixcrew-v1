import React, { useState } from "react";

import { TableCell, IconContainer, SelectableTableRow, Table, TableHead } from '../../../components/table';
import { InnerContainer, InputCheckbox } from '../../../components/dashboard';

import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const PositionPermissionList = ({ position }) => {
    const [visibleUUID, setVisibleUUID] = useState(false);

    return (
        <>
            <InnerContainer>
                <InputCheckbox label="Vis UUID" value={visibleUUID} onChange={() => setVisibleUUID(!visibleUUID)} />
            </InnerContainer>
            <Table>
                <TableHead border>
                    <TableCell flex="5" visible={!visibleUUID}>UUID</TableCell>
                    <TableCell flex="6">Navn</TableCell>
                    <TableCell flex="0 24px" />
                </TableHead>
            </Table>

            {
            position.permissions.map((permission) => {
                return (
                    <SelectableTableRow>
                        <TableCell consolas flex="5" visible={!visibleUUID}>{ permission.uuid }</TableCell>
                        <TableCell flex="6" uppercase>{ permission.permission }</TableCell>
                        <TableCell flex="0 24px"><IconContainer><FontAwesomeIcon icon={faArrowRight}/></IconContainer></TableCell>
                    </SelectableTableRow>
                )
            })}
        </>
    )
}