import React from 'react'
import styled from "styled-components";

const InvociceContainer = styled.div`
    display: flex;
    justify-content: end;
    padding-right: 4rem;
`

const Column = styled.div`
    display: flex;
    flex-direction: column;
    align-items: start;
    margin-right: ${props => props.theme.spacing.three}px;
`

export default function Invoice({currency, subtotal, services, sh, total}) {
    return (
        <InvociceContainer>
            <Column>
                <span>Subtotal</span>
                <span>Services</span>
                <span>S&H</span>
                <strong>Total</strong>
            </Column>
            <Column>
                <span>{currency} {subtotal}</span>
                <span>{currency} {services}</span>
                <span>{currency} {sh}</span>
                <strong>{currency} {total}</strong>
            </Column>
        </InvociceContainer>
    )
}
