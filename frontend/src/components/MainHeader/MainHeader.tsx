import React from 'react';
import './MainHeader.css';
import { Typography } from '@mui/material';

function MainHeader (): React.ReactElement {
    return (
        <div className='main-header'>
            <Typography variant='h3' component='h1'>Fake Jira Test Task</Typography>
        </div>
    );
}

export default MainHeader;