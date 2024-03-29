
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import {DefaultTheme, DarkTheme} from '@react-navigation/native';
import Chats from '../Components/userStack/HomeScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Profile from '../Components/userStack/ProfileScreen';
import ChatRoom from '../Components/userStack/ChatRoom/ChatRoom';
import ThemeChange from '../Components/ThemeChange';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ChatRoomHeader from '../Components/userStack/ChatRoom/ChatRoomHeader';
import { StatusBar, StatusBarStyle } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../state/store';
import { darkTheme, lightTheme } from '../constants/theme';
import { Entypo } from '@expo/vector-icons';
import ChatRoomEntryPoint from '../Components/userStack/ChatRoom/ChatRoomEntryPoint';
import { setSettingsState } from '../state/slices/chatRoomSlice';
import HomeScreenEntryPoint from '../Components/userStack/HomeScreenEntryPoint';
const Tab = createBottomTabNavigator();

export default function UserStack(){

	const themeState = useSelector((state:RootState) => {return state.themeSlice.theme;});
	const settingsState = useSelector((state: RootState) => {return state.ChatRoomDataSlice?.chatRoomSettingsState});
	const theme = themeState === 'lightTheme' ? lightTheme : darkTheme;
	const dispatch = useDispatch();
	let navigationTheme = DefaultTheme;
	let statusBarStyle: StatusBarStyle = 'default';
	let statusBarColor = 'white';
	if(theme === darkTheme){
		navigationTheme = DarkTheme;
		statusBarStyle = 'light-content';
		statusBarColor = 'black';
	}else {
		statusBarStyle = 'dark-content';
	}

	return (
		<>
			<NavigationContainer theme={navigationTheme}>
				<StatusBar barStyle={statusBarStyle} backgroundColor={statusBarColor}></StatusBar>
				<Tab.Navigator screenOptions={({route}) => (
					{
						tabBarIcon: ({ color }) => {
							if(route.name === 'Chats'){
								return <Ionicons name='chatbubble-ellipses' size={27} color={color}></Ionicons>;
							}else if(route.name === 'Profile'){
								return <Ionicons name='person-circle' size={27} color={color}></Ionicons>;
							}
						}
					}
				)} initialRouteName='HomeScreenEntryPoint'>
					<Tab.Screen name='Chats' component={Chats} options={() => (
						{
							headerRight: () => <ThemeChange></ThemeChange>
						})}>
					</Tab.Screen>
					<Tab.Screen name='Profile' component={Profile} options={() => (
						{
							headerRight: () => <ThemeChange></ThemeChange>
						}
					)}></Tab.Screen>
					<Tab.Screen name='ChatRoom' component={ChatRoom} options={(params) => ({
						tabBarButton:() => null,
						headerTitle: () => {return <ChatRoomHeader params={params} />;},
						headerRight: () => {return <Entypo name="dots-three-vertical" size={24} color={theme.secondaryText.color} 
							style={{alignSelf: 'flex-end', paddingRight: 10}} onPress={() => {
								dispatch(setSettingsState(settingsState ? false : true))
								console.log('tapped header');
							}}/>;}
					})}></Tab.Screen>
					<Tab.Screen name='ChatRoomEntryPoint' component={ChatRoomEntryPoint} options={() => ({
						tabBarButton: () => null,
						header: () => null,
					})}></Tab.Screen>
					<Tab.Screen name='HomeScreenEntryPoint' component={HomeScreenEntryPoint} options={() => ({
						tabBarButton: () => null,
						header: () => null,
					})}></Tab.Screen>
				</Tab.Navigator>
			</NavigationContainer>
		</>
        
	);
}