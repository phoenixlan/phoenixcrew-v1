import React , { useEffect, useState } from "react";
import styled from "styled-components";

import { Position, Crew } from "@phoenixlan/phoenix.js";

const S = {
    Role: styled.div`
    
    `
}

export const PositionAdmin = () => {
    const [roles, setRoles] = useState([]);
    const [crews, setCrews] = useState([]);

    useEffect(async () => {
        const positions = await Position.getPositions();
        setRoles(positions);
        const crews = await Crew.getCrews();
        setCrews(crews);
    }, []);

    return (<div>
        <h1>Roller</h1>
        {
            roles.map((role) => {
                return (<S.Role>{role.name}</S.Role>)
            })
        }
        </div>)
}