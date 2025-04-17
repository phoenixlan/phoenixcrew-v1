import React, { useState } from "react";

import { TableCell, IconContainer, SelectableTableRow, Table, TableHead, TableBody, TableRow } from '../../../components/table';
import { InnerContainer, InputCheckbox, SpanLink } from '../../../components/dashboard';

import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const PositionPermissionList = ({ position }) => {
    const [visibleUUID, setVisibleUUID] = useState(false);

    return (
        <>
            <Table>
                <TableHead border>
                    <TableRow>
                        <TableCell flex="3" visible={!visibleUUID}>UUID <SpanLink onClick={() => setVisibleUUID(!visibleUUID)}>{visibleUUID ? "(Skjul UUID)" : null}</SpanLink></TableCell>
                        <TableCell flex="5">Rettighet <SpanLink mobileHide onClick={() => setVisibleUUID(!visibleUUID)}>{visibleUUID ? null : "(Vis UUID)"}</SpanLink></TableCell>
                        <TableCell mobileHide flex="0 24px" />
                    </TableRow>
                </TableHead>
                <TableBody> 
                    {
                    position.permissions.map((permission) => {
                        return (
                            <SelectableTableRow>
                                <TableCell consolas flex="3" visible={!visibleUUID}>{ permission.uuid }</TableCell>
                                <TableCell flex="5" uppercase>{ permission.permission }</TableCell>
                                <TableCell mobileHide flex="0 24px" />
                            </SelectableTableRow>
                        )
                    })}
                </TableBody>
            </Table>
        </>
    )
}