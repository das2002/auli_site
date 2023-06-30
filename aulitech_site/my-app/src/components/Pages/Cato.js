import React from "react";
import styled from 'styled-components';

const Container = styled.div`
    
`

const Header = styled.h1`
    margin:0;
    font-size: 70px;
    color: #6d8dfc;
`

export const CatoPage = () => {
    return (
        <Container>
            <Header>Cato</Header>
        </Container>
    )
}