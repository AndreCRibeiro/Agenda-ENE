import styled, { css } from 'styled-components';
import ToolTip from '../Tooltip';

interface ContainerProps {
    isFocused: boolean;
    isFilled: boolean;
    isErrored: boolean;
}

export const Container = styled.div<ContainerProps>`
    background: #232129;
    border-radius: 10px;
    padding: 16px;
    width: 100%;
    display: flex;
    align-items: center;

    border: 2px solid #232129;
    color: #666360;

    ${props => props.isErrored && css`
        border-color: #c53030;
    `}

    ${props => props.isFocused && css`
        color: #FF9000;
        border-color: #FF9000;
    `}

    ${props => props.isFilled && css`
        color: #FF9000;
    `}

    & + div {
        margin-top: 8px;
    }

    input {
        flex: 1;
        background: transparent;
        border: 0;
        color: #FFF;

        &::placeholder {
        color: #666360;
        }        
    }

    svg {
        margin-right: 16px;
    }

`;

export const Error = styled(ToolTip)`
    height: 20px;
    margin-left: 16px;
    svg {
        margin: 0;
    }

    span {
        background: #C53030;
        color: #FFF;

        &::before {
            border-color: #C53030;
        }
    }
`;