
import { getFirestore } from 'firebase/firestore';
import { doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import uid from 'react-native-uuid';
import { sendPushNotification } from '../notification';

const db = getFirestore();

export default async function sendMessage(roomID: string, currentUserID: string, otherUserID: string, message: string){
	if(message === ''){
		console.log('No message');
		return -1;
	}
	try{
		await updateDoc(doc(db, 'PrivateChatRooms', `${roomID}`), {Messages: arrayUnion({
			message: message,
			time: new Date(),
			user: currentUserID,
			seen: false,
			id: String(uid.v4()),
		}
		)});

		//update chatrooms for current user
		const chatRooms = (await getDoc(doc(db, 'Users', `${currentUserID}`))).data().PrivateChatRooms;
		const newChatRooms = chatRooms.map((room) => {
			if(roomID === room.chatRoomId){
				return {
					chatRoomId: roomID,
					otherUser: room.otherUser,
					lastMessage: {
						message: message,
						user: currentUserID,
						time: new Date(),
					}
				};
			}else{
				return room;
			}
		});
		//update chatrooms for other user
		const otherUserData = (await getDoc(doc(db, 'Users', `${otherUserID}`))).data();
		const otherUserChatRooms = otherUserData.PrivateChatRooms;
		const token = otherUserData.expoPushToken;
		const otherUserNewChatRooms = otherUserChatRooms.map((room) => {
			if(roomID === room.chatRoomId){
				return {
					chatRoomId: roomID,
					otherUser: room.otherUser,
					lastMessage: {
						message: message,
						user: currentUserID,
						time: new Date(),
					}
				};
			}else{
				return room;
			}
		});

		console.log('newChatRooms: ', newChatRooms);
		await updateDoc(doc(db, 'Users', `${currentUserID}`), {PrivateChatRooms: newChatRooms});
		await updateDoc(doc(db, 'Users', `${otherUserID}`), {PrivateChatRooms: otherUserNewChatRooms});
	
		if(!token){
			console.log('no expoPushToken');
		}else{
			sendPushNotification(token);
		}
	}catch(err){
		console.log('error in sendMessage: ', err);
	}
}