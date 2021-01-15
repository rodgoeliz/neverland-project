import React from 'react'
import styled from "styled-components";
import { Box } from '@material-ui/core';

const CardRowContainer = styled(Box)`
  background-color: #FFFDFB;
  height: 180px;
  border-radius: 16px;
  width: calc(100vw - 540px);
  display: flex;
  justify-content: space-between;
  margin-bottom: ${props => props.theme.spacing.three}px;
`;

const TwoColumnsContainer = styled.div`
    display: flex;
    justify-content: space-between;
    flex-wrap: nowrap;
    width: 100%;
    padding: 24px;
`

const Row = styled.div`
  display: flex;
  flex-direction: row;
`

const Column = styled.div`
    display: flex;
    flex-direction: column;
`

const ColumnHeading = styled.strong`
    margin-bottom: ${props => props.theme.spacing.two}px;
`

export default function ShippingDetails({ addressLine1, addressCountry, addressState, shippingAddress, addressZip, addressLine2 }) {
    return (
        <CardRowContainer>
                <TwoColumnsContainer>
                    <Column>
                        <ColumnHeading>
                            Shipping Address
                        </ColumnHeading>
                        <span>{shippingAddress?.addressLine1}</span>
                        <span>{shippingAddress?.addressLine2}</span>
                        <Row>
                          <span>{shippingAddress?.addressCountry}, {shippingAddress?.addressState} {shippingAddress?.addressZip}</span>
                        </Row>
                    </Column>
                    <Column>
                        <ColumnHeading>
                            Billing Address
                        </ColumnHeading>
                        <Column>
                          <span>{addressLine1}</span>
                          <span>{addressLine2}</span>
                          <Row>
                            <span>{addressCountry}, {addressState}, {addressZip}</span>
                          </Row>
                        </Column>
                    </Column>
                </TwoColumnsContainer>
        </CardRowContainer>
    )
}
