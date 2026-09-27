import React, { useContext } from 'react';
import styled from "styled-components";
import { useRouteMatch } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';

import { EventBrandsContext } from '../contexts/eventBrands';

const S = {
    BrandBar: styled.div`
        display: flex;
        align-items: center;
        column-gap: 8px;
        height: 44px;
        padding: 0 16px;
        background-color: rgb(242, 242, 242);
        border-bottom: 1px solid rgb(235, 235, 235);
        font-family: "Roboto";
        font-size: 14px;
    `,
        BrandIcon: styled.span`
            color: rgb(95, 95, 95);
        `,
        BrandName: styled.span`
            font-weight: 500;
        `,
}

export const BrandBar = () => {
    const match = useRouteMatch("/brand/:brandUuid");
    const { brands } = useContext(EventBrandsContext);
    const brand = match ? brands.find(candidate => candidate.uuid === match.params.brandUuid) : null;

    if(!brand) return null;

    return (
        <S.BrandBar>
            <S.BrandIcon><FontAwesomeIcon icon={faChevronRight} /></S.BrandIcon>
            <S.BrandName>{brand.name}</S.BrandName>
        </S.BrandBar>
    );
}
