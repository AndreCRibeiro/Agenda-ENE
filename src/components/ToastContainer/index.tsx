import React from 'react';
import { useTransition } from 'react-spring';

import Toast from './Toast';

import { ToastMessage } from '../../hooks/ToastContext';
import { Container } from './styles';

interface ToastContainerProps {
    message: ToastMessage[];
}

const ToastContainer: React.FC<ToastContainerProps> = ({ message }) => {
    const messageWithTransitions = useTransition(
        message,
        message => message.id,
        {
            from: { right: '-120%', opacity: 0, transform: 'rotateZ(0deg)' },
            enter: { right: '0%', opacity: 1, transform: 'rotateZ(360deg)' },
            leave: { right: '-120%', opacity: 0, transform: 'rotateZ(0deg)' },
        }
    );

    return (
        <Container>
            {messageWithTransitions.map(({ item, key, props }) => (
                <Toast
                    key={key}
                    message={item}
                    style={props}
                />
            ))}
        </Container>
    )
}

export default ToastContainer;