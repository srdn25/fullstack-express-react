import React, { useEffect, useState } from 'react';
import moment, { Moment } from 'moment';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';

import './TaskModal.css';

import { Stack, TextField, Typography, } from '@mui/material';

import { ITask } from '../../redux/reducer/task';
import { prepareReadableDate } from '../../utils/lib';
import TaskDetails from '../TaskDetails/TaskDetails';
import { TASK_DEFAULT_STATUSES } from '../../utils/consts';

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
    const [created, setCreated] = useState<string|Moment|null>(null);
    const [updated, setUpdated] = useState<string|Moment|null>(null);

    useEffect(() => {
        if (props.task) {
            setStatus(props.task.status);
            setTitle(props.task.title);
            setAuthor(props.task.author);
            setDueDate(moment(props.task.dueDate));

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
            setCreated('');
            setUpdated('');
        }
    }, [props.task]);

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
                        Task details
                    </Typography>

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
                </Box>
            </Modal>
        </div>
    )
}

export default TaskModal;