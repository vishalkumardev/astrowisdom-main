import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';
import React, {useState, useEffect, useContext} from 'react';
import Global from '../Utilities/Global';
import {UserAuthContext} from '../context/UserAuthContext';
import Loader from '../Utilities/LoadingModal';
import Colours from '../Assets/Colours';
import Family from '../Utilities/Family';

const MyOrder = () => {
  const {User} = useContext(UserAuthContext);
  const [Data, setData] = useState([]);
  const [Loading, setLoading] = useState(false);

  const getOrder = async () => {
    const response = await fetch(Global.BASE_URL + `myOrder&userId=${User}`);
    const data = await response.json();
    setData(data.myOrder);
  };

  useEffect(() => {
    getOrder();
  }, []);

  return (
    <>
      {Loading ? (
        <Loader isLoading={Loading} />
      ) : (
        <View style={{flex: 1}}>
          <View>
            <FlatList
              showsVerticalScrollIndicator={false}
              data={Data}
              style={{marginTop: 10}}
              renderItem={({item, index}) => {
                return (
                  <View
                    style={{
                      marginHorizontal: 10,
                      marginVertical: index == 0 ? 0 : 10,
                      backgroundColor: Colours.light,
                      borderRadius: 10,
                      paddingVertical: 10,
                    }}>
                    <FlatList
                      data={item.productList}
                      showsVerticalScrollIndicator={false}
                      renderItem={({item, index}) => {
                        return (
                          <View
                            style={{
                              marginHorizontal: 10,
                              marginVertical: index == 0 ? 0 : 10,
                              backgroundColor: Colours.light,
                              borderRadius: 10,
                              flexDirection: 'row',
                              paddingVertical: 10,
                            }}>
                            <Image
                              source={{
                                uri: item.img,
                              }}
                              style={{
                                width: 70,
                                height: 70,
                                resizeMode: 'contain',
                                borderRadius: 10,
                              }}
                            />
                            <View style={{marginLeft: 20, flex: 1}}>
                              <Text
                                style={{
                                  color: Colours.PrimaryColor,
                                  fontFamily: Family.SemiBold,
                                }}>
                                {item.product}
                              </Text>
                              <View style={{flexDirection: 'row'}}>
                                <Text
                                  style={{
                                    color: Colours.PrimaryColor,
                                    fontFamily: Family.SemiBold,
                                    fontSize: 16,
                                  }}>
                                  ₹ {item.price}
                                </Text>
                              </View>
                            </View>
                          </View>
                        );
                      }}
                    />

                    <View
                      style={{
                        width: '90%',
                        marginTop: 15,
                        alignSelf: 'center',
                        borderTopColor: Colours.TextGrayColour,
                        borderTopWidth: 1,
                      }}>
                      <Text
                        style={{
                          fontFamily: Family.Medium,
                          marginTop: 10,
                          color: Colours.TextGrayColour,
                        }}>
                        Order Amount : ₹ {item.amount}
                      </Text>
                      <Text
                        style={{
                          fontFamily: Family.Medium,
                          marginVertical: 2,
                          color: Colours.TextGrayColour,
                        }}>
                        Order Status : {item.orderStatus}
                      </Text>
                      <Text
                        style={{
                          fontFamily: Family.Medium,
                          marginVertical: 2,
                          color: Colours.TextGrayColour,
                        }}>
                        Order Id : ord000{item.orderId}
                      </Text>
                      <Text
                        style={{
                          fontFamily: Family.Medium,
                          marginVertical: 2,
                          color: Colours.TextGrayColour,
                        }}>
                        Order Date : {item.order_date}
                      </Text>
                      <Text
                        style={{
                          fontFamily: Family.Medium,
                          marginVertical: 2,
                          color: Colours.TextGrayColour,
                        }}>
                        Address : {item.address}
                      </Text>
                    </View>
                  </View>
                );
              }}
            />
          </View>
        </View>
      )}
    </>
  );
};

export default MyOrder;

const styles = StyleSheet.create({});
