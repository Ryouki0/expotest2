import { getAuth } from 'firebase/auth';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import createChatRoom from '../../utils/HomeScreen/createChatRoom';
import StorageImage from '../StorageImage';
import { Text } from 'react-native-elements';
import { useSelector } from 'react-redux';
import { RootState } from '../../state/store';
import { darkTheme, lightTheme } from '../../constants/theme';
import { images } from '../../constants/images';
import { user } from '../../models/UserData';
const auth = getAuth();


export default function DisplayUsers({navigation, usersToDisplay}: React.PropsWithChildren<{
	navigation: any,
	usersToDisplay: user[],
}>){
    
	const currentUser = auth.currentUser;
	const themeState = useSelector((state: RootState) => {return state.themeSlice.theme;});
	const theme = themeState === 'lightTheme' ? lightTheme : darkTheme;
	
	return (
		usersToDisplay ? (
			usersToDisplay.map((user) => {
				if(user.uid === currentUser.uid){
					return null;
				}
				console.log('user: ', user);
				return (
					<TouchableOpacity key={user.uid} onPress={() => {
						createChatRoom(currentUser.uid, user.uid, navigation);
					}}>
						<View style={{flexDirection: 'row', alignItems: 'center'}}>
							<StorageImage imagePath={user.pfp} style={images.pfp} />
							<Text style={theme.primaryText}>
								{user.name}
							</Text>
						</View>
					</TouchableOpacity>	
				);
			}
			) 
		) : (
			<></>
		)
	);
              
}

