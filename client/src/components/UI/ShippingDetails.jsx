import React from 'react'
import { Card, CardContent } from '@material-ui/core';
import styled from "styled-components";

const CustomCard = styled(Card)`
    background-color: ${props => props.theme.color.beige};
    width: calc(100vw - 540px);
    margin-bottom: ${props => props.theme.spacing.two}px;
`

const TwoColumnsContainer = styled.div`
    display: flex;
    justify-content: space-between;
    flex-wrap: nowrap;
`

const Column = styled.div`
    display: flex;
    flex-direction: column;
`

const ColumnHeading = styled.strong`
    margin-bottom: ${props => props.theme.spacing.two}px;
`

export default function ShippingDetails({ addressLine1, addressCountry, addressState, shippingAddress }) {
    return (
        <CustomCard >
            <CardContent>
                <TwoColumnsContainer>
                    <Column>
                        <ColumnHeading>
                            Shipping Address
                        </ColumnHeading>
                        <span>{shippingAddress?.addressCountry || addressCountry}</span>
                        <span>{shippingAddress?.addressState || addressState}</span>
                        <span>{shippingAddress?.addressLine1 || addressLine1}</span>
                    </Column>
                    <Column>
                        <ColumnHeading>
                            Billing Address
                        </ColumnHeading>
                        <span>{addressCountry}</span>
                        <span>{addressState}</span>
                        <span>{addressLine1}</span>
                    </Column>
                </TwoColumnsContainer>

            </CardContent>
        </CustomCard>
    )
}
