import React, { useRef, useCallback, useState } from 'react';
import { FiLogIn, FiMail } from 'react-icons/fi'
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import * as Yup from 'yup';
import { Link, useHistory } from 'react-router-dom';

import { useToast } from '../../hooks/ToastContext';
import getValidationErrors from '../../utils/getValidationErrors';

import Logo from '../../assets/logo.svg';

import Input from '../../components/Input';
import Button from '../../components/Button';

import { Container, Content, AnimationContainer, Background } from './styles';
import api from '../../services/api';

interface ForgotFormData {
    email: string;
    password: string;
}

const Forgot: React.FC = () => {
    const [loading, setLoading] = useState(false)
    const formRef = useRef<FormHandles>(null);
    const { addToast } = useToast()
    const history = useHistory();

    const handleSubmit = useCallback(async (data: ForgotFormData) => {
        try {
            setLoading(true);

            formRef.current?.setErrors({});

            const schema = Yup.object().shape({
                email: Yup.string().required('E-mail é obrigatório').email('E-mail inválido'),
            });

            await schema.validate(data, {
                abortEarly: false,
            });

            await api.post('/password/forgot', {
                email: data.email,
            });

            addToast({
                type: 'success',
                title: 'E-mail de recuperação enviado',
                description: 'Enviamos um e-mail para confirmar a recuperação de senha, cheque sua caixa de entrada.'
            });

            history.push('/');
        } catch (err) {
            if (err instanceof Yup.ValidationError) {
                const errors = getValidationErrors(err);
                formRef.current?.setErrors(errors);
                return;
            }
            addToast({
                type: 'error',
                title: 'Erro na recuperação de senha',
                description: 'Ocorreu um erro ao tentar realizar a recuperação de senha, tente novamente.',
            })
        } finally {
            setLoading(false);
        }
    }, [addToast]);

    return (
        <Container>
            <Content>
                <AnimationContainer>
                    <img src={Logo} alt="Unb" />

                    <Form ref={formRef} onSubmit={handleSubmit}>
                        <h1>Recuperar senha</h1>
                        <Input name="email" icon={FiMail} placeholder="E-mail" />

                        <Button loading={loading} type="submit">Recuperar senha</Button>
                    </Form>

                    <Link to="/">
                        <FiLogIn />
                        Voltar ao login
                    </Link>
                </AnimationContainer>
            </Content>
            <Background />
        </Container>
    )
}


export default Forgot;