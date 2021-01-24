import React from 'react';

import { Container } from './styles';

interface InitialProps {
    initials: string;
}

const Avatar: React.FC<InitialProps> = ({ initials }) => (
    <Container>
        <p>{initials}</p>
    </Container>
);

export default Avatar;