import React , { useEffect, useState } from "react";
import styled from "styled-components";

import { Crew } from "@phoenixlan/phoenix.js";
import { PageLoading } from "../../components/pageLoading"
import { SimpleUserCard } from "../../components/simpleUserCard";

const S = {
    Crew: styled.div`
    
    `,
    UserContainer: styled.div`
    display: flex;
    flex-wrap: wrap;
    `
}

export const CrewList= () => {
    const [crews, setCrews] = useState([]);
    const [ loading, setLoading ] = useState(true);

    useEffect(async () => {
        setLoading(true);
        const crews = await Promise.all((await Crew.getCrews()).map(async (crew) => {
            return await Crew.getCrew(crew.uuid);
        }))
        setCrews(crews);
        setLoading(false)
    }, []);
    if(loading) {
        return (<PageLoading />)
    }

    return (<div>
        <h1>Crew</h1>
        {
            crews.map((crew) => {
                const memberMap = new Map();
                crew.positions.forEach((position) => {
                    position.users.forEach((user) => {
                        if(!memberMap.has(user.uuid)) {
                            memberMap.set(user.uuid, user)
                        }
                    })
                })
                const members = Array.from(memberMap.values());
                console.log(members)
                return (<S.Crew>
                    <h1>{crew.name}</h1>
                    <p>{crew.description}</p>
                    <p>{crew.teams.length} shift</p>
                    <S.UserContainer>
                        {
                            members.map(user => (<SimpleUserCard user={user} key={user.uuid}/>))
                        }
                    </S.UserContainer>
                    <p><i>{members.length} medlemmer</i></p>
                    </S.Crew>)
            })
        }
        </div>)
}