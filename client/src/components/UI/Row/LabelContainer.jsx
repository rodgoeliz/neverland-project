import React from 'react';
import { Box } from '@material-ui/core';
import styled from "styled-components";

const LabelContainerStyled = styled(Box)`
    width: 100%;
    display: flex;
    flex-direction: column;
`

const LabelStyled = styled(Box)`
    background-color: rgba(159, 36, 88, 0.4);
    width: 100%;
    font-weight: 700;
    line-height: 40px;
    padding: 0 ${props => props.theme.spacing.one};
`

const LabelContentStyled = styled(Box)`
    height: 100%;
    width: 100%;
    display: flex;
    flex-grow: 1;
    justify-content: space-between;
`

export default function LabelContainer({ children, labelText }) {
    return (
        <LabelContainerStyled>
            <LabelStyled>
                {labelText}
            </LabelStyled>
            <LabelContentStyled>
                {children}
            </LabelContentStyled>
        </LabelContainerStyled>
    )
}