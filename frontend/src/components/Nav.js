import React from 'react';
import styled, { keyframes } from "styled-components";
import logo from '../assets/logo.svg';
import lock from '../assets/lock.svg';
import profile from '../assets/profile.svg';

const Header = styled.header`
  height: 20vh;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: calc(10px + 2vmin);
  color: whitesmoke;
`;

const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const Img = styled.img`
  height: 20vmin;
  width: 20vmin;
  pointer-events: none;

  @media (prefers-reduced-motion: no-preference) {
    animation: ${spin} infinite 20s linear;
  }
`;

export default function Nav(props) {
  const Section = styled.section`
    display: flex;
    align-items: center;

    & > p {
      color: ${props.login ? 'skyblue' : 'red'};
      font-weight: bold;
      font-size: 3vmin;
    }

    & > img {
      height: 5vmin;
    }
  `;

  return (
    <Header>
      <Img src={logo} alt="logo" />
      <Section id="profile">
        <p>My Profile</p>
        &nbsp;
        <img src={props.login ? profile : lock} alt="Lock"></img>
      </Section>
    </Header>
  )
}