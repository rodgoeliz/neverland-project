import styled from 'styled-components';

export const StyledMenu = styled.nav`
  display: flex;
  flex-direction: column;
  justify-content: center;
  background: #EFE6D8;
  height: 100vh;
  text-align: right;
  padding: 2rem;
  position: absolute;
  bottom: 0;
  right: 0;
  z-index: 300;
  transition: transform 0.3s ease-in-out;
  transform: ${({open}) => open ? 'translateX(0%)' : 'translateX(-100%)'};
  
  @media (max-width: 900px) {
    width: 100%;
  }

  a {
    font-size: 2rem;
    font-family: 'Cognace';
    padding: 2rem 0;
    font-weight: bold;
    color: #312a2d;
    text-decoration: none;
    transition: color 0.3s linear;
    
    @media (max-width: 900px) {
      font-size: 1.5rem;
      text-align: center;
    }

    &:hover {
      color: #1e1dcd; 
    }
  }
`;