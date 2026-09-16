import React, { useContext } from "react";
import { useParams } from "react-router-dom";

import { EventBrandsContext } from "./eventBrands";

export const BrandContext = React.createContext(null);

export const Brand = ({ children }) => {
    const { brandUuid } = useParams();
    const { brands, currentEventByBrand } = useContext(EventBrandsContext);
    const brand = brands.find(candidate => candidate.uuid === brandUuid);

    if(!brand) return null;

    return (
        <BrandContext.Provider value={{
            brand,
            brandUuid,
            currentEvent: currentEventByBrand[brandUuid] ?? null,
            path: path => `/brand/${brandUuid}${path.startsWith("/") ? path : `/${path}`}`,
        }}>
            {children}
        </BrandContext.Provider>
    );
};

export const useBrand = () => useContext(BrandContext);
