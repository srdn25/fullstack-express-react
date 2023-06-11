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
import { setGlobalError } from './redux/action/error';

interface IProps {
    error: string|null,
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
        </div>
    );
}

const mapStateToProps = (state: RootState) => {
    return {
        error: state.error.error,
    }
};

export default connect(mapStateToProps)(App);
