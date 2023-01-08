import React, { useContext, useState } from 'react';
import styled from "styled-components";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { AuthenticationContext } from '../components/authentication';
import { SidebarButton } from "./sidebarButton";
import Logo from "../assets/phoenixlan_square_logo.png";

import { faGavel, faUser, faTicketAlt, faCalendar, faCircle, faUserFriends, faSignOutAlt, faInfo, faKey, faFileSignature, faPortrait } from '@fortawesome/free-solid-svg-icons';
import { SidebarAvatar } from '../components/sidebarAvatar';
import { Link } from 'react-router-dom';
import { MQContext } from './mq-topNavigation';
export const CategoryContext = React.createContext({});

const commonWidth   =   "44px";
const commonHeight  =   "44px";
const commonPadding =   "8px";

const S = {
    Sidebar: styled.div`
        position: fixed;
        width: 254px;
        display: flex;
        flex-flow: column;
        height: 100vh;
        background-color: rgb(242, 242, 242);
        border-right: 1px solid rgb(235, 235, 235);
        z-index: 1000;
    
        @media screen and (max-width: 480px) {
            position: fixed;
            top: 0;
            width: 100%;
            height: max-content;
            margin-top: 60px;
            border-bottom: 1px solid rgb(235, 235, 235);
        }
    `,
        SidebarLogoContainer: styled.div`
            display: flex;
            
            @media screen and (max-width: 480px) {
                display: none;
            }
        `,
            LogoIcon: styled.div`
                background-color: rgb(255, 170, 210);
                width: ${commonWidth};
                height: ${commonHeight};
                flex: 1 0;
            `,
                Logo: styled.img`
                    width: calc(${commonWidth} - 16px);
                    height: calc(${commonHeight} - 16px);
                    padding: 8px;
                `,
            LogoTitle: styled.div`
                display: flex;
                flex-flow: column;
                width: calc(100% - ${commonPadding});
                height: ${commonHeight};
                background-color: rgb(255, 170, 210);
                padding-left: ${commonPadding};
            `,
                PhoenixTitle: styled.span`
                    font-size: 18px;
                    font-family: PhoenixTitle, "Roboto";
                    margin: auto auto 0 0;
                `,
                PhoenixSiteTitle: styled.span`
                    font-size: 12px;
                    margin: 0 auto auto 0;
                `,

        SidebarAccountInfo: styled.div`
            display: flex;
            border-bottom: 1px solid rgb(235, 235, 235);

            @media screen and (max-width: 480px) {
                display: none;
            }
        `,
            AccountLink: styled(Link)`
                display: flex;
                color: black;
                text-decoration: none;
                flex: 1;
            `,

                AccountImageContainer: styled.div`
                    width: ${commonWidth};
                    height: ${commonHeight};
                    flex: 1 0;
                `,
                    AccountImage: styled(SidebarAvatar)`
                        width: calc(${commonWidth} - 16px);
                        height: calc(${commonHeight} - 16px);
                    `,
                AccountInformation: styled.div`
                    display: flex;
                    flex-flow: column;
                    width: 100%;
                    height: ${commonHeight};
                    padding-left: ${commonPadding};

                    
                `,
                    AccountName: styled.span`
                        font-weight: 700;
                        white-space: nowrap;
                        font-size: 12px;
                        margin-top: auto;
                    `,
                    AccountRole: styled.span`
                        white-space: nowrap;
                        font-size: 12px;
                        margin-bottom: auto;
                    `,

            AccountLogout: styled.div`
                display: flex;
                padding-right: 12px;
                flex: 0;
            `,
                LogoutIcon: styled.div`
                    position: relative;
                    margin: auto;
                    color: rgb(120, 120, 120);
                    transition .2s;
                    cursor: pointer;

                    &:hover {
                        color: rgb(70, 70, 70);
                    }
                `,

        SidebarSearchContainer: styled.div`
            display: flex;
            height: ${commonHeight};
            padding: 0 16px;

            @media screen and (max-width: 480px) {
                border-top: 1px solid rgb(235, 235, 235);
            }
        `,
            SearchInput: styled.input`
                font-size: 14px;
                background-color: rgb(235, 235, 235);
                padding: 4px 16px;
                margin: auto;
                border: none;
                width: calc(100% - 32px);
                border-bottom: 1px solid rgb(225, 225, 225);
        
                &:active, &:focus {
                    outline: none;
                }
            `,

        SidebarCrewManagementContainer: styled.div`
            display: flex;
            flex-flow: column;
        `,
            CrewManagementCategory: styled.div`
                display: flex;
                flex-flow: row;
                margin-bottom: 12px;
                cursor: pointer; 
                -webkit-tap-highlight-color: transparent;
            `,
                SidebarCrewManagementMenuIcon: styled.div`
                    display: flex;
                    height: calc(${commonHeight} / 1.2);
                    width: ${commonWidth};
                `,
                    ElementIconContainer: styled.div`
                        display: flex;
                        margin: auto;
                    `,

                    ElementIconCont: styled.div`
                        display: flex;
                        margin: auto;
                        height: 44px;
                    `,
                        ElementIcon: styled.div`
                            margin: auto;
                        `,
            
            CrewManagementElements: styled.div`
                flex: 1;
                display: flex;
                flex-flow: column;
            `,
                CrewManagementElementsHeader: styled.div`
                    display: flex;
                    flex-flow: column;
                    min-height: calc(${commonHeight} / 1.2);
                `,
                    ElementHeader: styled.span`
                        margin: auto 0;
                        font-size: 14px;
                        font-weight: 500;
                    `,
                CrewManagementElementsContent: styled.div`
                    display: flex;
                    flex-flow: column;
                    overflow: hidden;
                `,

    CategoryWrapper: styled.div`
        position: relative;
    `,





    Container: styled.div`
        position: fixed;
        top: 0;
        left: 0;
        width: 48px;
        height: 100%;

        display: none;
        flex-direction: column;

        background-color: rgb(225, 225, 225);
    `,
    LogoC: styled.div`
    `,



    Buttons: styled.div`
        flex: 1;
        width: 100%;
    `,
    Bottom: styled.div`
        height: 4em;
    `,


    IconContainer: styled.div`
        width: 36px;
        position: relative;
        top: 1px;
        font-size: 12px;
    `,
    IconInnerContainer: styled.div`
        width: 18px;
        margin: 0 auto;
    `,
    TitleContainer: styled.div`
        width: 100%;
    `,
    Title: styled.span`
        margin: 0;
        white-space: nowrap;
    `,

    SearchC: styled.div`
        
    `,
        SearchLogo: styled.div`
            
            margin: auto;
        `,


}

export const options = [
    {
        title: "My crew",
        icon: faUser,
        entries: []
    },
    {
        title: "Administrasjon",
        icon: faGavel,
        roles: ["admin"],
        entries: [
            {
                title: "Stillinger og rettigheter",
                icon: faKey,
                url: "/positions/"
            },
            {
                title: "Brukere",
                icon: faCircle,
                url: "/users/"
            },
            {
                title: "Arrangementer",
                icon: faCalendar,
                url: "/events/"
            }
        ]
    },
    {
        title: "Gruppeleder",
        icon: faUserFriends,
        roles: ["chief", "admin"],
        entries: [
            {
                title: "Crew",
                icon: faCircle,
                url: "/crews/"
            },
            {
                title: "Godkjenning av avatarer",
                icon: faPortrait,
                url: "/avatar/approval"
            },
            {
                title: "Søknader",
                icon: faFileSignature,
                url: "/application"
            }
        ]
    },
    {
        title: "Billett administrasjon",
        icon: faTicketAlt,
        roles: ["ticket_admin", "admin", "ticket_checkin"],
        entries: [
            {
                title: "Alle billetter",
                icon: faTicketAlt,
                url: "/tickets/"
            },
            {
                title: "Gratisbilletter",
                icon: faTicketAlt,
                url: "/tickets/free"
            },
            {
                title: "Medlemskap-info",
                icon: faTicketAlt,
                url: "/tickets/memberships"
            },
            {
                title: "Aktive kjøp",
                icon: faTicketAlt,
                url: "/store_sessions"
            },
            {
                title: "Setekart",
                icon: faTicketAlt,
                url: "/seatmap/"
            }
        ]
    },
    {
        title: "Informasjon",
        icon: faInfo,
        roles: ["chief", "info_admin", "admin", "event_admin", "compo_admin"],
        entries: [
            {
                title: "Agenda",
                icon: faCalendar,
                url: "/agenda/"
            }
        ]
    }
]


export const Sidebar = () => {
    const auth = useContext(AuthenticationContext);
    const [searchText, setSearchText] = useState("");
    const searchTextLower = searchText.toLowerCase();

    const onSearchUpdate = (event) => {
        setSearchText(event.target.value);
    }

    console.log(auth)

    //Search among menu options
    const availableOptions = options.map(option => {
        return {
            ...option,
            entries: option.entries.filter(entry => {
                if(searchTextLower.length != 0 && entry.title.toLowerCase().indexOf(searchTextLower) === -1) {
                    return false;
                }
                let valid = false;
                for(let role of option.roles) {
                    if(auth.roles.indexOf(role) !== -1) {
                        valid = true;
                        break;
                    }
                }
                if(!valid && entry.roles) {
                    for(let role of entry.roles) {
                        if(auth.roles.indexOf(role) !== -1) {
                            valid = true;
                            break;
                        }
                    }
                }

                return valid
            })
        }
    
    })

    const CrewManagementElementContent = (entry) => {
        return entry.entries.map(innerEntry => {
            return (
                <SidebarButton key={innerEntry.title} to={innerEntry.url}>
                    <S.IconContainer>
                        <S.IconInnerContainer>
                            <FontAwesomeIcon icon={innerEntry.icon} />
                        </S.IconInnerContainer>
                    </S.IconContainer>
                    <S.TitleContainer>
                        <S.Title>{innerEntry.title}</S.Title>
                    </S.TitleContainer>
                </SidebarButton>)
        })
    }

    const getFittingPosition = (mappings) => {
        const named = mappings.filter(mapping => !!mapping.position.name)
        if(named.length > 0) {
            return named[0].position.name
        }
        else if(mappings.length == 0) {
            return mappings[0].position.name
        } else {
            return `${mappings.length} stillinger`
        }
    }

    return (

        <S.Sidebar>
            <S.SidebarLogoContainer>
                <S.LogoIcon>
                    <S.Logo src={Logo} />
                </S.LogoIcon>
                <S.LogoTitle>
                    <S.PhoenixTitle>Phoenix LAN</S.PhoenixTitle>
                    <S.PhoenixSiteTitle>Crew Management</S.PhoenixSiteTitle>
                </S.LogoTitle>
            </S.SidebarLogoContainer>

            <S.SidebarAccountInfo>
                <S.AccountLink to={"/user/"+auth.authUser.uuid}>
                    <S.AccountImageContainer>
                        <S.AccountImage user={auth.authUser} />
                    </S.AccountImageContainer>
                    <S.AccountInformation>
                        <S.AccountName>{auth.authUser.firstname} {auth.authUser.lastname}</S.AccountName>
                        <S.AccountRole>{getFittingPosition(auth.authUser.position_mappings)}</S.AccountRole>
                    </S.AccountInformation>
                </S.AccountLink>
                <S.AccountLogout onClick={() => auth.logout()} title="Logg ut">
                    <S.LogoutIcon>
                        <FontAwesomeIcon icon={faSignOutAlt}/>
                    </S.LogoutIcon>
                </S.AccountLogout>
            </S.SidebarAccountInfo>

            <S.SidebarSearchContainer>
                <S.SearchInput value={searchText} onChange={onSearchUpdate} placeholder="Søk..." type="text" />
            </S.SidebarSearchContainer>

            <S.SidebarCrewManagementContainer id="sidebarCrewManagementContainer">
                {
                    availableOptions.map(entry => {
                        return entry.entries.length == 0 ? null : (
                            <S.CrewManagementCategory>
                                <S.SidebarCrewManagementMenuIcon id="menuIcon">
                                    <S.ElementIconContainer id="iconContainer">
                                        <FontAwesomeIcon icon={entry.icon} />
                                    </S.ElementIconContainer>
                                </S.SidebarCrewManagementMenuIcon>

                                <S.CrewManagementElements key={entry.title} title={entry.title}>
                                    <S.CrewManagementElementsHeader>
                                        <S.ElementHeader>{entry.title}</S.ElementHeader>
                                    </S.CrewManagementElementsHeader>
                                    <S.CrewManagementElementsContent>
                                        {
                                            CrewManagementElementContent(entry)
                                        }
                                    </S.CrewManagementElementsContent>
                                </S.CrewManagementElements>
                            </S.CrewManagementCategory>
                        )
                    })
                }
                
            </S.SidebarCrewManagementContainer>
        </S.Sidebar>
    )
}