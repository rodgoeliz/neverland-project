import React from 'react';
import styled from "styled-components";

const SoldAndQuantityContainer = styled.div`
    min-width: 150px; 
    width: 150px; 
    display: flex;
    flex-direction: column;
    justify-content: center;
`

const CounterContainer = styled.div`
    width: 100%;
    display: flex;
    justify-content: end;
    align-items: center;
    font-weight: 700;
`

const CounterBox = styled.div`
    background-color: ${props => props.type === 'sold' ? props.theme.color.green : props.theme.color.yellow};
    font-weight: 700;
    color: ${props => props.theme.color.lightBeige};
    padding: ${props => props.theme.spacing.one / 2}px;
    border-radius: ${props => props.theme.spacing.one / 2}px;
    margin-left:  ${props => props.theme.spacing.one}px;
`

export default function SoldAndQuantity({ sold, quantity }) {
    return (
        <SoldAndQuantityContainer>
            <CounterContainer>
                SOLD
                <CounterBox type='sold'>
                    {sold}
                </CounterBox>
            </CounterContainer>
            <CounterContainer>
                QUANTITY

                <CounterBox>
                    {quantity}
                </CounterBox>
            </CounterContainer>
        </SoldAndQuantityContainer>
    )
}