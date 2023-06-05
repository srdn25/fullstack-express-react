import React, { useEffect } from "react";
import { useDispatch } from 'react-redux';

import './Dashboard.css';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

export default function Dashboard() {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch({ type: 'socket/connect' });

        return () => {
            dispatch({ type: 'socket/disconnect' })
        }
    }, []);

    return (
        <div className="dashboard">
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="left">todo</TableCell>
                            <TableCell align="right">in progress</TableCell>
                            <TableCell align="right">done</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}