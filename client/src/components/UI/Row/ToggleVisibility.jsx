import React from 'react';
import { Box, Switch } from '@material-ui/core';
import styled from "styled-components";

const ToggleVisibilityStyled = styled(Box)`
    width: 100px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-weight: 700;
`

const SwitchStyled = styled(Switch)`
    &.MuiSwitch-root {
        width: 46px;
        height: 23px;
        padding: 0;

        .MuiSwitch-switchBase {
            top: -8px;
            left: -6px;
            color: ${props => props.theme.color.beige};
            .Mui-checked {
                color: ${props => props.theme.color.beige};
            },
        }
        .MuiSwitch-track {
            border-radius: 10px;
        }
        .MuiSwitch-colorSecondary.Mui-checked + .MuiSwitch-track {
            opacity: 1;
            background-color: ${props => props.theme.color.green};
        }
    }
`

export default function ToggleVisibility({ text, checked, toggleChecked }) {
    return (
        <ToggleVisibilityStyled>
            {text}
            <SwitchStyled size="normal" checked={checked} onChange={toggleChecked} />
        </ToggleVisibilityStyled>
    )
}