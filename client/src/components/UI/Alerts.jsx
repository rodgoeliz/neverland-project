import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Alert } from '@material-ui/lab';
import { IconButton } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import styled from 'styled-components';

import { hideMessage } from 'actions';

const AlertContainer = styled.div`
    position: fixed;
    width: 40%;
    min-width: 300px;
    bottom: ${props => props.theme.spacing.two}px;
    right: ${props => props.theme.spacing.two}px;
    > * {
        margin-bottom: ${props => props.theme.spacing.one}px;
    }
`

export default function Alerts() {
    const dispatch = useDispatch();
    const { messages } = useSelector(state => state.ui);

    const closeIcon = (text) => {
        return (
            <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => dispatch(hideMessage({ text }))}
            >
                <CloseIcon fontSize="inherit" />
            </IconButton>
        )
    }
    console.log("RENDER ERROR: ", messages)
    return (
        <AlertContainer>
            {messages.map(message => (
                <Alert variant="filled" severity={message.type} action={closeIcon(message.text)}>{message.text}</Alert>
            ))}
        </AlertContainer>
    )
}
