import React, {useEffect, useRef} from 'react';
import {View, StyleSheet, BackHandler, Alert} from 'react-native';
import {
  ZegoUIKitPrebuiltCall,
  ONE_ON_ONE_VOICE_CALL_CONFIG,
} from '@zegocloud/zego-uikit-prebuilt-call-rn';
import {useNavigation} from '@react-navigation/native';

const VoiceCall = ({navigation, route}) => {
  const {RoomId, AstrologerId, name} = route.params;
  const prebuiltRef = useRef();
  useEffect(() => {
    const backAction = () => {
      Alert.alert('Call Ended', 'Are you want to end this call ??', [
        {
          text: 'Cancel',
          onPress: () => null,
          style: 'cancel',
        },
        {
          text: 'YES',
          onPress: () => {
            prebuiltRef.current.hangUp();
          },
        },
      ]);
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);
  return (
    <>
      <View style={styles.container}>
        <ZegoUIKitPrebuiltCall
          ref={prebuiltRef}
          appID={158492876}
          appSign={
            '71371c39c64e83dcd661099713c5db6fda00a41366158f0253f6abbca5b044cf'
          }
          userID={AstrologerId}
          userName={`Astro`}
          callID={RoomId}
          config={{
            ...ONE_ON_ONE_VOICE_CALL_CONFIG,
            onOnlySelfInRoom: () => {
              navigation.navigate('BottomNavigationBar');
            },
            onHangUp: () => {
              navigation.navigate('BottomNavigationBar');
            },

            durationConfig: {
              isVisible: true,
              onDurationUpdate: duration => {
                if (duration === 5 * 60) {
                  prebuiltRef.current.hangUp();
                }
              },
            },
          }}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default VoiceCall;
