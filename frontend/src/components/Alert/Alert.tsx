import React from 'react';
import './Alert.css';

import {
    Alert as MAlert,
    AlertColor,
    Collapse,
    IconButton,
} from '@mui/material';

import CloseIcon from '@mui/icons-material/Close';

interface IProps {
    show: boolean;
    setShow(p: boolean): void;
    text: string;
    type: AlertColor;
}

function Alert (props: IProps): React.ReactElement {
    return (
        <Collapse className='show-alert' in={props.show}>
            <MAlert
                variant='filled'
                severity={props.type}
                action={
                    <IconButton
                        aria-label='close'
                        color='inherit'
                        size='small'
                        onClick={() => {
                            props.setShow(false);
                        }}
                    >
                        <CloseIcon fontSize='inherit' />
                    </IconButton>
                }
                sx={{ mb: 2 }}
            >
                {props.text}
            </MAlert>
        </Collapse>
    );
}

export default Alert;