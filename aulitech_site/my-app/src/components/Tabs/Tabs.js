import React, { useState } from 'react';
import styled from 'styled-components';
import { CatoPage } from '../Pages/Cato';
import { PeriPage } from '../Pages/Peri';
import { HomePage } from '../Pages/Home';
import styles from './Tabs.css'


const Tab = styled.button`
font-size: 20px;
  padding: 10px 80px;
  cursor: pointer;
  background: transparent;
  border: 0;
  outline: 0;
  ${({ active }) =>
    active &&
    `
    color: #6d8dfc;
    border-bottom: solid 2px ;
  `}
`;

const Logo = styled.button`
cursor: pointer;
position:absolute;
left: 0%;
    background: transparent;
    border: none;
    margin: 0;
`
const ButtonGroup = styled.div`
  display: flex;
    position: absolute;
    top: 30%;
    left: 15%;
`;

const LoginContainer = styled.div`
  display: flex;
    position: absolute;
    top: 30%;
    left: 90%;
`;

const Container = styled.div`
display: flex;
flex-wrap:wrap;
align-items: baseline;
position: relative;
padding: 20px;
`

const Login = styled.button`
font-size: 20px;
color: white;
padding: 10px 20px;
cursor: pointer;
background: #6d8dfc;
border-radius: 25px;
border: 0;
outline: 0;
`

const pages = ['Cato', 'Peri'];
export function TabGroup() {
  const [active, setActive] = useState('Home');

  const GetPg = () => {
    if (active === 'Home'){
        return <HomePage/>
    }
    if (active === 'Cato') {
        return <CatoPage/>
    }
    if (active === 'Peri') {
        return <PeriPage/>
    }
  }

  return (
    <>
    <Container>
    <img onClick={() => {setActive('Home')}} src={require('../../../src/icononly_transparent_nobuffer.png')} alt={'auli logo'} width={'10%'}/>

      <ButtonGroup>
        {pages.map(page => (
          <Tab
            key={page}
            active={active === page}
            onClick={() => setActive(page)}
          >
            {page}
          </Tab>
        ))}
      </ButtonGroup>
      <LoginContainer>
      <button class={'login'}>
        Login
      </button>
      </LoginContainer>
      <p />
    </Container>
    <div>
            <GetPg/>
    </div>
    </>
    
  );
}