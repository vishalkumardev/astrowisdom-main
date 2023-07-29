import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  TextInput,
  Modal,
  Dimensions,
  ToastAndroid,
  Alert,
} from 'react-native';
import React, {useState, useEffect, useContext} from 'react';
import Colours from '../Assets/Colours';
import Family from '../Utilities/Family';
import Global from '../Utilities/Global';
import {UserAuthContext} from '../context/UserAuthContext';
import {XMarkIcon} from 'react-native-heroicons/outline';
import {WebView} from 'react-native-webview';
import Loader from '../Utilities/LoadingModal';

const Address = ({navigation, route}) => {
  const [AddressBook, setAddressBook] = useState([]);
  const [selected, setselected] = useState(100);
  const [Toggle, setToggle] = useState(false);
  const [PaymentToggle, setPaymentToggle] = useState(false);
  const [HouseNo, setHouseNo] = useState('');
  const [streetAddress, setstreetAddress] = useState('');
  const [City, setCity] = useState('');
  const [Pincode, setPincode] = useState('');
  const {User} = useContext(UserAuthContext);
  const [Loading, setLoading] = useState(false);

  const {Total, priceArr, productIdArr, qtyArr} = route.params;

  const getAddress = async () => {
    setLoading(true);
    const response = await fetch(
      Global.BASE_URL + `viewAddress&userId=${User}`,
    );

    const data = await response.json();
    setAddressBook(data.addressBook);
    setLoading(false);
  };

  const saveAddress = async () => {
    const response = await fetch(
      Global.BASE_URL +
        `addAddress&userId=${User}&houseNo=${HouseNo}&streetAddress=${streetAddress}&city=${City}&pincode=${Pincode}`,
    );
    const data = await response.json();
    if (data.response.status == 1) {
      ToastAndroid.show('Address Saved', ToastAndroid.SHORT);
      setToggle(false);
      getAddress();
    }
  };

  const placeOrder = async () => {
    const response = await fetch(
      Global.BASE_URL +
        `placeOrder&userId=${User}&addressId=${AddressBook[selected].addressId}&amount=${Total}&productId=${productIdArr}&price=${priceArr}&qty=${qtyArr}`,
    );
    const data = await response.json();
    if (data.response.status == 1) {
      navigation.navigate('Success');
    }
  };

  const handleUrl = async newNavState => {
    const {url} = newNavState;
    if (url == 'https://astrowisdom.in/payment/standard/meTrnSuccess.php') {
      setPaymentToggle(false);
    }
    if (
      url == 'https://astrowisdom.in/payment/standard/meTrnCancelSuccess.php'
    ) {
      Alert.alert('Payment Failed');
    }
  };

  useEffect(() => {
    getAddress();
  }, []);

  return (
    <>
      {Loading ? (
        <Loader isLoading={Loading} />
      ) : (
        <View style={{flex: 1, marginHorizontal: 10, marginVertical: 10}}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text
              style={{
                color: Colours.TextGrayColour,
                fontFamily: Family.Medium,
                fontSize: 14,
              }}>
              Address
            </Text>
            <TouchableOpacity
              style={{
                backgroundColor: Colours.PrimaryColor,
                paddingHorizontal: 10,
                paddingVertical: 7,
                borderRadius: 5,
              }}
              onPress={() => setToggle(true)}>
              <Text
                style={{
                  color: Colours.light,
                  fontFamily: Family.Medium,
                  fontSize: 12,
                }}>
                Add Address
              </Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={AddressBook}
            ListEmptyComponent={
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: 400,
                }}>
                <Text
                  style={{
                    color: Colours.PrimaryColor,
                    fontFamily: Family.Medium,
                    fontSize: 14,
                  }}>
                  You don't saved Address
                </Text>
              </View>
            }
            renderItem={({item, index}) => {
              return (
                <TouchableOpacity
                  style={{
                    backgroundColor: Colours.light,
                    borderRadius: 10,
                    paddingVertical: 15,
                    paddingHorizontal: 10,
                    marginVertical: 10,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                  onPress={() => setselected(index)}>
                  <TouchableOpacity
                    style={{
                      height: 20,
                      width: 20,
                      borderRadius: 12,
                      borderColor: Colours.PrimaryColor,
                      borderWidth: 1,
                      flexDirection: 'row',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                    onPress={() => setselected(index)}>
                    <View
                      style={{
                        height: 14,
                        width: 14,
                        borderRadius: 12,
                        backgroundColor:
                          index == selected
                            ? Colours.PrimaryColor
                            : Colours.light,
                      }}></View>
                  </TouchableOpacity>
                  <View style={{flex: 1, marginLeft: 20}}>
                    <Text
                      style={{
                        fontFamily: Family.Medium,
                        fontSize: 12,
                        color: Colours.TextGrayColour,
                      }}>
                      House No {item.houseNo} ,
                    </Text>
                    <Text
                      style={{
                        fontFamily: Family.Medium,
                        fontSize: 12,
                        color: Colours.TextGrayColour,
                      }}>
                      {item.streetAddress} ,
                    </Text>
                    <Text
                      style={{
                        fontFamily: Family.Medium,
                        fontSize: 12,
                        color: Colours.TextGrayColour,
                      }}>
                      {item.city} ,
                    </Text>
                    <Text
                      style={{
                        fontFamily: Family.Medium,
                        fontSize: 12,
                        color: Colours.TextGrayColour,
                      }}>
                      {item.pincode}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            }}
          />
        </View>
      )}
      <Modal
        animationType="slide"
        transparent={true}
        visible={Toggle}
        onRequestClose={() => {
          setToggle(!Toggle);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View
              style={{
                position: 'absolute',
                width: '90%',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginVertical: 10,
                alignSelf: 'center',
              }}>
              <Text
                style={{
                  fontFamily: Family.SemiBold,
                  fontSize: 14,
                  color: Colours.PrimaryColor,
                }}>
                Add Address
              </Text>
              <TouchableOpacity onPress={() => setToggle(false)}>
                <XMarkIcon color={Colours.black} size={24} />
              </TouchableOpacity>
            </View>

            <View style={{marginHorizontal: 15, marginTop: 50}}>
              <View>
                <Text style={styles.label}>House No</Text>
                <TextInput
                  placeholder="Enter House No / Appartment"
                  value={HouseNo}
                  onChangeText={setHouseNo}
                  placeholderTextColor={Colours.TextGrayColour}
                  style={styles.input}
                />
              </View>
              <View>
                <Text style={styles.label}>Street Address</Text>
                <TextInput
                  placeholder="Enter Street Address"
                  value={streetAddress}
                  onChangeText={setstreetAddress}
                  placeholderTextColor={Colours.TextGrayColour}
                  style={styles.input}
                />
              </View>
              <View>
                <Text style={styles.label}>City</Text>
                <TextInput
                  placeholder="Enter City"
                  value={City}
                  onChangeText={setCity}
                  placeholderTextColor={Colours.TextGrayColour}
                  style={styles.input}
                />
              </View>
              <View>
                <Text style={styles.label}>Pincode</Text>
                <TextInput
                  placeholder="Enter Pincode"
                  value={Pincode}
                  onChangeText={setPincode}
                  placeholderTextColor={Colours.TextGrayColour}
                  style={styles.input}
                  maxLength={6}
                  keyboardType="number-pad"
                />
              </View>

              <TouchableOpacity
                style={{
                  backgroundColor: Colours.PrimaryColor,
                  marginVertical: 10,
                  paddingVertical: 15,
                  borderRadius: 5,
                }}
                onPress={saveAddress}>
                <Text
                  style={{
                    textAlign: 'center',
                    fontFamily: Family.SemiBold,
                    color: Colours.light,
                  }}>
                  Save Address
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal animationType="slide" transparent={true} visible={PaymentToggle}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <WebView
              source={{
                uri: `https://astrowisdom.in/payment/standard/meTrnReq.php?userId=${User}&amount=${Total}`,
              }}
              style={{flex: 1}}
              onNavigationStateChange={handleUrl}
            />
          </View>
        </View>
      </Modal>

      {selected == 100 ? null : (
        <TouchableOpacity
          style={{
            position: 'absolute',
            bottom: 0,
            width: '100%',
            backgroundColor: Colours.PrimaryColor,
            paddingVertical: 15,
          }}
          onPress={placeOrder}>
          <Text
            style={{
              color: Colours.light,
              fontFamily: Family.SemiBold,
              textAlign: 'center',
            }}>
            Place Order
          </Text>
        </TouchableOpacity>
      )}
    </>
  );
};

export default Address;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
  },
  modalView: {
    backgroundColor: 'white',
    height: Dimensions.get('window').height,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  label: {
    color: Colours.TextGrayColour,
    marginVertical: 5,
    fontFamily: Family.Medium,
    fontSize: 13,
  },
  input: {
    borderColor: Colours.PrimaryColor,
    borderWidth: 1,
    marginVertical: 5,
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 5,
    fontFamily: Family.Medium,
    fontSize: 13,
    color: Colours.TextDarkColour,
  },
});
