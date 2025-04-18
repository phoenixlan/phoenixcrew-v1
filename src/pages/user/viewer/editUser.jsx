import React, { useState, useEffect, useContext } from 'react';
import styled from 'styled-components';
import { User } from "@phoenixlan/phoenix.js";
import { PageLoading } from '../../../components/pageLoading';
import { CardContainer, DashboardContent, DashboardHeader, DashboardSubtitle, DashboardTitle, InnerContainer, InnerContainerRow, InnerContainerTitle, InputContainer, InputElement, InputLabel, InputSelect, PanelButton } from '../../../components/dashboard';

import { Colors } from '../../../theme';
import { AuthenticationContext } from '../../../components/authentication';
import { useHistory, useParams } from 'react-router-dom/cjs/react-router-dom.min';
import { useForm } from 'react-hook-form';
import { Notice } from '../../../components/containers/notice';

export const EditUser = () => {

    const { uuid } = useParams();
    const [ user, setUser ] = useState(undefined);

    let history = useHistory();

    const { register, handleSubmit, formState: { errors } } = useForm();

    // Import the following React contexts:
    const authorizedUser = useContext(AuthenticationContext);

    // Variables to keep track of changes in input components
    const [ firstname, setFirstname ] = useState(null);
    const [ lastname, setLastname ]	= useState(null);
    const [ username, setUsername ]	= useState(null);
    const [ email, setEmail ] = useState(null);
    const [ phone, setPhone ] = useState(null);
    const [ guardianPhone, setGuardianPhone ] = useState(null);
    const [ address, setAddress ] = useState(null);
    const [ postalCode, setPostalCode ]	= useState(null);
    const [ birthdate, setBirthdate ] = useState(null);
    const [ gender, setGender ]	= useState(null);

    // States for error and success, used when attempting to fetch user and update user
    const [ error, setError ] = useState(false);
    const [ updateSuccess, setUpdateSuccess ] = useState(false);

    // Loading state
    const [ loading, setLoading ] = useState(true);

    const onSubmit = async (data) => {
        try { 
            await User.modifyUser(data.uuid, data);
            await reload();
            setUpdateSuccess(true);
            setError(false);
        } catch(e) {
            setUpdateSuccess(false);
			setError(e.message);
			console.error("An error occured while attempting to update the user.\n" + e);
		}
    }

    

    const reload = async () => {
        setLoading(true);

        let user;

        try {
            user = await User.getUser(uuid);
            console.log(user);

            setFirstname(user.firstname);
            setLastname(user.lastname);
            setUsername(user.username);
            setEmail(user.email);
            setPhone(user.phone);
            setGuardianPhone(user.guardian_phone);
            setAddress(user.address);
            setPostalCode(user.postal_code);
            setBirthdate(user.birthdate)
            setGender(user.gender);
        } catch(e) {
            setError(e);
            console.error("An error occured while attempting to gather user information:\n" + e);
        }

        if(user) {
            setUser(user);
        }

        // Logic finished, show the user details page:
        setLoading(false);
    }

    useEffect(() => {
        reload();
    }, []);

    if(loading) { // Loading page
        return (
            <PageLoading />
        )
    } else if(user) { // Display edit user form
        return (
            <>
                <DashboardHeader border >
                    <DashboardTitle>
                        Rediger personalia
                    </DashboardTitle>
                    <DashboardSubtitle>
                        {user.firstname} {user.lastname}
                    </DashboardSubtitle>
                </DashboardHeader>

                <DashboardContent>
                    <InnerContainer rowgap>
                        <InnerContainerRow>
                            <InnerContainer flex="1" rowgap>
                                <Notice type="error" visible={error && !updateSuccess}>
                                    {error}
                                </Notice>
                                <Notice type="success" visible={updateSuccess && !error}>
                                    <span>Brukerinformasjonen ble oppdatert.</span>
                                </Notice>
                                <InnerContainer>
                                    <InputElement type="hidden" value={user.uuid} {...register("uuid")} />

                                    <InnerContainerTitle>Personalia og kontaktinformasjon</InnerContainerTitle>
                                    <InnerContainerRow nowrap mobileNoGap>
                                        <CardContainer>
                                            <InputContainer column extramargin>
                                                <InputLabel small>Fornavn</InputLabel>
                                                <InputElement {...register("firstname")} type="text" value={firstname} onChange={(e) => setFirstname(e.target.value)} />
                                            </InputContainer>
                                        </CardContainer>

                                        <CardContainer>
                                            <InputContainer column extramargin>
                                                <InputLabel small>Etternavn</InputLabel>
                                                <InputElement {...register("lastname")} type="text" value={lastname} onChange={(e) => setLastname(e.target.value)} />
                                            </InputContainer>
                                        </CardContainer>
                                    </InnerContainerRow>

                                    <InnerContainerRow nopadding nowrap mobileNoGap>
                                        <CardContainer>
                                            <InputContainer column>
                                                <InputLabel small>Brukernavn / visningsnavn</InputLabel>
                                                <InputElement {...register("username")} type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
                                            </InputContainer>
                                        </CardContainer>
                                        <CardContainer mobileHide />
                                    </InnerContainerRow>

                                    <InnerContainerRow nopadding nowrap mobileNoGap>
                                        <CardContainer>
                                            <InputContainer column extramargin>
                                                <InputLabel small>Epost</InputLabel>
                                                <InputElement {...register("email")} type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                                            </InputContainer>
                                        </CardContainer>
                                    </InnerContainerRow>

                                    <InnerContainerRow nowrap mobileNoGap>
                                        <CardContainer>
                                            <InputContainer column extramargin>
                                                <InputLabel small>Telefon</InputLabel>
                                                <InputElement {...register("phone")} type="text" value={phone} onChange={(e) => setPhone(e.target.value)} />
                                            </InputContainer>
                                        </CardContainer>

                                        <CardContainer>
                                            <InputContainer column extramargin>
                                                <InputLabel small>Foresattes telefon</InputLabel>
                                                <InputElement {...register("guardian_phone")} type="text" value={guardianPhone} onChange={(e) => setGuardianPhone(e.target.value)} />
                                            </InputContainer>
                                        </CardContainer>
                                    </InnerContainerRow>

                                    <InnerContainerRow nowrap mobileNoGap>
                                        <CardContainer>
                                            <InputContainer column extramargin>
                                                <InputLabel small>Adresse</InputLabel>
                                                <InputElement {...register("address")} type="text" value={address} onChange={(e) => setAddress(e.target.value)} />
                                            </InputContainer>
                                        </CardContainer>
                                        <CardContainer>
                                            <InputContainer column extramargin>
                                                <InputLabel small>Postkode</InputLabel>
                                                <InputElement {...register("postal_code")} type="text" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} />
                                            </InputContainer>
                                        </CardContainer>
                                    </InnerContainerRow>

                                    <InnerContainerRow nowrap mobileNoGap>
                                        <CardContainer>
                                            <InputContainer column extramargin>
                                                <InputLabel small>Fødselsdato</InputLabel>
                                                <InputElement {...register("birthdate")} type="date" value={birthdate} onChange={(e) => setBirthdate(e.target.value)} />
                                            </InputContainer>
                                        </CardContainer>
                                        <CardContainer>
                                            <InputContainer column extramargin>
                                                <InputLabel small>Kjønn</InputLabel>
                                                <InputSelect {...register("gender")} value={gender == "Gender.male" ? "male" : undefined || gender == "Gender.female" ? "female" : undefined} onChange={(e) => setGender(e.target.value)}>
                                                    <option value="" disabled></option>
                                                    <option value="male">Mann</option>
                                                    <option value="female">Kvinne</option>
                                                </InputSelect>
                                            </InputContainer>
                                        </CardContainer>
                                    </InnerContainerRow>
                                </InnerContainer>
                            </InnerContainer>
                            <InnerContainer flex="1" mobileHide />
                        </InnerContainerRow>

                        <InnerContainerRow>
                            <InnerContainer flex="1">
                                <CardContainer>
                                    <PanelButton fillWidth type="submit" onClick={handleSubmit(onSubmit)}>Oppdater informasjon</PanelButton>
                                </CardContainer>
                                <CardContainer>
                                    <PanelButton fillWidth type="submit" onClick={() => history.push("/user/" + user.uuid)}>Avbryt</PanelButton>
                                </CardContainer>
                            </InnerContainer>
                            <InnerContainer flex="1" />
                        </InnerContainerRow>
                    </InnerContainer>
                </DashboardContent>
            </>
            
        )
    } else { // Show an error when fetching a user fails
        return (
            <>
                <DashboardHeader border>
                    <DashboardTitle>
                        Rediger personalia
                    </DashboardTitle>
                </DashboardHeader>

                <DashboardContent>
                    <Notice type="error" visible={true}>
                        Det oppsto en feil ved henting av informasjon for denne brukeren.<br />
                        {error.message}
                    </Notice>
                </DashboardContent>
            </>
        )
    }
}