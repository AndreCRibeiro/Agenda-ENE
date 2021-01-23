import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { isToday, format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import DayPicker, { DayModifiers } from 'react-day-picker';
import 'react-day-picker/lib/style.css';
import { Avatar } from "baseui/avatar";

import { useAuth } from '../../hooks/AuthContext';

import logo from '../../assets/logo.svg';
import { FiClock, FiPower } from 'react-icons/fi';

import {
    Container,
    Header,
    HeaderContent,
    Profile,
    Image,
    Content,
    Schedule,
    NextAppointment,
    Calendar,
    Section,
    Appointment
} from './styles';
import api from '../../services/api';

interface MonthAvailabilityItem {
    day: number;
    available: boolean;
}

interface Appointment {
    id: string;
    date: string;
    user: {
        name: string;
        avatar_url: string;
    }
}

const Dashboard: React.FC = () => {
    const { user, signOut } = useAuth();
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [monthAvailability, setMonthAvailability] = useState<MonthAvailabilityItem[]>([]);
    const [appointments, setAppointments] = useState<Appointment[]>([]);

    const handleDateChange = useCallback((day: Date, modifiers: DayModifiers) => {
        if (modifiers.available) {
            setSelectedDate(day);
        }
    }, [])

    const handleMonthChange = useCallback((month: Date) => {
        setCurrentMonth(month);
    }, []);

    useEffect(() => {
        api.get(`/providers/${user.id}/month-availability`, {
            params: {
                year: currentMonth.getFullYear(),
                month: currentMonth.getMonth() + 1,
            }
        }).then(response => {
            setMonthAvailability(response.data)
        })
    }, [currentMonth, user.id])

    useEffect(() => {
        api.get('/appointments/me', {
            params: {
                year: selectedDate.getFullYear(),
                month: selectedDate.getMonth() + 1,
                day: selectedDate.getDate(),
            }
        }).then(response => {
            setAppointments(response.data);
            console.log(response.data);
        })
    }, [selectedDate])

    const disabledDays = useMemo(() => {
        const dates = monthAvailability
            .filter(monthDay => monthDay.available === false)
            .map(monthDay => {
                const year = currentMonth.getFullYear();
                const month = currentMonth.getMonth();
                return new Date(year, month, monthDay.day);
            });

        return dates;
    }, [currentMonth, monthAvailability]);

    const selectedDateAsText = useMemo(() => {
        return format(selectedDate, "'Dia' dd 'de' MMMM", {
            locale: ptBR,
        })
    }, [selectedDate]);

    const selectedWeekDay = useMemo(() => {
        return format(selectedDate, 'cccc', {
            locale: ptBR,
        })
    }, [selectedDate])

    return (
        <Container>
            <Header>
                <HeaderContent>
                    <img src={logo} alt="AgendaENE" />

                    <Profile>
                        <Image>
                            <Avatar
                                name={user.name}
                                size="scale120"
                                src="https://api.adorable.io/avatars/285/10@adorable.io.png"
                                overrides={{
                                    Initials: {
                                        style: () => ({
                                            backgroundColor: "red"
                                        })
                                    }
                                }}
                            />
                        </Image>
                        <div>
                            <span>Bem-vindo,</span>
                            <strong>{user.name}</strong>
                        </div>
                    </Profile>

                    <button type="button" onClick={signOut}>
                        <FiPower />
                    </button>
                </HeaderContent>
            </Header>

            <Content>
                <Schedule>
                    <h1>Horários agendados</h1>
                    <p>
                        {isToday(selectedDate) && (<span>Hoje</span>)}
                        <span>{selectedDateAsText}</span>
                        <span>{selectedWeekDay}</span>
                    </p>
                    <NextAppointment>
                        <strong>Atendimento(os) a seguir</strong>
                        <div>
                            <img
                                src="https://avatars.githubusercontent.com/u/26776218?s=460&u=964b019741d54bdcd2d147c5dd86c4d495bf76dd&v=4"
                                alt="Avatar"
                            />
                            <strong>André Cavalcanti</strong>
                            <span>
                                <FiClock />
                                10:00
                        </span>
                        </div>
                    </NextAppointment>

                    <Section>
                        <strong>Manhã</strong>
                        <Appointment>
                            <span>
                                <FiClock />
                                10:00
                            </span>

                            <div>
                                <img
                                    src="https://avatars.githubusercontent.com/u/26776218?s=460&u=964b019741d54bdcd2d147c5dd86c4d495bf76dd&v=4"
                                    alt="Avatar"
                                />
                                <strong>André Cavalcanti</strong>
                            </div>
                        </Appointment>
                        <Appointment>
                            <span>
                                <FiClock />
                                10:00
                            </span>

                            <div>
                                <img
                                    src="https://avatars.githubusercontent.com/u/26776218?s=460&u=964b019741d54bdcd2d147c5dd86c4d495bf76dd&v=4"
                                    alt="Avatar"
                                />
                                <strong>André Cavalcanti</strong>
                            </div>
                        </Appointment>
                    </Section>

                    <Section>
                        <strong>Tarde</strong>
                        <Appointment>
                            <span>
                                <FiClock />
                                10:00
                            </span>

                            <div>
                                <img
                                    src="https://avatars.githubusercontent.com/u/26776218?s=460&u=964b019741d54bdcd2d147c5dd86c4d495bf76dd&v=4"
                                    alt="Avatar"
                                />
                                <strong>André Cavalcanti</strong>
                            </div>
                        </Appointment>
                    </Section>
                </Schedule>
                <Calendar>
                    <DayPicker
                        weekdaysShort={['D', 'S', 'T', 'Q', 'Q', 'S', 'S']}
                        fromMonth={new Date()}
                        disabledDays={[
                            { daysOfWeek: [0, 6] }, ...disabledDays]}
                        modifiers={{
                            available: { daysOfWeek: [1, 2, 3, 4, 5] },
                        }}
                        onMonthChange={handleMonthChange}
                        selectedDays={selectedDate}
                        onDayClick={handleDateChange}
                        months={[
                            'Janeiro',
                            'Fevereiro',
                            'Março',
                            'Abril',
                            'Maio',
                            'Junho',
                            'Julho',
                            'Agosto',
                            'Setembro',
                            'Outubro',
                            'Novembro',
                            'Dezembro',
                        ]}
                    />
                </Calendar>
            </Content>
        </Container>
    )
}

export default Dashboard;