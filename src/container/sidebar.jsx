import React, { useContext, useState } from 'react';
import styled from "styled-components";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { AuthenticationContext } from '../components/authentication';
import { Avatar } from "../components/avatar";

import { SidebarButton } from "./sidebarButton";
import { SidebarCategory } from "./sidebarCategory";

import Logo from "../assets/logo.svg"

// Icons

import { faGavel, faUser, faTicketAlt, faCalendar, faCircle, faInfo, faImages} from '@fortawesome/free-solid-svg-icons'


const S = {
    Container: styled.div`
        width: 20em;
        height: 100%;

        display: flex;
        flex-direction: column;

        border-right: 1px solid black;

        background-color: gray;
    `,
    Logo: styled.img`
        margin: 1em;
        width: calc(100% - 2em);
    `,
    Buttons: styled.div`
        flex: 1;
        width: 100%;
    `,
    Bottom: styled.div`
        height: 4em;
    `,
    SearchBox: styled.input`
        width: 100%;
        height: 1.5em;

        font-size: 1.5em;
    `
}

const options = [
    {
        title: "My crew",
        icon: faUser,
        entries: []
    },
    {
        title: "Admin",
        icon: faGavel,
        roles: ["admin"],
        entries: [
            {
                title: "Stillinger",
                icon: faCircle,
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
                url: "/event/"
            }
        ]
    },
    {
        title: "Chief",
        icon: faGavel,
        roles: ["chief", "admin"],
        entries: [
            {
                title: "Crew",
                icon: faCircle,
                url: "/crews/"
            },
            {
                title: "Godkjenning av avatarer",
                icon: faImages,
                url: "/avatar/approval"
            },
            {
                title: "Søknader",
                icon: faCircle,
                url: "/application"
            }
        ]
    },
    {
        title: "Billett-admin",
        icon: faGavel,
        roles: ["ticket_admin", "admin", "ticket_checkin"],
        entries: [
            {
                title: "Alle billetter",
                icon: faTicketAlt,
                url: "/ticket/"
            },
            {
                title: "Gratisbilletter",
                icon: faTicketAlt,
                url: "/ticket/free"
            },
            {
                title: "Medlemskap-info",
                icon: faTicketAlt,
                url: "/ticket/memberships"
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
    console.log(auth)

    const onSearchUpdate =  (event) => {
        setSearchText(event.target.value)
    }
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

    const makeInner = (entry) => {
        return entry.entries.map(innerEntry => {
            return (<SidebarButton key={innerEntry.title} to={innerEntry.url}>
                        <FontAwesomeIcon icon={innerEntry.icon} />
                        <p>{innerEntry.title}</p>
                    </SidebarButton>)
        })
    }

    console.log(availableOptions)

    return <S.Container>
        <S.Logo src={Logo} />
        <S.SearchBox value={searchText} onChange={onSearchUpdate}/>
        <S.Buttons>
            {
                availableOptions.map(entry => {
                    return entry.entries.length == 0 ? null : (
                    <SidebarCategory key={entry.title}  title={entry.title} icon={entry.icon??"fa-circle"}>
                        {
                            makeInner(entry)
                        }
                    </SidebarCategory>)
                })
            }
        </S.Buttons>
        <S.Bottom>
            <SidebarButton to={"/user/"+auth.authUser.uuid}>
                <Avatar user={auth.authUser} />
                <p>{auth.authUser.firstname} {auth.authUser.lastname}</p>
            </SidebarButton>
        </S.Bottom>
    </S.Container>
}