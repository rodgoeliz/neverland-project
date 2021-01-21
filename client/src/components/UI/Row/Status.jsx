import React from 'react';
import { Box } from '@material-ui/core';
import styled from "styled-components";

import {getStatusColor} from './styles/order';

const StatusContainerStyled = styled(Box)`
    background-color: ${props => getStatusColor(props.status)};
    min-width: 150px; 
    width: 150px; 
    display: flex;
    flex-direction: column;
    font-weight: 700;
    text-align: center;
`

const StatusLabelStyled = styled(Box)`
    line-height: 40px;
`

const StatusLabelContent = styled(Box)`
    flex-grow: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: ${props => props.theme.spacing.one}px
`

export default function ({ status, children }) {
    return (
        <StatusContainerStyled status={status}>
            <StatusLabelStyled status={status}>
                STATUS
            </StatusLabelStyled>
            <StatusLabelContent>
                {children}
            </StatusLabelContent>
        </StatusContainerStyled>
    )
}