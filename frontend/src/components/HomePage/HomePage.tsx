import React from 'react';
import './HomePage.css';

import Dashboard from '../Dashboard/Dashboard';
import MainHeader from '../MainHeader/MainHeader';

function HomePage (): React.ReactElement {
    return (<div className='home-page'>
        <MainHeader />
        <Dashboard />
    </div>)
}

export default HomePage;