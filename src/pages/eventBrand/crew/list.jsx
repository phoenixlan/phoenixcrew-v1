import React , { useEffect, useState } from "react";
import { Crew } from "@phoenixlan/phoenix.js";
import { PageLoading } from "../../../components/pageLoading"
import { faArrowRight, faCheck, faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { DashboardContent, DashboardHeader, DashboardSubtitle, DashboardTitle, InnerContainer, InnerContainerTitle, InnerContainerRow, InputCheckbox, InputLabel, CardContainer, InputContainer, InputElement, PanelButton } from "../../../components/dashboard";
import { Notice } from "../../../components/containers/notice";
import { Table, TableCell, CrewColorBox, IconContainer, SelectableTableRow, TableHead, TableRow } from "../../../components/table";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useHistory } from "react-router-dom";
import { useForm } from 'react-hook-form';
import { useBrand } from "../../../contexts/brand";
import { useBrandFullCrews } from "../../../hooks/eventBrand/useBrandFullCrews";
import { HexColorPicker } from "react-colorful";

import { useCreateCrewMutation } from "../../../hooks/eventBrand/useCreateCrewMutation";


export const CrewList= () => {
    const { brand, path } = useBrand();
    const [visibleUUID, setVisibleUUID] = useState(false);
    const [color, setColor] = useState("#aabbcc");

    let history = useHistory();

    const { data: crews, isLoading: loading} = useBrandFullCrews(brand.uuid);
    const { register, handleSubmit, formState: { errors } } = useForm({defaultValues: { name: "", description: ""}});

    const create_crew_mutation = useCreateCrewMutation();

    if(loading) {
        return (
            <PageLoading />
        )
    }

    const onSubmit = async (data) => {
        try { 
            create_crew_mutation.mutate({name: data.name,
                description: data.description,
                hex_color: color,
                event_brand_uuid: brand.uuid
            })
        } catch(e) {
            console.error("An error occured while attempting to create the position.\n" + e)
        }
    }

    return (
        <>
            <DashboardHeader border>
                <DashboardTitle>
                    Crew for {brand.name}
                </DashboardTitle>
                <DashboardSubtitle>
                    {crews.length} crew registrert
                </DashboardSubtitle>
            </DashboardHeader>
            <DashboardContent>
                <InnerContainer mobileHide>
                    <InputCheckbox label="Vis crew UUID" value={visibleUUID} onChange={() => setVisibleUUID(!visibleUUID)} />
                </InnerContainer>

                <InnerContainer>
                    <Table>
                        <TableHead border>
                            <TableRow>
                                <TableCell as="th" flex="10" mobileHide visible={!visibleUUID}>UUID</TableCell>
                                <TableCell as="th" flex="0 42px" mobileHide>Farge</TableCell>
                                <TableCell as="th" flex="6" mobileFlex="3">Navn</TableCell>
                                <TableCell as="th" flex="10" mobileHide>Beskrivelse</TableCell>
                                <TableCell as="th" flex="3" mobileFlex="1">Antall<br/>brukere</TableCell>
                                <TableCell as="th" center flex="0 24px" mobileHide title="Statusikon: Ikon vises om crewet kan søkes til eller ikke"><IconContainer>...</IconContainer></TableCell>
                                <TableCell as="th" center flex="0 24px" mobileHide title="Statusikon: Ikon vises om crewet er aktivt eller ikke."><IconContainer>...</IconContainer></TableCell>
                                <TableCell as="th" center flex="0 24px" mobileHide title="Trykk for å åpne"><IconContainer>...</IconContainer></TableCell>
                            </TableRow>
                        </TableHead>
                    
                        {
                            crews.map((crew) => {
                                const crewMembersMap = new Map();
                                crew.positions.forEach((position) => {
                                    position.position_mappings.map(mapping => mapping.user).forEach((user) => {
                                        if(!crewMembersMap.has(user.uuid)) {
                                            crewMembersMap.set(user.uuid, user)
                                        }
                                    })
                                })

                                const crewMembers = Array.from(crewMembersMap.values());

                                return (
                                    <SelectableTableRow key={crew.uuid} onClick={() => history.push(path(`/crew/${crew.uuid}`))} active={!crew.active}>
                                        <TableCell consolas flex="10" mobileHide visible={!visibleUUID}>{ crew.uuid }</TableCell>
                                        <TableCell flex="0 42px" mobileHide><CrewColorBox hex={crew.hex_color} /></TableCell>
                                        <TableCell flex="6" mobileFlex="3">{ crew.name }</TableCell>
                                        <TableCell flex="10" mobileHide>{ crew.description }</TableCell>
                                        <TableCell flex="3" mobileFlex="1">{ crewMembers.length }</TableCell>
                                        <TableCell center flex="0 24px" mobileHide><IconContainer><FontAwesomeIcon icon={crew.is_applyable ? faUserPlus : ""} /></IconContainer></TableCell>
                                        <TableCell center flex="0 24px" mobileHide><IconContainer><FontAwesomeIcon icon={crew.active ? faCheck : ""}/></IconContainer></TableCell>
                                        <TableCell center flex="0 24px" mobileHide><IconContainer><FontAwesomeIcon icon={faArrowRight}/></IconContainer></TableCell>
                                    </SelectableTableRow>
                                )
                            })
                        } 
                    </Table>
                </InnerContainer>
                <InnerContainer>
                    <InnerContainerRow>
                        <InnerContainer flex="1" floattop>
                            <InnerContainerTitle>Nytt crew</InnerContainerTitle>
                            <InnerContainerRow nowrap>
                                <Notice fillWidth type="info" visible={true}>
                                    Crew-farge brukes for å enkelt skille på crew i forbindelse med crewkort, etc
                                </Notice>
                            </InnerContainerRow>

                            <InnerContainerRow nowrap>
                                <CardContainer>
                                    <InputContainer column extramargin>
                                        <InputLabel small>Navn</InputLabel>
                                        <InputElement {...register("name", {required: true})} type="text" />
                                    </InputContainer>
                                </CardContainer>
                            </InnerContainerRow>

                            <InnerContainerRow nowrap>
                                <CardContainer>
                                    <InputContainer column extramargin>
                                        <InputLabel small>Beskrivelse</InputLabel>
                                        <InputElement {...register("description", {required: true})} type="text" />
                                    </InputContainer>
                                </CardContainer>
                            </InnerContainerRow>

                            <InnerContainerRow nowrap>
                                <CardContainer>
                                    <InputContainer column extramargin>
                                        <InputLabel small>Farge</InputLabel>
                                        <HexColorPicker color={color} onChange={setColor} />
                                    </InputContainer>
                                </CardContainer>
                            </InnerContainerRow>

                            <InnerContainerRow>
                                <InnerContainer>
                                    <CardContainer>
                                        <PanelButton fillWidth type="submit" onClick={handleSubmit(onSubmit)}>Lagre</PanelButton>
                                    </CardContainer>
                                </InnerContainer>
                                <InnerContainer />
                            </InnerContainerRow>
                        </InnerContainer>
                    </InnerContainerRow>
                </InnerContainer>
            </DashboardContent>
        </>
    )
}
