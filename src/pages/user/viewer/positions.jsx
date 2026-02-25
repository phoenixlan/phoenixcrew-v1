import React from 'react';
import { getCurrentEvent, User, Crew, getEvents, PositionMapping } from "@phoenixlan/phoenix.js";
import { Table, TableCell, TableHead, SelectableTableRow, IconContainer, TableRow, TableBody, InnerColumnCenter } from "../../../components/table";

import { PageLoading } from '../../../components/pageLoading';
import { InnerContainer, InnerContainerTitle } from '../../../components/dashboard';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { position_mapping_to_string } from '../../../utils/user';
import { faCircleCheck, faLock } from '@fortawesome/free-solid-svg-icons';
import { useQuery, useQueryClient } from 'react-query';

export const Position = ({ position, func, positionName }) => {

    const locked = !position.event_uuid;
    const active = position.active_position;

    return (
        <SelectableTableRow onClick={locked ? null : func}>
            <TableCell mobileFlex="0 1.5rem" flex="0 1.3rem" center><IconContainer hidden={!locked} color="#ef6c00"><FontAwesomeIcon icon={faLock} title="Stillingen er ikke tilknyttet et arrangement og er permanent. Stillingen kan ikke slettes." /></IconContainer></TableCell>
            <TableCell flex="0 1.3rem"  mobileHide center><IconContainer hidden={!active} color="#43a047"><FontAwesomeIcon icon={faCircleCheck} title="Stillingen er aktiv og gir rettigheter til brukeren." /></IconContainer></TableCell>
            <TableCell flex="0 1px"     mobileHide fillGray />
            <TableCell flex="3"                   >{positionName}</TableCell>
            <TableCell flex="2"                   >{active ? <>Nåværende stilling</> : <>Tidligere stilling</>}</TableCell>
            <TableCell flex="2"         mobileHide>{position.event_name??<b>Permanent stilling</b>}</TableCell>
        </SelectableTableRow>
    )
}



export const UserPositions = ({ inheritUser }) => {
    const queryClient = useQueryClient();

    const { data: user, isLoading } = useQuery(
        ['userPositionsEnriched', inheritUser.uuid],
        async () => {
            let currentEvent = await getCurrentEvent();
            let allEvents = await getEvents();
            let user = await User.getUser(inheritUser.uuid);

            await Promise.all(user.position_mappings.map(async (position_mapping) => {
                const position = position_mapping.position;

                position_mapping.active_position =
                    position_mapping.event_uuid === currentEvent.uuid ||
                    !position_mapping.event_uuid;

                if(position_mapping.event_uuid) {
                    position_mapping.event_name = allEvents.filter(event => event.uuid === position_mapping.event_uuid).map(event => event.name);
                    position_mapping.event_time = allEvents.filter(event => event.uuid === position_mapping.event_uuid).map(event => event.start_time);
                }

                if(position.crew_uuid) {
                    position.crew = await Crew.getCrew(position.crew_uuid);
                    if(position.team_uuid) {
                        position.team = position.crew.teams.find((team) => team.uuid === position.team_uuid)
                    }
                }
            }));

            return user;
        }
    );

    const deletePosition = async (position, positionName) => {
        if(window.confirm("Er du sikker på at du vil fjerne stillingen \"" + positionName + "\" fra " + user.firstname + " " + user.lastname + "?")) {
            try {
                await PositionMapping.deletePositionMapping(position.uuid);
                queryClient.invalidateQueries(['userPositionsEnriched', inheritUser.uuid]);
            } catch(e) {
                console.error("An error occured while attempting to delete the position.\n" + e)
            }
        }
    }

    if(isLoading) {
        return (<PageLoading />)
    } else {
        return (
            <>
                <InnerContainer extramargin>
                    <InnerContainerTitle>Stillinger</InnerContainerTitle>
                    <Table>
                        <TableHead border>
                            <TableRow>
                                <TableCell as="th" mobileFlex="0 1.5rem" flex="0 1.3rem" center title="Indikerer om stillingen kan bli slettet, eller ikke."><InnerColumnCenter>...</InnerColumnCenter></TableCell>
                                <TableCell as="th" mobileHide flex="0 1.3rem" center title="Indikerer om stillingen er aktiv, eller ikke."><InnerColumnCenter>...</InnerColumnCenter></TableCell>
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

                                                func={() => deletePosition(position, positionName)}
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
