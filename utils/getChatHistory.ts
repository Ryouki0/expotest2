
import { StringOmit } from '@rneui/base';
import { getAuth } from 'firebase/auth';
import { DocumentSnapshot, Timestamp, collection, doc, getDoc, getDocs, getFirestore, or, orderBy, query, where } from 'firebase/firestore';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../state/store';
import { setChatRoomQueryState, setChatRoomState } from '../state/slices/chatRoomsSlice';
import { store } from '../state/store';
import { current } from '@reduxjs/toolkit';
const auth = getAuth();
const db = getFirestore();


interface User{
	Username: string,
	pfp: string,
	uid: string,
}

export default async function getChatHistory(){
	//const chatRooms = (await getDoc(doc(db, 'Users', `${auth.currentUser.uid}`))).data().PrivateChatRooms;
	const userData = (await getDoc(doc(db,'Users', `${auth.currentUser.uid}`))).data();
	const chatHistoryQuery = query(collection(db, 'PrivateChatRooms'), 
	or(where('User1.Username', '==', userData.Username), 
		where('User2.Username', '==', userData.Username)
	), orderBy('lastMessageTime'));

	let chatRoomsWithMessage = [];

	const qSnapShot = await getDocs(chatHistoryQuery);
	if(qSnapShot.empty){
		console.log('query empty : ', qSnapShot.empty);
		return null;
	}


	const chatRoomIds = [];
	qSnapShot.forEach((doc: DocumentSnapshot) => {
		let otherUser: User = doc.data().User1;
		let currentUserNumber = 'User2';
		if(doc.data().User1.Username === userData.Username){
			otherUser = doc.data().User2;
			currentUserNumber = 'User1';
		} 

		console.log('\ndoc ID: ', doc.id);
		chatRoomIds.push({
			chatRoomId: doc.id, 
			currentUserNumber: currentUserNumber,  
			Username: userData.Username,
			pfp: userData.pfp,
			uid: userData.uid,
		});
		chatRoomsWithMessage.push({otherUser,
			chatRoomId: doc.id,
			lastMessage: doc.data().Messages[doc.data().Messages.length - 1]});
	})
	
	store.dispatch(setChatRoomState(chatRoomIds ));
	store.dispatch(setChatRoomQueryState(chatHistoryQuery));
	return chatRoomsWithMessage.reverse();
}