import React, { useState, useEffect } from 'react';
import { getCurrentEvent, User, Crew, getEvents, PositionMapping } from "@phoenixlan/phoenix.js";
import { Table, TableCell, TableHead, SelectableTableRow, IconContainer, TableRow, TableBody, InnerColumnCenter } from "../../../components/table";

import { PageLoading } from '../../../components/pageLoading';
import { InnerContainer, InnerContainerTitle } from '../../../components/dashboard';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { position_mapping_to_string } from '../../../utils/user';
import { faCircleCheck, faLock } from '@fortawesome/free-solid-svg-icons';

export const Position = ({ position, func, positionName }) => {

	const locked = !position.event_uuid;
	const active = position.active_position;

	return (
		<SelectableTableRow onClick={locked ? null : func}>
			<TableCell flex="0 1.3rem"  mobileHide center><IconContainer hidden={!locked} color="#ef6c00"><FontAwesomeIcon icon={faLock} title="Stillingen er ikke tilknyttet et arrangement og er permanent. Stillingen kan ikke slettes." /></IconContainer></TableCell>
			<TableCell flex="0 1.3rem"  mobileHide center><IconContainer hidden={!active} color="#43a047"><FontAwesomeIcon icon={faCircleCheck} title="Stillingen er aktiv og gir rettigheter til brukeren." /></IconContainer></TableCell>
			<TableCell flex="0 1px"     mobileHide fillGray />
			<TableCell flex="3"                   >{positionName}</TableCell>
			<TableCell flex="2"                   >{active ? <>Nåværende stilling</> : <>Tidligere stilling</>}</TableCell>
			<TableCell flex="2"         mobileHide>{position.event_name??<b>Permanent stilling</b>}</TableCell>
		</SelectableTableRow>
	)
}



export const UserPositions = ({ inheritUser }) => {

	const [ loading, setLoading ] = useState(true);
	const [ user, setUser ] = useState(inheritUser);

	const reloadPositionList = async () => {
		setLoading(true);
		try {
			let currentEvent = await getCurrentEvent();
			let allEvents = await getEvents();
			let user = await User.getUser(inheritUser.uuid);

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
			}));

			setUser(user);
		} catch(e) {
			console.log(e);
		} finally {
			setLoading(false);
		}
	}

	const deletePosition = async (position, positionName) => {
		if(window.confirm("Er du sikker på at du vil fjerne stillingen \"" + positionName + "\" fra " + user.firstname + " " + user.lastname + "?")) {
			try {
				await PositionMapping.deletePositionMapping(position.uuid);
				reloadPositionList()
			} catch(e) {
				console.error("An error occured while attempting to delete the position.\n" + e)
			}
		}
	}

	useEffect(async () => {
		reloadPositionList();
	}, [])

	if(loading) {
		return (<PageLoading />)
	} else {
		return (
			<>
				<InnerContainer extramargin>
					<InnerContainerTitle>Stillinger</InnerContainerTitle>
					<Table>
						<TableHead border>
							<TableRow>
								<TableCell as="th" flex="0 1.3rem" mobileHide center title="Indikerer om stillingen kan bli slettet, eller ikke."><InnerColumnCenter>...</InnerColumnCenter></TableCell>
								<TableCell as="th" flex="0 1.3rem" mobileHide center title="Indikerer om stillingen er aktiv, eller ikke."><InnerColumnCenter>...</InnerColumnCenter></TableCell>
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

												func={() => deletePosition(position, positionName)} />
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