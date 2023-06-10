import React, { useEffect } from 'react';
import moment, { Moment } from 'moment';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { connect } from 'react-redux';

import './TaskModal.css';

import {
    MenuItem,
    Select,
    SelectChangeEvent,
    Stack,
    TextField,
    Typography,
    FormControl, InputLabel
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'

import { ITask } from '../../redux/reducer/task';
import { RootState } from '../../redux/store';
import { TASK_DEFAULT_STATUSES } from '../../utils/consts';
import { prepareReadableDate } from '../../utils/lib';

interface IProps {
    readonly modalOpen: boolean;
    closeTask(): void;
    task: ITask | null;
    allowedStatus: { [key: string]: string };
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
    const [status, setStatus] = React.useState<string>('');
    const [title, setTitle] = React.useState<string>('');
    const [description, setDescription] = React.useState<string>('');
    const [author, setAuthor] = React.useState<string>('');
    const [dueDate, setDueDate] = React.useState<string|Moment|null>();
    const [allowedStatuses, setAllowedStatuses] = React.useState<{[k: string]: string}>(TASK_DEFAULT_STATUSES);
    const [created, setCreated] = React.useState<string|Moment|null>();
    const [updated, setUpdated] = React.useState<string|Moment|null>();

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
            setStatus('');
            setTitle('');
            setDescription('');
            setAuthor('');
            setDueDate(undefined);
            setCreated(undefined);
            setUpdated(undefined);
        }
    }, [props.task]);

    useEffect(() => {
        setAllowedStatuses(props.allowedStatus);

        return () => {
            setAllowedStatuses(TASK_DEFAULT_STATUSES);
        }
    }, [props.allowedStatus]);

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

                    <TextField
                        fullWidth
                        required
                        id="modal-task-title"
                        label="Title"
                        value={title}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            setTitle(event.target.value);
                        }}
                    />
                    <Stack
                        className='task-modal-line'
                        direction={{ sm: 'column', md: 'row' }}
                        spacing={{ xs: 1, sm: 2, md: 4 }}
                    >
                        <TextField
                            required
                            id="modal-task-author"
                            label="Author"
                            value={author}
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                setAuthor(event.target.value);
                            }}
                        />
                        <LocalizationProvider dateAdapter={AdapterMoment}>
                            <DateTimePicker
                                label="Due Date"
                                value={dueDate}
                                onChange={(date) => setDueDate(date)}
                            />
                        </LocalizationProvider>
                        <FormControl>
                            <InputLabel>Status</InputLabel>
                            <Select
                                labelId="task-status"
                                id="task-modal-status"
                                value={status}
                                label="Status"
                                onChange={(event: SelectChangeEvent) => {
                                    setStatus(event.target.value as string);
                                }}>
                                {Object.entries(allowedStatuses).map(([key, value]) => (
                                    <MenuItem className={`dropdown-status-${key}`} value={`${key}`}>{value}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Stack>
                    <TextField
                        fullWidth
                        multiline
                        rows={5}
                        id="modal-task-description"
                        label="Description"
                        value={description}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            setDescription(event.target.value);
                        }}
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

const mapStateToProps = (state: RootState) => {
    return {
        allowedStatus: state.task.allowedStatus,
    }
};

export default connect(mapStateToProps)(TaskModal);