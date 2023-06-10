import React from 'react';
import './NavigationMenu.css';

import { Tab, Tabs, Box } from '@mui/material';

import NavigationTab from './NavigationTab';
import CreateTask from '../CreateTask/CreateTask';
import Dashboard from '../Dashboard/Dashboard';

function NavigationMenu (): React.ReactElement {
    const [value, setValue] = React.useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return (
        <div className='navigation-menu'>
            <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                        <Tab
                            label="Home"
                            id={`tab-${0}`}
                            aria-controls={`tabpanel-${0}`}
                        />
                        <Tab
                            label="Create Task"
                            id={`tab-${1}`}
                            aria-controls={`tabpanel-${1}`}
                        />
                    </Tabs>
                </Box>
                <NavigationTab value={value} index={0}>
                    <Dashboard />
                </NavigationTab>
                <NavigationTab value={value} index={1}>
                    <CreateTask />
                </NavigationTab>
            </Box>
        </div>
    );
}

export default NavigationMenu;