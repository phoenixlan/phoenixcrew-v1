import React, { useContext, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { EventBrand } from "@phoenixlan/phoenix.js";

import { AuthenticationContext } from "../../components/authentication";
import { FormButton, FormContainer, FormEntry, FormInput, FormLabel } from "../../components/form";
import { Notice } from "../../components/containers/notice";
import { Table, TableBody, TableCell, TableHead, TableRow } from "../../components/table";
import { EventBrandsContext, eventBrandsQueryKey } from "../../contexts/eventBrands";
import { isGlobalAdmin } from "../../utils/roles";
import { useCreateEventBrandMutation} from "../../hooks/eventBrand/useCreateEventBrandMutation";

export const EventBrandList = () => {
    const auth = useContext(AuthenticationContext);
    const { brands } = useContext(EventBrandsContext);
    const queryClient = useQueryClient();
    const [name, setName] = useState("");
    const [contactEmail, setContactEmail] = useState("");

    const createBrand = useCreateEventBrandMutation();

    if(!isGlobalAdmin(auth.roles)) {
        return <Notice visible type="error">Du må være global administrator for å administrere merkevarer.</Notice>;
    }

    const submit = event => {
        event.preventDefault();
        const trimmedName = name.trim();
        const trimmedEmail = contactEmail.trim();
        if(trimmedName && trimmedEmail) createBrand.mutate({ name: trimmedName, contact_email: trimmedEmail });
    };

    return (
        <>
            <h1>Event brands</h1>
            <p>Alle merkevarer i Phoenix EMS, også de som ikke har et aktivt arrangement.</p>
            <Table>
                <TableHead border><TableRow><TableCell>Navn</TableCell><TableCell>Kontakt e-post</TableCell><TableCell>UUID</TableCell></TableRow></TableHead>
                <TableBody>
                    {brands.map(brand => <TableRow key={brand.uuid}><TableCell>{brand.name}</TableCell><TableCell>{brand.contact_email}</TableCell><TableCell consolas>{brand.uuid}</TableCell></TableRow>)}
                </TableBody>
            </Table>
            <h2>Opprett merkevare</h2>
            <FormContainer as="form" onSubmit={submit}>
                <FormEntry><FormLabel>Navn</FormLabel><FormInput value={name} onChange={event => setName(event.target.value)} required /></FormEntry>
                <FormEntry><FormLabel>Kontakt e-post</FormLabel><FormInput value={contactEmail} onChange={event => setContactEmail(event.target.value)} required /></FormEntry>
                <FormButton type="submit" disabled={createBrand.isLoading}>Opprett</FormButton>
            </FormContainer>
            <Notice visible={createBrand.isSuccess} type="success">Merkevaren ble opprettet.</Notice>
            <Notice visible={createBrand.isError} type="error">{createBrand.error?.message || "Kunne ikke opprette merkevaren."}</Notice>
        </>
    );
};
