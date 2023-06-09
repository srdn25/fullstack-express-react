import React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { ITask } from '../../redux/reducer/task';

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
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

function TaskModal (props: IProps) : React.ReactElement<IProps> {
    return (
        <div className='task-modal'>
            <Modal
                open={props.modalOpen}
                onClose={props.closeTask}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    Hello modal!
                </Box>
            </Modal>
        </div>
    )
}

export default TaskModal;