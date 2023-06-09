import React from 'react';

interface TabPanelProps {
    children?: React.ReactElement;
    index: number;
    value: number;
}
function NavigationTab (props: TabPanelProps): React.ReactElement {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`tabpanel-${index}`}
            aria-labelledby={`tab-${index}`}
            {...other}
        >
            {value === index && children}
        </div>
    );
}

export default NavigationTab;