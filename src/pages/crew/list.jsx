import React , { useEffect, useState } from "react";
import styled from "styled-components";

import { Crew } from "@phoenixlan/phoenix.js";
import { PageLoading } from "../../components/pageLoading"

const S = {
    Crew: styled.div`
    
    `
}

export const CrewList= () => {
    const [crews, setCrews] = useState([]);
    const [ loading, setLoading ] = useState(true);

    useEffect(async () => {
        setLoading(true);
        const crews = await Crew.getCrews();
        const transformedCrews = await Promise.all(crews.map(async (crew) => {
            return await Crew.getCrew(crew.uuid);
        }))
        setCrews(transformedCrews);
        setLoading(false)
    }, []);
    if(loading) {
        return (<PageLoading />)
    }

    return (<div>
        <h1>Crew</h1>
        {
            crews.map((crew) => {
                const memberUuidList = [];
                crew.positions.forEach((position) => {
                    position.users.forEach((userUuid) => {
                        if(!memberUuidList.includes(userUuid)) {
                            memberUuidList.push(userUuid);
                        }
                    })
                })
                return (<S.Crew><h1>{crew.name}</h1><p>{crew.description}</p><p>{crew.teams.length} shift</p><p><i>{memberUuidList.length} medlemmer</i></p></S.Crew>)
            })
        }
        </div>)
}