import React, { useContext, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { EventBrand } from "@phoenixlan/phoenix.js";

import { AuthenticationContext } from "../../components/authentication";
import { FormButton, FormContainer, FormEntry, FormInput, FormLabel } from "../../components/form";
import { Notice } from "../../components/containers/notice";
import { Table, TableBody, TableCell, TableHead, TableRow } from "../../components/table";
import { EventBrandsContext, eventBrandsQueryKey } from "../../contexts/eventBrands";
import { isGlobalAdmin } from "../../utils/roles";

export const EventBrandList = () => {
    const auth = useContext(AuthenticationContext);
    const { brands } = useContext(EventBrandsContext);
    const queryClient = useQueryClient();
    const [name, setName] = useState("");
    const createBrand = useMutation({
        mutationFn: value => EventBrand.createEventBrand(value),
        onSuccess: () => {
            setName("");
            queryClient.invalidateQueries({ queryKey: eventBrandsQueryKey });
        },
    });

    if(!isGlobalAdmin(auth.roles)) {
        return <Notice visible type="error">Du må være global administrator for å administrere merkevarer.</Notice>;
    }

    const submit = event => {
        event.preventDefault();
        const trimmedName = name.trim();
        if(trimmedName) createBrand.mutate(trimmedName);
    };

    return (
        <>
            <h1>Event brands</h1>
            <p>Alle merkevarer i Phoenix EMS, også de som ikke har et aktivt arrangement.</p>
            <Table>
                <TableHead border><TableRow><TableCell flex="2">Navn</TableCell><TableCell>UUID</TableCell></TableRow></TableHead>
                <TableBody>
                    {brands.map(brand => <TableRow key={brand.uuid}><TableCell flex="2">{brand.name}</TableCell><TableCell consolas>{brand.uuid}</TableCell></TableRow>)}
                </TableBody>
            </Table>
            <h2>Opprett merkevare</h2>
            <FormContainer as="form" onSubmit={submit}>
                <FormEntry><FormLabel>Navn</FormLabel><FormInput value={name} onChange={event => setName(event.target.value)} required /></FormEntry>
                <FormButton type="submit" disabled={createBrand.isLoading}>Opprett</FormButton>
            </FormContainer>
            <Notice visible={createBrand.isSuccess} type="success">Merkevaren ble opprettet.</Notice>
            <Notice visible={createBrand.isError} type="error">{createBrand.error?.message || "Kunne ikke opprette merkevaren."}</Notice>
        </>
    );
};
