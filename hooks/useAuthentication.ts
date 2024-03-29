

import React from 'react';
import { onAuthStateChanged, initializeAuth, getReactNativePersistence, user} from 'firebase/auth';
import  ReactNativeAsyncStorage  from '@react-native-async-storage/async-storage';
import app from '../config/firebaseConfig';

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

export function useAuthentication() {
  const [user, setUser] = React.useState<user>(null);

  React.useEffect(() => {
    const unsubscribeFromAuthStatuChanged = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log('user: ', user);
        setUser(user);
      } else {
        console.log('useAuth, user is signed out');
        setUser(undefined);
      }
    })

    return unsubscribeFromAuthStatuChanged;
  }, []);

  return user;
}