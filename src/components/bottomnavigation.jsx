import styled from 'styled-components';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const NavigationContainer = styled.div`
    position: fixed;
    top: 0;
    height: 60px!important;
    width: 100%;
    background-color: rgb(242, 242, 242);
    display: none;
    z-index: 1000;

    @media screen and (max-width: 480px) {
        display: block;
    }
`

export const InnerContainerRow = styled.div`
    display: flex;
    flex-flow: row;
    height: 100%;
`
export const NavigationSpacer = styled.div`
    flex: 1;
`



export const InnerContainer = styled.div`
    display: flex;
    flex-flow: column;
    width: 60px;
    row-gap: 8px;
`
export const ElementContainer = styled.div`
    display: flex;
    align-items: center;
    text-align: center;
    height: 100%;
    margin: auto 0;
    user-select: none;
`
export const ElementIcon = styled.div`
    font-size: 18px;
    
`
export const ElementTitle = styled.span`
    font-family: "Roboto";
    font-size: 10px;
    text-align: center;

`

export const Navigation = styled.div`
    display: ${props => props.visible ? "flex" : "none"};
`

export const NavigationElement = ({icon, title, onClick}) => {
    return (
        <>
            <ElementContainer onClick={onClick}>
                <InnerContainer>
                    <ElementIcon>
                        <FontAwesomeIcon icon={icon} />
                    </ElementIcon>
                    <ElementTitle>
                        {title}
                    </ElementTitle>
                </InnerContainer>
            </ElementContainer>
        </>
    )
}