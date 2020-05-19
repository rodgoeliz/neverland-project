import React from 'react';
import { StyledBurger } from './StyledBurger';

const Burger = ({open, setOpen}) => {
  return (
    <StyledBurger open={open} onClick={() => setOpen(!open)}>
      <div />
      <div />
      <div />
    </StyledBurger>
  )
}

export default Burger;