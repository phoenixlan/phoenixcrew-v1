import { useForm } from "react-hook-form";
import { CardContainer, CardContainerIcon, CardContainerInnerIcon, CardContainerInput, CardContainerInputWrapper, CardContainerSelectInput, CardContainerText, InnerContainer, InnerContainerRow, InnerContainerTitle, InputElement, InputLabel, PanelButton } from "../../../dashboard"
import { useContext, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAddressCard, faCalendar, faEnvelope, faUser } from "@fortawesome/free-regular-svg-icons";
import { faMapPin, faPhone } from "@fortawesome/free-solid-svg-icons";
import { User } from "@phoenixlan/phoenix.js";
import { WindowManagerContext } from "../../windowManager";

export const EditUserDetails = ({ entries }) => {

	// Inherit WindowManagerContext
    const windowManager = useContext(WindowManagerContext);

    const { register, handleSubmit, formState: { errors } } = useForm();

	// Variables to keep track of changes in input components
	const [ firstname, setFirstname ]			= useState(entries.firstname);
	const [ lastname, setLastname ]				= useState(entries.lastname);
	const [ username, setUsername ]				= useState(entries.username);
	const [ email, setEmail ]					= useState(entries.email);
	const [ phone, setPhone ]					= useState(entries.phone);
	const [ guardianPhone, setGuardianPhone ]	= useState(entries.guardian_phone);
	const [ address, setAddress ]				= useState(entries.address);
	const [ postalCode, setPostalCode ]			= useState(entries.postal_code);
	const [ birthdate, setBirthdate ]			= useState(entries.birthdate);
	const [ gender, setGender ]					= useState(entries.gender);

    const onSubmit = async (data) => {
		try { 
			await User.modifyUser(data.uuid, data.firstname, data.lastname, data.username, data.email, data.phone, data.guardian_phone, data.address, data.postal_code, data.birthdate, data.gender);
			windowManager.exitWindow();
		} catch(e) {
			console.error("An error occured while attempting to update the user.\n" + e);
		}
    }

	return (
		<>
				<InnerContainerRow flex="1">
					<InnerContainer flex="1" nopadding>
						<InnerContainer flex="1" mobileRowGap="0em" nopadding>
							<InnerContainerTitle>Personalia og kontoinformasjon</InnerContainerTitle>

							<InputElement type="hidden" value={entries.uuid} {...register("uuid")} />
							<InnerContainerRow nopadding nowrap>
								<CardContainer>
									<CardContainerIcon>
										<CardContainerInnerIcon>
											<FontAwesomeIcon icon={faUser} />
										</CardContainerInnerIcon>
									</CardContainerIcon>
									<CardContainerInputWrapper>
										<CardContainerText>
											<InputLabel small>Fornavn</InputLabel>
											<CardContainerInput {...register("firstname")} type="text" value={firstname} onChange={(e) => setFirstname(e.target.value)} />
										</CardContainerText>
										<CardContainerText>
											<InputLabel small>Etternavn</InputLabel>
											<CardContainerInput {...register("lastname")} type="text" value={lastname} onChange={(e) => setLastname(e.target.value)} />
										</CardContainerText>
									</CardContainerInputWrapper>
								</CardContainer>
							</InnerContainerRow>

							<InnerContainerRow nopadding nowrap>
								<CardContainer>
									<CardContainerIcon>
										<CardContainerInnerIcon>
											<FontAwesomeIcon icon={faAddressCard} />
										</CardContainerInnerIcon>
									</CardContainerIcon>
									<CardContainerInputWrapper>
										<CardContainerText>
											<InputLabel small>Brukernavn</InputLabel>
											<CardContainerInput {...register("username")} type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
										</CardContainerText>
										<CardContainerText mobileHide />
									</CardContainerInputWrapper>
								</CardContainer>
							</InnerContainerRow>

							<InnerContainerRow nopadding nowrap>
								<CardContainer>
									<CardContainerIcon>
										<CardContainerInnerIcon>
											<FontAwesomeIcon icon={faEnvelope} />
										</CardContainerInnerIcon>
									</CardContainerIcon>
									<CardContainerInputWrapper>
										<CardContainerText>
											<InputLabel small>Epost</InputLabel>
											<CardContainerInput {...register("email")} type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
										</CardContainerText>
									</CardContainerInputWrapper>
								</CardContainer>
							</InnerContainerRow>

							<InnerContainerRow nopadding nowrap>
								<CardContainer>
									<CardContainerIcon>
										<CardContainerInnerIcon>
											<FontAwesomeIcon icon={faPhone} />
										</CardContainerInnerIcon>
									</CardContainerIcon>
									<CardContainerInputWrapper>
										<CardContainerText>
											<InputLabel small>Telefon</InputLabel>
											<CardContainerInput {...register("phone")} type="text" value={phone} onChange={(e) => setPhone(e.target.value)} />
										</CardContainerText>
										<CardContainerText>
											<InputLabel small>Foresattes telefon</InputLabel>
											<CardContainerInput {...register("guardian_phone")} type="text" value={guardianPhone} onChange={(e) => setGuardianPhone(e.target.value)} />
										</CardContainerText>
									</CardContainerInputWrapper>
								</CardContainer>
							</InnerContainerRow>

							<InnerContainerRow nopadding>
								<CardContainer>
									<CardContainerIcon>
										<CardContainerInnerIcon>
											<FontAwesomeIcon icon={faMapPin} />
										</CardContainerInnerIcon>
									</CardContainerIcon>
									<CardContainerInputWrapper>
										<CardContainerText>
											<InputLabel small>Addresse</InputLabel>
											<CardContainerInput {...register("address")} type="text" value={address} onChange={(e) => setAddress(e.target.value)} />
										</CardContainerText>
										<CardContainerText>
											<InputLabel small>Postkode</InputLabel>
											<CardContainerInput {...register("postal_code")} type="text" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} />
										</CardContainerText>
									</CardContainerInputWrapper>
								</CardContainer>
							</InnerContainerRow>

							<InnerContainerRow nowrap>
								<CardContainer>
									<CardContainerIcon>
										<CardContainerInnerIcon>
											<FontAwesomeIcon icon={faCalendar} />
										</CardContainerInnerIcon>
									</CardContainerIcon>
									<CardContainerInputWrapper>
										<CardContainerText>
											<InputLabel small>Fødselsdato</InputLabel>
											<CardContainerInput {...register("birthdate")} type="date" value={birthdate} onChange={(e) => setBirthdate(e.target.value)} />
										</CardContainerText>
										<CardContainerText>
											<InputLabel small>Kjønn</InputLabel>
											<CardContainerSelectInput {...register("gender")} value={gender == "Gender.male" ? "male" : undefined || gender == "Gender.female" ? "female" : undefined} onChange={(e) => setGender(e.target.value)}>
												<option value="" disabled selected></option>
												<option value="male">Mann</option>
												<option value="female">Kvinne</option>
											</CardContainerSelectInput>
										</CardContainerText>
									</CardContainerInputWrapper>
								</CardContainer>
							</InnerContainerRow>
							
							<InnerContainerRow mobileNoGap nopadding>
								<PanelButton type="submit" onClick={handleSubmit(onSubmit)} flex>Oppdater brukerinformasjon</PanelButton>
							</InnerContainerRow>
						</InnerContainer>
					</InnerContainer>
				</InnerContainerRow>
		</>
	)
} 