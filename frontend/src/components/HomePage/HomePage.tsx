import React from 'react';
import './HomePage.css';

import Dashboard from '../Dashboard/Dashboard';
import MainHeader from '../MainHeader/MainHeader';
import NavigationMenu from '../Navigation/NavigationMenu';

function HomePage (): React.ReactElement {
    return (<div className='home-page'>
        <MainHeader />
        <NavigationMenu />
    </div>)
}

export default HomePage;