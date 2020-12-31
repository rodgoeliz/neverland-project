import React from 'react';
import { Box } from '@material-ui/core';
import styled from "styled-components";

const StatusContainerStyled = styled(Box)`
    background-color: rgba(159, 36, 88, 0.4);
    width: 200px;
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
`

export default function ({ children }) {
    return (
        <StatusContainerStyled>
            <StatusLabelStyled>
                STATUS
            </StatusLabelStyled>
            <StatusLabelContent>
                {children}
            </StatusLabelContent>
        </StatusContainerStyled>
    )
}