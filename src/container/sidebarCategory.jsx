import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from "styled-components";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


const S = {
    CategoryWrapperHeader: styled.div`
        display: flex;

        cursor: pointer;
        user-select: none;

        /*width: 100%;*/
        height: 3em;

        background-color: rgba(0,0,0,0.3);

        :hover {
            background-color: rgba(0,0,0,0.4);
        }
    `,
    CategoryWrapper: styled.div`
    width: 100%;
    
    `
}

export const SidebarCategory = ({children, title, icon}) => {
    const [ expanded, setExpanded ] = useState(true);
    return (<S.CategoryWrapper>
                <S.CategoryWrapperHeader>
                    <FontAwesomeIcon icon={icon} />
                    <p>{title}</p>
                </S.CategoryWrapperHeader>
                { expanded ? children : null }
            </S.CategoryWrapper>)
}
