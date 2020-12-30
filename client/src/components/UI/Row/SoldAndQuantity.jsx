import React from 'react';
import styled from "styled-components";

const LabelContainerStyled = styled.div`
    width: 100px;
    display: flex;
    flex-direction: column;
`

const CounterContainer = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-between;
`

const CounterBox = styled.div`
    background-color: ${props => props.type === 'sold' ? props.theme.color.green : props.theme.color.yellow};
    font-weight: 700;
    color: ${props => props.theme.color.lightBeige};
    padding: ${props => props.theme.spacing.one};
`

export default function SoldAndQuantity({ sold, quantity }) {
    return (
        <LabelContainerStyled>
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


        </LabelContainerStyled>
    )
}