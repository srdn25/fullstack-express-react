import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { connect, useDispatch } from 'react-redux';

import './App.css';

import NotFound from './components/NotFound/NotFound';
import HomePage from './components/HomePage/HomePage';
import Alert from './components/Alert/Alert';
import { RootState } from './redux/store';
import { setGlobalError, setGlobalNotification } from './redux/action/notification';

interface IProps {
    error: string|null,
    notification: string|null,
}

function App(props: IProps): React.ReactElement {
    const dispatch = useDispatch();

    return (
        <div className="App">
            <Routes>
                <Route path="/" element={<HomePage/>}/>
                <Route path="*" element={<NotFound/>}/>
            </Routes>
            <Alert
                show={!!props.error}
                setShow={() => dispatch(setGlobalError(null))}
                text={props.error || ''}
                type='error'
            />
            <Alert
                show={!!props.error}
                setShow={() => dispatch(setGlobalError(null))}
                text={props.error || ''}
                type='error'
            />
            <Alert
                show={!!props.notification}
                setShow={() => dispatch(setGlobalNotification(null))}
                text={props.notification || ''}
                type='success'
            />
        </div>
    );
}

const mapStateToProps = (state: RootState) => {
    return {
        error: state.notification.error,
        notification: state.notification.message,
    }
};

export default connect(mapStateToProps)(App);
