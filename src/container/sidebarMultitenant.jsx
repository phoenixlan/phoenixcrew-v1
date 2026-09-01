import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { AccountAvatar, AccountAvatarContainer, AccountDetails, AccountLogoutButton, AccountLogoutContainer, AccountName, AccountRole, BrandManagementContainer, ElementEntry, ElementEntryIcon, ElementEntryIconContainer, ElementEntryTitle, ElementEntryTitleContianer, ElementGroup, ElementGroupEntries, ElementGroupHeader, ElementGroupIcon, ElementGroupIconContainer, ElementGroupTitle, ElementGroupTitleContainer, EventManagementContainer, HeaderContainer, ManagementElements, RootContainer, SidebarAccountContainer, SidebarLogoContainer, SidebarManagementContainer, SidebarSearch, SidebarSearchContainer, SidebarSystemHeaderContainer, SiteHeaderContainer, SiteManagementContainer, SiteManagementElementGroup, SiteManagementElements, SiteTitle, SiteTitleContainer, SiteTitleGeneric, SiteTitleOrg, SystemHeaderIconContainer, SystemHeaderSubtitle, SystemHeaderTitle, SystemHeaderTitleContainer, TitleContainer } from "../components/sidebarComponents"
import { faChartLine, faCogs, faHammer, faInfo, faRightFromBracket, faTicket, faTicketAlt, faUsersGear } from "@fortawesome/free-solid-svg-icons"


export const MultitenantSidebar = () => {

    return (
        <RootContainer>
            <SidebarSystemHeaderContainer>
                <SystemHeaderIconContainer>

                </SystemHeaderIconContainer>

                <SystemHeaderTitleContainer>
                    <SystemHeaderTitle>Radar Event</SystemHeaderTitle>
                    <SystemHeaderSubtitle>Administrasjonsside</SystemHeaderSubtitle>
                </SystemHeaderTitleContainer>
            </SidebarSystemHeaderContainer>

            <SidebarAccountContainer>
                <AccountAvatarContainer>
                    <AccountAvatar />
                </AccountAvatarContainer>

                <AccountDetails>
                    <AccountName>Fornavn Etternavn</AccountName>
                    <AccountRole>Phoenix LAN Administrator</AccountRole>
                </AccountDetails>

                <AccountLogoutContainer>
                    <AccountLogoutButton><FontAwesomeIcon icon={faRightFromBracket} /></AccountLogoutButton>
                </AccountLogoutContainer>
            </SidebarAccountContainer>

            <SidebarSearchContainer>
                <SidebarSearch placeholder="Søk ..." />
            </SidebarSearchContainer>

            <SidebarManagementContainer>
                <SiteManagementContainer>
                    <HeaderContainer>
                        <TitleContainer>
                            <SiteTitleGeneric>Organisasjon administrasjon</SiteTitleGeneric>
                            <SiteTitleOrg>Radar Event</SiteTitleOrg>
                        </TitleContainer>
                    </HeaderContainer>
                    
                    <ManagementElements>
                        <ElementGroup>
                            <ElementGroupHeader>
                                <ElementGroupIconContainer>
                                    <ElementGroupIcon><FontAwesomeIcon icon={faCogs} /></ElementGroupIcon>
                                </ElementGroupIconContainer>
                                <ElementGroupTitleContainer>
                                    <ElementGroupTitle>System innstillinger</ElementGroupTitle>
                                </ElementGroupTitleContainer>
                            </ElementGroupHeader>

                            <ElementGroupEntries>
                                <ElementEntry>
                                    <ElementEntryIconContainer>
                                        <ElementEntryIcon></ElementEntryIcon>
                                    </ElementEntryIconContainer>
                                    <ElementEntryTitleContianer>
                                        <ElementEntryTitle>Organisasjonsinformasjon</ElementEntryTitle>
                                    </ElementEntryTitleContianer>
                                </ElementEntry>

                                <ElementEntry>
                                    <ElementEntryIconContainer>
                                        <ElementEntryIcon></ElementEntryIcon>
                                    </ElementEntryIconContainer>
                                    <ElementEntryTitleContianer>
                                        <ElementEntryTitle>Sanity check</ElementEntryTitle>
                                    </ElementEntryTitleContianer>
                                </ElementEntry>
                            </ElementGroupEntries>
                        </ElementGroup>

                        <ElementGroup>
                            <ElementGroupHeader>
                                <ElementGroupIconContainer>
                                    <ElementGroupIcon><FontAwesomeIcon icon={faHammer} /></ElementGroupIcon>
                                </ElementGroupIconContainer>
                                <ElementGroupTitleContainer>
                                    <ElementGroupTitle>Administrasjon</ElementGroupTitle>
                                </ElementGroupTitleContainer>
                            </ElementGroupHeader>

                            <ElementGroupEntries>
                                <ElementEntry>
                                    <ElementEntryIconContainer>
                                        <ElementEntryIcon></ElementEntryIcon>
                                    </ElementEntryIconContainer>
                                    <ElementEntryTitleContianer>
                                        <ElementEntryTitle>Arrangementstyper</ElementEntryTitle>
                                    </ElementEntryTitleContianer>
                                </ElementEntry>

                                <ElementEntry>
                                    <ElementEntryIconContainer>
                                        <ElementEntryIcon></ElementEntryIcon>
                                    </ElementEntryIconContainer>
                                    <ElementEntryTitleContianer>
                                        <ElementEntryTitle>Rettigheter</ElementEntryTitle>
                                    </ElementEntryTitleContianer>
                                </ElementEntry>

                                <ElementEntry>
                                    <ElementEntryIconContainer>
                                        <ElementEntryIcon></ElementEntryIcon>
                                    </ElementEntryIconContainer>
                                    <ElementEntryTitleContianer>
                                        <ElementEntryTitle>Søk brukere</ElementEntryTitle>
                                    </ElementEntryTitleContianer>
                                </ElementEntry>

                                <ElementEntry>
                                    <ElementEntryIconContainer>
                                        <ElementEntryIcon></ElementEntryIcon>
                                    </ElementEntryIconContainer>
                                    <ElementEntryTitleContianer>
                                        <ElementEntryTitle>Medlemsskap register</ElementEntryTitle>
                                    </ElementEntryTitleContianer>
                                </ElementEntry>

                                <ElementEntry>
                                    <ElementEntryIconContainer>
                                        <ElementEntryIcon></ElementEntryIcon>
                                    </ElementEntryIconContainer>
                                    <ElementEntryTitleContianer>
                                        <ElementEntryTitle>Godkjenning av avatarer</ElementEntryTitle>
                                    </ElementEntryTitleContianer>
                                </ElementEntry>
                            </ElementGroupEntries>
                        </ElementGroup>
                    </ManagementElements>
                </SiteManagementContainer>

                <EventManagementContainer>
                    <HeaderContainer>
                        <TitleContainer>
                            <SiteTitleGeneric>Arrangement administrasjon</SiteTitleGeneric>
                            <SiteTitleOrg>Phoenix LAN</SiteTitleOrg>
                        </TitleContainer>
                    </HeaderContainer>
                    
                    <ManagementElements>
                        <ElementGroup>
                            <ElementGroupHeader>
                                <ElementGroupIconContainer>
                                    <ElementGroupIcon><FontAwesomeIcon icon={faHammer} /></ElementGroupIcon>
                                </ElementGroupIconContainer>
                                <ElementGroupTitleContainer>
                                    <ElementGroupTitle>Arrangement administrasjon</ElementGroupTitle>
                                </ElementGroupTitleContainer>
                            </ElementGroupHeader>

                            <ElementGroupEntries>
                                <ElementEntry>
                                    <ElementEntryIconContainer>
                                        <ElementEntryIcon></ElementEntryIcon>
                                    </ElementEntryIconContainer>
                                    <ElementEntryTitleContianer>
                                        <ElementEntryTitle>Stillinger og rettigheter</ElementEntryTitle>
                                    </ElementEntryTitleContianer>
                                </ElementEntry>

                                <ElementEntry>
                                    <ElementEntryIconContainer>
                                        <ElementEntryIcon></ElementEntryIcon>
                                    </ElementEntryIconContainer>
                                    <ElementEntryTitleContianer>
                                        <ElementEntryTitle>Arrangementer</ElementEntryTitle>
                                    </ElementEntryTitleContianer>
                                </ElementEntry>
                            </ElementGroupEntries>
                        </ElementGroup>

                        <ElementGroup>
                            <ElementGroupHeader>
                                <ElementGroupIconContainer>
                                    <ElementGroupIcon><FontAwesomeIcon icon={faUsersGear} /></ElementGroupIcon>
                                </ElementGroupIconContainer>
                                <ElementGroupTitleContainer>
                                    <ElementGroupTitle>Gruppeleder</ElementGroupTitle>
                                </ElementGroupTitleContainer>
                            </ElementGroupHeader>

                            <ElementGroupEntries>
                                <ElementEntry>
                                    <ElementEntryIconContainer>
                                        <ElementEntryIcon></ElementEntryIcon>
                                    </ElementEntryIconContainer>
                                    <ElementEntryTitleContianer>
                                        <ElementEntryTitle>Crew oversikt</ElementEntryTitle>
                                    </ElementEntryTitleContianer>
                                </ElementEntry>

                                <ElementEntry>
                                    <ElementEntryIconContainer>
                                        <ElementEntryIcon></ElementEntryIcon>
                                    </ElementEntryIconContainer>
                                    <ElementEntryTitleContianer>
                                        <ElementEntryTitle>Alle crewmedlemmer</ElementEntryTitle>
                                    </ElementEntryTitleContianer>
                                </ElementEntry>

                                <ElementEntry>
                                    <ElementEntryIconContainer>
                                        <ElementEntryIcon></ElementEntryIcon>
                                    </ElementEntryIconContainer>
                                    <ElementEntryTitleContianer>
                                        <ElementEntryTitle>Søknader</ElementEntryTitle>
                                    </ElementEntryTitleContianer>
                                </ElementEntry>
                            </ElementGroupEntries>
                        </ElementGroup>

                        <ElementGroup>
                            <ElementGroupHeader>
                                <ElementGroupIconContainer>
                                    <ElementGroupIcon><FontAwesomeIcon icon={faTicket} /></ElementGroupIcon>
                                </ElementGroupIconContainer>
                                <ElementGroupTitleContainer>
                                    <ElementGroupTitle>Billett administrasjon</ElementGroupTitle>
                                </ElementGroupTitleContainer>
                            </ElementGroupHeader>

                            <ElementGroupEntries>
                                <ElementEntry>
                                    <ElementEntryIconContainer>
                                        <ElementEntryIcon></ElementEntryIcon>
                                    </ElementEntryIconContainer>
                                    <ElementEntryTitleContianer>
                                        <ElementEntryTitle>Alle billetter</ElementEntryTitle>
                                    </ElementEntryTitleContianer>
                                </ElementEntry>

                                <ElementEntry>
                                    <ElementEntryIconContainer>
                                        <ElementEntryIcon></ElementEntryIcon>
                                    </ElementEntryIconContainer>
                                    <ElementEntryTitleContianer>
                                        <ElementEntryTitle>Gratisbilletter</ElementEntryTitle>
                                    </ElementEntryTitleContianer>
                                </ElementEntry>

                                <ElementEntry>
                                    <ElementEntryIconContainer>
                                        <ElementEntryIcon></ElementEntryIcon>
                                    </ElementEntryIconContainer>
                                    <ElementEntryTitleContianer>
                                        <ElementEntryTitle>Billett-gavekort</ElementEntryTitle>
                                    </ElementEntryTitleContianer>
                                </ElementEntry>

                                <ElementEntry>
                                    <ElementEntryIconContainer>
                                        <ElementEntryIcon></ElementEntryIcon>
                                    </ElementEntryIconContainer>
                                    <ElementEntryTitleContianer>
                                        <ElementEntryTitle>Aktive kjøp</ElementEntryTitle>
                                    </ElementEntryTitleContianer>
                                </ElementEntry>
                        
                                <ElementEntry>
                                    <ElementEntryIconContainer>
                                        <ElementEntryIcon></ElementEntryIcon>
                                    </ElementEntryIconContainer>
                                    <ElementEntryTitleContianer>
                                        <ElementEntryTitle>Billett typer</ElementEntryTitle>
                                    </ElementEntryTitleContianer>
                                </ElementEntry>

                                <ElementEntry>
                                    <ElementEntryIconContainer>
                                        <ElementEntryIcon></ElementEntryIcon>
                                    </ElementEntryIconContainer>
                                    <ElementEntryTitleContianer>
                                        <ElementEntryTitle>Setekart</ElementEntryTitle>
                                    </ElementEntryTitleContianer>
                                </ElementEntry>
                            </ElementGroupEntries>
                        </ElementGroup>

                        <ElementGroup>
                            <ElementGroupHeader>
                                <ElementGroupIconContainer>
                                    <ElementGroupIcon><FontAwesomeIcon icon={faChartLine} /></ElementGroupIcon>
                                </ElementGroupIconContainer>
                                <ElementGroupTitleContainer>
                                    <ElementGroupTitle>Statistikk</ElementGroupTitle>
                                </ElementGroupTitleContainer>
                            </ElementGroupHeader>

                            <ElementGroupEntries>
                                <ElementEntry>
                                    <ElementEntryIconContainer>
                                        <ElementEntryIcon></ElementEntryIcon>
                                    </ElementEntryIconContainer>
                                    <ElementEntryTitleContianer>
                                        <ElementEntryTitle>Billettsalg</ElementEntryTitle>
                                    </ElementEntryTitleContianer>
                                </ElementEntry>

                                <ElementEntry>
                                    <ElementEntryIconContainer>
                                        <ElementEntryIcon></ElementEntryIcon>
                                    </ElementEntryIconContainer>
                                    <ElementEntryTitleContianer>
                                        <ElementEntryTitle>Brukerbase</ElementEntryTitle>
                                    </ElementEntryTitleContianer>
                                </ElementEntry>

                                <ElementEntry>
                                    <ElementEntryIconContainer>
                                        <ElementEntryIcon></ElementEntryIcon>
                                    </ElementEntryIconContainer>
                                    <ElementEntryTitleContianer>
                                        <ElementEntryTitle>Aldersfordeling</ElementEntryTitle>
                                    </ElementEntryTitleContianer>
                                </ElementEntry>
                            </ElementGroupEntries>
                        </ElementGroup>

                        <ElementGroup>
                            <ElementGroupHeader>
                                <ElementGroupIconContainer>
                                    <ElementGroupIcon><FontAwesomeIcon icon={faInfo} /></ElementGroupIcon>
                                </ElementGroupIconContainer>
                                <ElementGroupTitleContainer>
                                    <ElementGroupTitle>Informasjon</ElementGroupTitle>
                                </ElementGroupTitleContainer>
                            </ElementGroupHeader>

                            <ElementGroupEntries>
                                <ElementEntry>
                                    <ElementEntryIconContainer>
                                        <ElementEntryIcon></ElementEntryIcon>
                                    </ElementEntryIconContainer>
                                    <ElementEntryTitleContianer>
                                        <ElementEntryTitle>Timeplan</ElementEntryTitle>
                                    </ElementEntryTitleContianer>
                                </ElementEntry>

                                <ElementEntry>
                                    <ElementEntryIconContainer>
                                        <ElementEntryIcon></ElementEntryIcon>
                                    </ElementEntryIconContainer>
                                    <ElementEntryTitleContianer>
                                        <ElementEntryTitle>Send e-post</ElementEntryTitle>
                                    </ElementEntryTitleContianer>
                                </ElementEntry>
                            </ElementGroupEntries>
                        </ElementGroup>
                    </ManagementElements>
                </EventManagementContainer>
            </SidebarManagementContainer>
        </RootContainer>
    )
}