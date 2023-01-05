import React, { useContext } from 'react';
import styled from 'styled-components';
import { Redirect } from 'react-router-dom';
import { User } from "@phoenixlan/phoenix.js";
import { KeyboardArrowRight } from '@material-ui/icons';
import { Warning } from '@material-ui/icons';
import { AuthenticationContext } from '../components/authentication';

const H = {
    Container: styled.div`
        opacity: ${props => props.finishloading ? "1" : "0"};
        margin-top: ${props => props.finishloading ? "25px" : "0"};
        margin-bottom: 25px;
        transition: .5s;
        flex-flow: column;
        width: autp;
        height: auto;
        align-self: center;
    `,
}
const E = {
    Container: styled.div`
        display: grid;
        transition: .5s;
        flex-flow: row;
        width: 500px;
        height: auto;
        border: 1px solid #EF9A9A;
        font-family: Calibri;
        font-size: 14px;
        box-shadow: 0px 2px 3px #FFEBEE;
        align-self: center;
        margin: 10px;
    `,
    ContentBox: styled.div`
        display: flex;
        flex-flow: row;
        padding: 18px 24px;
        background-color: #FFCDD2;
    `,
    Left: styled.div`
        margin: auto;
        order: 1;
        flex: 0 1;
        padding-right: 20px;
    `,
    Right: styled.div`
        order: 2;
        flex: 1 0;
    `,
    StyledWarning: styled(Warning)`
        position: relative;
        width: 22px;
        height: 22px!important;
        vertical-align: middle;
    `
}

const S = {
    Container: styled.div`
        display: flex;
        transition: .5s;
        display: flex;
        flex-flow: column;
        width: 500px;
        height: auto;
        border: 1px solid rgb(230, 230, 230);
        font-family: Calibri;
        font-size: 16px;
        box-shadow: 0px 2px 3px rgb(190, 190, 190);
        align-self: center;
        margin: 10px;
    `,
    TitleBox: styled.div`
        & h4 {
            font-weight: 600;
            margin: 0;
            text-transform: capitalized;
        }
        padding: 12px 24px;
        background-color: rgb(230, 230, 230);
        
    `,
    ContentBox: styled.div`
        & hr {
            border: 1px solid rgb(210, 210, 210);
            border-width: 0 0 1px 0;
            margin: 24px 0;
        }
        padding: 12px 24px;
        background-color: rgb(255, 255, 255);
        
    `,

    ActionBox: styled.div`
        cursor: pointer;
        display: flex;
        flex-flow: row;
        margin: 12px 0;
        padding: 10px 16px;
        border: 1px solid #81d4fa;
        background-color: #e1f5fe;
    `,

    Left: styled.div`
        order: 1;
        flex: 1 0;
    `,
    Right: styled.div`
        order: 2;
        flex: 0 1;
    `,
    StyledArrowRightIcon: styled(KeyboardArrowRight)`
        position: relative;
        width: 18px;
        height: 18px!important;
        vertical-align: middle;
    `
}


export const Login = () => {
    // Redirect url
    const myUrl = `${process.env.REACT_APP_PROTOCOL??'http'}://${process.env.REACT_APP_HOST??'crew.dev.phoenixlan.no:3000'}`
    const redirectUrl = User.getAuthenticationUrl(myUrl, process.env.REACT_APP_OAUTH_CLIENT_ID??'phoenix-crew-dev');
    const auth = useContext(AuthenticationContext);

    if(!auth.authUser) {
        return(
            <>
                <H.Container finishloading={auth.loadingFinished}>
                    { auth.shouldDisplayError ? (
                        <E.Container type="error">
                            <E.ContentBox>
                                <E.Left>
                                    <E.StyledWarning />
                                </E.Left>
                                <E.Right>
                                    {auth.errorMessage}
                                </E.Right>
                            </E.ContentBox>
                        </E.Container>
                    ) : null}
                    <S.Container>
                        <S.TitleBox>
                            <h4>Phoenix crew</h4>
                        </S.TitleBox>
                        <S.ContentBox>
                            <p>Denne siden krever at du er innlogget med en Phoenix-konto for å kunne bruke siden. Vennligst logg inn under.</p>
                            <p><b>MERK:</b> Denne siden er ment for chiefer. Vil du søke crew, gjør du det <a href="https://delta.phoenixlan.no/">her</a>.</p>
                            <hr />
                            <S.ActionBox onClick={() => window.location.href = redirectUrl} >
                                <S.Left>
                                Trykk her for å logge inn!
                                </S.Left>
                                <S.Right>
                                    <S.StyledArrowRightIcon />
                                </S.Right>
                            </S.ActionBox>
                        </S.ContentBox>
                    </S.Container>
                </H.Container>
            </>
        );
    }
    else {
        console.log("You are already authenticated. Returning to dashboard!");
        return(
            <Redirect to="/dashboard" />
        );
    }
}