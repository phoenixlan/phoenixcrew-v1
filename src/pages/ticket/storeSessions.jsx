import React, { useState, useEffect } from "react";

import { getActiveStoreSessions } from '@phoenixlan/phoenix.js';

import { Table, Row, Column } from "../../components/table";

import Spinner from "react-svg-spinner";

export const StoreSessionList = () => {
    const [ storeSessions, setStoreSessions ] = useState([]);
    const [ loading, setLoading ] = useState(true)

    useEffect(async () => {
        setStoreSessions(await getActiveStoreSessions())
        setLoading(false)
    }, [])

    return (
        <>
        <h1>Aktive kjøp</h1>
        {
            loading ? (<Spinner />) : (
                <Table>
                    <thead>
                        <Row>
                            <Column>Bruker</Column>
                            <Column>Startet</Column>
                            <Column>Utløp</Column>
                            <Column>Billetter</Column>
                            <Column>Pris</Column>
                            <Column>UUID</Column>
                        </Row>
                    </thead>
                    <tbody>
                        {
                            storeSessions.map(session => (<Row>
                                <Column>{session.user_uuid}</Column>
                                <Column>{new Date(session.created*1000).toLocaleString()}</Column>
                                <Column>{new Date(session.expires*1000).toLocaleString()}</Column>
                                <Column>{session.entries.reduce((prev, cur) => prev+cur.amount, 0)}</Column>
                                <Column>{session.total}</Column>
                                <Column>{session.uuid}</Column>
                            </Row>))
                        }
                    </tbody>
                </Table>
            )
        }
        <p>{storeSessions.length} aktive kjøp</p>
        </>
    )
}