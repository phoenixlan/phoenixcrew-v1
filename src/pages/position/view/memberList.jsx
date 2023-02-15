import React, { useState } from "react";

import { TableCell, IconContainer, SelectableTableRow, Table, TableHead, TableBody, TableRow } from '../../../components/table';
import { InnerContainer, InnerContainerTitle, InputCheckbox } from '../../../components/dashboard';
import { UserSearch } from "../../../components/userSearch";
import { FormButton } from '../../../components/form';

import { PositionMapping } from "@phoenixlan/phoenix.js";

import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useHistory } from "react-router-dom";
import { PageLoading } from "../../../components/pageLoading";

export const PositionMemberList = ({ position, refresh }) => {
    const [ visibleUUID, setVisibleUUID ] = useState(false);
    const [ member, setNewMember ] = useState(null);
    const [ isAddingMember, setIsAddingMember ] = useState(false);

    const history = useHistory();

    const addMember = async () => {
        if(!member) {
            alert("No member is selected");
        } else {
            setIsAddingMember(true);
            await PositionMapping.createPositionMapping(member, position.uuid);
            await refresh();
            setIsAddingMember(false);
        }
    }

    return (
        <>
            <InnerContainer extramargin>
                <InnerContainerTitle>Legg til nytt medlem</InnerContainerTitle>
                <InnerContainer>Du kan bare gi ut stillingen for nåværende arrangement. Merk at de ikke vil få en e-post for å informere dem den nye stillingen.</InnerContainer>
                
                <UserSearch onUserSelected={setNewMember} onChange={() => setNewMember(null)}/>
                {
                    isAddingMember ? (
                        <PageLoading />
                    ) : (
                        <FormButton disabled={!member} type="submit" onClick={() => addMember()}>Legg til medlem</FormButton>
                    )
                }
            </InnerContainer>

            <InnerContainer>
                <InnerContainer mobileHide>
                    <InputCheckbox label="Vis UUID" value={visibleUUID} onChange={() => setVisibleUUID(!visibleUUID)} />
                </InnerContainer>
                <Table>
                    <TableHead border>
                        <TableRow>
                            <TableCell mobileHide flex="5" visible={!visibleUUID}>UUID</TableCell>
                            <TableCell mobileFlex="3" flex="3">Navn</TableCell>
                            <TableCell mobileFlex="2" flex="3">Brukernavn</TableCell>
                            <TableCell mobileHide flex="0 24px" />
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            position.position_mappings.map((position_mapping) => {
                                const user = position_mapping.user
                                return (
                                    <SelectableTableRow onClick={e => {history.push(`/user/${user.uuid}`)}} title="Trykk for å åpne">
                                        <TableCell mobileHide consolas flex="5" visible={!visibleUUID}>{ user.uuid }</TableCell>
                                        <TableCell mobileFlex="3" flex="3">{ user.lastname + ", " + user.firstname }</TableCell>
                                        <TableCell mobileFlex="2" flex="3">{ user.username }</TableCell>
                                        <TableCell mobileHide flex="0 24px"><IconContainer><FontAwesomeIcon icon={faArrowRight}/></IconContainer></TableCell>
                                    </SelectableTableRow>
                                )
                            })
                        }
                    </TableBody>
                </Table>
            </InnerContainer>
        </>
    )
}