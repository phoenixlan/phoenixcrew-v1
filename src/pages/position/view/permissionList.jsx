import React, { useState } from "react";

import { Column, IconContainer, SelectableRow, Table, TableHeader } from '../../../components/table';
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
                <TableHeader border>
                    <Column flex="5" visible={!visibleUUID}>UUID</Column>
                    <Column flex="6">Navn</Column>
                    <Column flex="0 24px" />
                </TableHeader>
            </Table>

            {
            position.permissions.map((permission) => {
                return (
                    <SelectableRow>
                        <Column consolas flex="5" visible={!visibleUUID}>{ permission.uuid }</Column>
                        <Column flex="6" uppercase>{ permission.permission }</Column>
                        <Column flex="0 24px"><IconContainer><FontAwesomeIcon icon={faArrowRight}/></IconContainer></Column>
                    </SelectableRow>
                )
            })}
        </>
    )
}