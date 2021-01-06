import React from 'react'
import styled from "styled-components";

const InvociceContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: end;
    padding-right: 4rem;
`

export default function Invoice({currency, subtotal, services, sh, total}) {
    return (
        <InvociceContainer>
            <span>Subtotal: {currency}{subtotal}</span>
            <span>Services: {currency}{services}</span>
            <span>S&H: {currency}{sh}</span>
            <strong>Total: {currency}{total}</strong>
        </InvociceContainer>
    )
}
