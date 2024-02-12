
import React, { useContext } from 'react';
import { DarkTheme, DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import CreateAccountScreen from '../Components/authStack/CreateAccountScreen';
import WelcomeScreen from '../Components/authStack/WelcomeScreen';
import { ThemeContext } from '../hooks/useTheme';
import { Button } from 'react-native-elements';
import ThemeChange from '../Components/ThemeChange';
const Stack = createStackNavigator();

export default function AuthStack(){
    const theme = useContext(ThemeContext);
    let navigationTheme = null;
    if(theme.isDark){
        navigationTheme = DarkTheme;
    }else{
        navigationTheme = DefaultTheme;
    }
    return (
        <NavigationContainer theme={navigationTheme}>
             <Stack.Navigator initialRouteName='WelcomeScreen' >
                
                <Stack.Screen name='CreateAccountScreen' component={CreateAccountScreen} options={({ route }) => (
                    {headerStyle:{
                        backgroundColor: theme.container.backgroundColor,
                    },
                    title: 'Create Account', 
                    headerTintColor: theme.text.color,
                    headerRight: () => <ThemeChange />
                    })
                }></Stack.Screen>
                <Stack.Screen name='WelcomeScreen' component={WelcomeScreen} options={({ route }) => (
                    {headerStyle:{
                            backgroundColor: theme.container.backgroundColor,
                        },
                        title: 'Welcome', 
                        headerTintColor: theme.text.color,
                        headerRight: () => <ThemeChange />
                        }
                )}></Stack.Screen>
            </Stack.Navigator>
        </NavigationContainer>
    )
}