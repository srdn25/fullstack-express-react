import React, { useEffect } from "react";
import { useDispatch, connect } from 'react-redux';

import './Dashboard.css';


import { DataGrid, GridColDef, GridRowParams } from '@mui/x-data-grid';
import { RootState } from '../../redux/store';
import { ITask } from '../../redux/reducer/task'

import { prepareReadableDate } from '../../utils/lib';

import TaskModal from '../TaskModal/TaskModal';

function Dashboard(props: IProps): React.ReactElement {
    const [modalOpen, setModalOpen] = React.useState<boolean>(false);
    const [modalTask, setModalTask] = React.useState<ITask | null>(null);

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch({ type: 'socket/connect' });

        return () => {
            dispatch({ type: 'socket/disconnect' })
        }
    }, [dispatch]);

    const columns : GridColDef[] = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'title', headerName: 'Title', width: 130 },
        { field: 'status', headerName: 'Status', width: 130 },
        { field: 'dueDate', headerName: 'Due Date', width: 170 },
    ];

    const prepareData = (tasks: ITask[]): ITask[] => {
        return tasks.map((task) => {
            return {
                ...task,
                id: task.id,
                title: task.title,
                status: props.allowedStatus[task.status],
                dueDate: prepareReadableDate(task.dueDate),
            }
        });
    };

    const openTask = (row: GridRowParams) => {
        const data = props.taskList.find((task): boolean => task.id === row.id) || null;

        if (data) {
            setModalTask(data);
            setModalOpen(true);
        } else {
            console.error('Cannot find task by ID in openTask function')
        }

    }

    const closeTask = () => {
        setModalOpen(false);
        setModalTask(null);
    }

    return (
        <div className="dashboard">
            <DataGrid
                rows={prepareData(props.taskList)}
                columns={columns}
                onRowClick={openTask}
                initialState={{
                    pagination: {
                        paginationModel: { page: 0, pageSize: 7 },
                    },
                }}
                pageSizeOptions={[7, 15]}
            />
            <TaskModal
                modalOpen={modalOpen}
                closeTask={closeTask}
                task={modalTask}
            />
        </div>
    );
}

interface IProps {
    taskList: ITask[];
    allowedStatus: { [key: string]: string };
}

const mapStateToProps = (state: RootState) => {
    return {
        taskList: state.task.taskList,
        allowedStatus: state.task.allowedStatus,
    }
};

export default connect(mapStateToProps)(Dashboard);