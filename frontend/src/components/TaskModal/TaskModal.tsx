import React, { useEffect, useState } from 'react';
import moment, { Moment } from 'moment';
import { useDispatch } from 'react-redux';

import './TaskModal.css';

import {
    Button,
    TextField,
    Typography,
    Box,
    Modal,
    Stack,
    IconButton,
} from '@mui/material';

import { ITask, ITaskUpdate } from '../../redux/reducer/task';
import { prepareDate, prepareReadableDate, updateLoading } from '../../utils/lib';
import TaskDetails from '../TaskDetails/TaskDetails';
import { TASK_DEFAULT_STATUSES } from '../../utils/consts';
import { taskValidate } from '../../validation';
import taskApi from '../../services/taskApi';
import { setGlobalError, setGlobalNotification } from '../../redux/action/notification';
import { deleteTask, updateTask } from '../../redux/action/task';
import LinearLoader from '../LinearLoader/LinearLoader';
import CloseIcon from '@mui/icons-material/Close';

interface IProps {
    readonly modalOpen: boolean;
    closeTask(): void;
    task: ITask | null;
}

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 700,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

function TaskModal (props: IProps) : React.ReactElement<IProps> {
    const [status, setStatus] = useState<string>(TASK_DEFAULT_STATUSES.todo);
    const [title, setTitle] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [author, setAuthor] = useState<string>('');
    const [dueDate, setDueDate] = useState<string|Moment|null>(null);
    const [initDueDate, setInitDueDate] = useState<string|Moment|null>(null);
    const [created, setCreated] = useState<string|Moment|null>(null);
    const [updated, setUpdated] = useState<string|Moment|null>(null);
    const [validateErrors, setValidateErrors] = useState<object|null>({ error: 1 });
    const [requestInProcess, setRequestInProcess] = useState<boolean>(false);
    const [requestProgress, setRequestProgress] = useState<number>(0);

    const dispatch = useDispatch();

    function prepareTaskForUpdate (): ITaskUpdate {
        return {
            title,
            author,
            description,
            status,
            ...dueDate && { dueDate: prepareDate(dueDate) },
        }
    }

    useEffect(() => {
        if (props.task) {
            const date = moment(props.task.dueDate);
            setStatus(props.task.status);
            setTitle(props.task.title);
            setAuthor(props.task.author);
            setInitDueDate(date)
            setDueDate(date);

            if (props.task.description) {
                setDescription(props.task.description);
            }

            if (props.task.createdAt) {
                setCreated(prepareReadableDate(props.task.createdAt));
            }

            if (props.task.updatedAt) {
                setUpdated(prepareReadableDate(props.task.updatedAt));
            }
        }

        return () => {
            setStatus(TASK_DEFAULT_STATUSES.todo);
            setTitle('');
            setDescription('');
            setAuthor('');
            setDueDate('');
            setInitDueDate('');
            setCreated('');
            setUpdated('');
            setValidateErrors({ error: 1 });
        }
    }, [props.task]);

    useEffect(() => {
        const task = prepareTaskForUpdate();

        const isValid = taskValidate(task);

        if (isValid && hasDifferent()) {
            setValidateErrors(null);
        } else {
            setValidateErrors(taskValidate.errors || { error: 1 });
        }
    }, [
        title,
        dueDate,
        description,
        author,
        status,
    ]);

    function hasDifferent () {
        if (
            props.task?.title !== title ||
            props.task?.author !== author ||
            initDueDate !== dueDate ||
            props.task?.description !== description ||
            props.task?.status !== status
        ) {
            return true;
        }

        return false;
    }

    async function handleUpdateTask () {
        if (!props.task?.id) {
            console.error('Tried to update task without task ID');
            return;
        }

        setRequestInProcess(true);
        const interval = updateLoading(setRequestProgress);

        const task = await taskApi.updateTask(props.task.id, prepareTaskForUpdate())

        setRequestInProcess(false);
        clearInterval(interval);
        setRequestProgress(0);

        if (!task) {
            dispatch(setGlobalError('Cannot update task'));
            setTimeout(() => dispatch(setGlobalError(null)), 5000);
        } else {
            dispatch(updateTask(task));

            dispatch(setGlobalNotification('Task updated'));

            setTimeout(() => dispatch(setGlobalNotification(null)), 5000);

            if (props.closeTask) {
                props.closeTask();
            }
        }
    }

    async function handleDeleteTask () {
        if (!props.task?.id) {
            console.error('Tried to delete task without task ID');
            return;
        }

        setRequestInProcess(true);
        const interval = updateLoading(setRequestProgress);

        const task = await taskApi.deleteTask(props.task.id)

        setRequestInProcess(false);

        if (!task) {
            clearInterval(interval);
            dispatch(setGlobalError('Cannot delete task'));
            setTimeout(() => dispatch(setGlobalError(null)), 5000);
        } else {
            dispatch(deleteTask({ id: props.task.id }));

            dispatch(setGlobalNotification('Task deleted'));

            setTimeout(() => dispatch(setGlobalNotification(null)), 5000);
            if (props.closeTask) {
                props.closeTask();
            }
        }
    }

    return (
        <div className='task-modal'>
            <Modal
                open={props.modalOpen}
                onClose={props.closeTask}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography
                        className='task-modal-title'
                        variant='h5'
                        component='h3'
                        margin='15px'
                    >
                        Task details #{props.task?.id}
                    </Typography>
                    <IconButton
                        className='close-btn'
                        aria-label='close'
                        color='inherit'
                        size='small'
                        onClick={() => {
                            props.closeTask();
                        }}
                    >
                        <CloseIcon fontSize='inherit' />
                    </IconButton>

                    <TaskDetails
                        title={title}
                        updateTitle={setTitle}
                        author={author}
                        updateAuthor={setAuthor}
                        description={description}
                        updateDescription={setDescription}
                        dueDate={dueDate || ''}
                        updateDueDate={setDueDate}
                        status={status}
                        updateStatus={setStatus}
                    />

                    <Stack
                        className='task-modal-line'
                        direction={{ xs: 'column', sm: 'row' }}
                        spacing={{ xs: 1, sm: 2, md: 4 }}
                    >
                        <TextField
                            id="modal-task-created"
                            label="Created"
                            value={created}
                            disabled
                        />
                        <TextField
                            id="modal-task-updated"
                            label="Updated"
                            value={updated}
                            disabled
                        />
                    </Stack>

                    {requestInProcess && <LinearLoader value={requestProgress} />}

                    <div className='control-btns'>
                        <Button
                            disabled={requestInProcess}
                            variant="outlined"
                            color="error"
                            onClick={handleDeleteTask}
                        >
                            Delete
                        </Button>
                        <Button
                            disabled={!!validateErrors || requestInProcess}
                            variant="contained"
                            color="success"
                            onClick={handleUpdateTask}
                        >
                            Update
                        </Button>
                    </div>
                </Box>
            </Modal>
        </div>
    )
}

export default TaskModal;