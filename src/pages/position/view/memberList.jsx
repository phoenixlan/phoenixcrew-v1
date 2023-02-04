import React, { useState } from "react";

import { Column, IconContainer, SelectableRow, Table, TableHeader } from '../../../components/table';
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
            <InnerContainer>
                <InnerContainerTitle>Legg til nytt medlem</InnerContainerTitle>
                <p>Du kan bare gi ut stillingen for nåværende arrangement. Merk at de ikke vil få en e-post for å informere dem den nye stillingen.</p>
                <UserSearch onUserSelected={setNewMember} />
                {
                    isAddingMember ? (
                        <PageLoading />
                    ) : (
                        <FormButton disabled={!member} type="submit" onClick={() => addMember()}>Legg til medlem</FormButton>
                    )
                }
            </InnerContainer>
            <InnerContainer>
                <InnerContainerTitle>Eksisterende medlemmer</InnerContainerTitle>
                <InputCheckbox label="Vis UUID" value={visibleUUID} onChange={() => setVisibleUUID(!visibleUUID)} />
            </InnerContainer>
            <Table>
                <TableHeader border>
                    <Column flex="5" visible={!visibleUUID}>UUID</Column>
                    <Column flex="3">Navn</Column>
                    <Column flex="3">Brukernavn</Column>
                    <Column flex="0 24px" />
                </TableHeader>
            </Table>

            {
                position.position_mappings.map((position_mapping) => {
                    const user = position_mapping.user
                    return (
                        <SelectableRow onClick={e => {history.push(`/user/${user.uuid}`)}} title="Trykk for å åpne">
                            <Column consolas flex="5" visible={!visibleUUID}>{ user.uuid }</Column>
                            <Column flex="3">{ user.lastname + ", " + user.firstname }</Column>
                            <Column flex="3">{ user.username }</Column>
                            <Column flex="0 24px"><IconContainer><FontAwesomeIcon icon={faArrowRight}/></IconContainer></Column>
                        </SelectableRow>
                    )
                })
            }
        </>
    )
}