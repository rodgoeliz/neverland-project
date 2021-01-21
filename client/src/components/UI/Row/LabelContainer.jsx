import React from 'react';
import { Box } from '@material-ui/core';
import styled from "styled-components";

import { getStatusColor } from './styles/order';

const LabelContainerStyled = styled(Box)`
    width: calc(100% - 200px);
    display: flex;
    flex-direction: column;
    border-radius: 16px 0px 0px 0px;
`

const LabelStyled = styled(Box)`
    background-color: ${props => getStatusColor(props.status)};
    width: 100%;
    border-radius: 16px 0px 0px 0px;
    font-weight: 700;
    line-height: 40px;
    padding: 0 ${props => props.theme.spacing.two}px;
`

const LabelContentStyled = styled(Box)`
    height: 100%;
    width: 100%;
    display: flex;
    flex-grow: 1;
    justify-content: space-between;
`

export default function LabelContainer({ children, labelText, status }) {
    return (
        <LabelContainerStyled>
            <LabelStyled status={status}>
                {(new Date(labelText)).toLocaleDateString("en-US")}
            </LabelStyled>
            <LabelContentStyled>
                {children}
            </LabelContentStyled>
        </LabelContainerStyled>
    )
}