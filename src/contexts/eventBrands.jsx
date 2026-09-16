import React, { useContext, useMemo } from "react";
import { useQueries, useQuery } from "@tanstack/react-query";
import { EventBrand, getCurrentEvent } from "@phoenixlan/phoenix.js";

import { AuthenticationContext } from "../components/authentication";
import { currentEventQueryKey } from "../hooks/events/useCurrentEvent";
import { getBrandUuidsFromRoles, isGlobalAdmin } from "../utils/roles";

export const EventBrandsContext = React.createContext({
    brands: [],
    activeEvents: [],
    currentEventByBrand: {},
    loading: false,
    error: null,
    refetch: () => {},
});

export const eventBrandsQueryKey = ["eventBrands"];

export const EventBrands = ({ children }) => {
    const auth = useContext(AuthenticationContext);
    const enabled = !!auth.authUser && !!auth.roles;

    const brandsQuery = useQuery({
        queryKey: eventBrandsQueryKey,
        queryFn: () => EventBrand.getEventBrands(),
        enabled,
    });

    const brands = useMemo(() => {
        if(!brandsQuery.data || !auth.roles) return [];

        const allowedBrandUuids = new Set(getBrandUuidsFromRoles(auth.roles));
        return brandsQuery.data
            .filter(brand => isGlobalAdmin(auth.roles) || allowedBrandUuids.has(brand.uuid))
            .sort((a, b) => a.name.localeCompare(b.name, "nb"));
    }, [brandsQuery.data, auth.roles]);

    const currentEventQueries = useQueries({
        queries: brands.map(brand => ({
            queryKey: currentEventQueryKey(brand.uuid),
            queryFn: () => getCurrentEvent(brand.uuid),
            enabled,
        })),
    });

    const currentEventByBrand = useMemo(() => Object.fromEntries(
        brands.map((brand, index) => [brand.uuid, currentEventQueries[index]?.data ?? null])
    ), [brands, currentEventQueries]);

    const activeEvents = useMemo(() => brands
        .map(brand => {
            const event = currentEventByBrand[brand.uuid];
            return event ? { brand, event } : null;
        })
        .filter(Boolean), [brands, currentEventByBrand]);

    const currentEventsLoading = currentEventQueries.some(query => query.isLoading);
    const currentEventsError = currentEventQueries.find(query => query.error)?.error ?? null;

    const refetch = async () => {
        await brandsQuery.refetch();
        await Promise.all(currentEventQueries.map(query => query.refetch()));
    };

    return (
        <EventBrandsContext.Provider value={{
            brands,
            activeEvents,
            currentEventByBrand,
            loading: enabled && (brandsQuery.isLoading || currentEventsLoading),
            error: brandsQuery.error ?? currentEventsError,
            refetch,
        }}>
            {children}
        </EventBrandsContext.Provider>
    );
};

export const useEventBrands = () => useContext(EventBrandsContext);
