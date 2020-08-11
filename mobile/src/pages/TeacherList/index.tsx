import React, { useState } from 'react';
import { View, Text, Image } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

import styles from './styles';
import PageHeader from '../../components/PageHeader';
import TeacherItem, { Teacher } from '../../components/TeacherItem';
import { ScrollView, TextInput, BorderlessButton, RectButton } from 'react-native-gesture-handler';
import { Feather } from '@expo/vector-icons';
import api from '../../services/api';
import { useFocusEffect } from '@react-navigation/native';

export default function TeacherList () {
    const [teachers, setTeachers] = useState([]);
    const [favorites, setFavorites] = useState<number[]>([]);

    const [subject, setSubject] = useState('');
    const [week_day, setWeekDay] = useState('');
    const [time, setTime] = useState('');

    const [isFiltersVisible, setIsFiltersVisible] = useState(false);

    function loadFavorites() {
        AsyncStorage.getItem('favorites').then(response => {
            if(response) {
                const favoritedTeachers = JSON.parse(response);
                const favoritedTeachersIds = favoritedTeachers.map((teacher: Teacher) => {
                    return teacher.id;
                })
                setFavorites(favoritedTeachersIds);
            }
        })
    };

    async function handleFilterSubmit(){
        loadFavorites();
        const response = await api.get('/classes', {
            params: {
                subject,
                week_day,
                time,
            }
        });
        setIsFiltersVisible(false);
        setTeachers(response.data);      
    };
    
    function handleToggleFiltersVisible(){
        setIsFiltersVisible(!isFiltersVisible);
    }

    useFocusEffect(
        React.useCallback(() => {
          loadFavorites();
        }, [])
    )

    return (
        <View style={styles.container}>
            <PageHeader 
                title="Proffys disponíveis" 
                headerRight={(
                    <BorderlessButton onPress={handleToggleFiltersVisible}>
                        <Feather name="filter" size={20} color="#FFF" />
                    </BorderlessButton>
                )}
            >
                { isFiltersVisible && (
                    <ScrollView>
                        <View style={styles.searchForm}>
                            <Text style={styles.label}>Matéria</Text>
                            <TextInput
                                style={styles.input}
                                value={subject}
                                onChangeText={text => setSubject(text)}
                                placeholder="Qual a matéria?"
                                placeholderTextColor="#C1BCCC"
                            />

                            <View style={styles.inputGroup}>
                                <View style={styles.inputBlock}>
                                    <Text style={styles.label}>Dia da semana</Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Qual o dia?"
                                        value={week_day}
                                        onChangeText={text => setWeekDay(text)}
                                        placeholderTextColor="#C1BCCC"
                                    />
                                </View>

                                <View style={styles.inputBlock}>
                                    <Text style={styles.label}>Horário</Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Qual o horário?"
                                        value={time}
                                        onChangeText={text => setTime(text)}
                                        placeholderTextColor="#C1BCCC"
                                    />
                                </View>
                            </View>
                            <RectButton onPress={handleFilterSubmit} style={styles.submitButton}>
                                <Text style={styles.submitButtonText}>Filtrar</Text>
                            </RectButton>
                        </View>
                    </ScrollView>
                )}
            </PageHeader>

            <ScrollView
                style={styles.teacherList}
                contentContainerStyle={{
                    paddingBottom: 24,
                    paddingHorizontal: 16,
                }}
            >
                {
                    teachers.map((teacher: Teacher) => {
                        return (
                            <TeacherItem 
                                key={teacher.id} 
                                teacher={teacher}
                                favorited={favorites.includes(teacher.id)}
                            />
                        );
                    })
                }
            </ScrollView>
        </View>
    );
}