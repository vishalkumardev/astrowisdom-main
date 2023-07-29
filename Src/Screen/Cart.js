import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
  ToastAndroid,
} from 'react-native';
import React, {useEffect, useState, useContext} from 'react';
import Family from '../Utilities/Family';
import Colours from '../Assets/Colours';
import ShopHeader from '../Assets/ShopHeader';
import Global from '../Utilities/Global';
import {UserAuthContext} from '../context/UserAuthContext';
import {MinusIcon, PlusIcon, TrashIcon} from 'react-native-heroicons/outline';
import Loader from '../Utilities/LoadingModal';

const Cart = ({navigation}) => {
  const [Products, setProducts] = useState([]);
  const [Total, setTotal] = useState('');
  const [priceArr, setpriceArr] = useState([]);
  const [productIdArr, setproductIdArr] = useState([]);
  const [qtyArr, setqtyArr] = useState([]);
  const [Loading, setLoading] = useState(false);

  const {User} = useContext(UserAuthContext);

  const getItems = async () => {
    setLoading(true);
    const response = await fetch(Global.BASE_URL + `myCart&userId=${User}`);
    const data = await response.json();
    if (data.response.status == 0) {
      setProducts([]);
      setTotal(0);
    } else {
      setProducts(data.response);
      calculate(data.response);
    }
    setLoading(false);
  };

  const calculate = data => {
    let tempdata = data;
    let price = [];
    let qty = [];
    let productId = [];
    let total = 0;
    tempdata.map(value => {
      total = total + parseInt(value.price);
      price.push(value.price);
      qty.push(value.qty);
      productId.push(value.productId);
    });
    setTotal(total);

    setpriceArr(price);
    setqtyArr(qty);
    setproductIdArr(productId);
    setLoading(false);
  };

  const RemoveCart = async id => {
    const response = await fetch(
      Global.BASE_URL + `deleteCart&userId=${User}&productId=${id}`,
    );
    const data = await response.json();
    if (data.response.status == 1) {
      ToastAndroid.show('Product has been Removed to Cart', ToastAndroid.SHORT);
      getItems();
    }
  };
  const IncreaseQty = async (id, qty, price) => {
    const response = await fetch(
      Global.BASE_URL +
        `addtocart&productId=${id}&userId=${User}&qty=${qty + 1}&price=${
          price * (qty + 1)
        }`,
    );
    const data = await response.json();
    if (data.response.status == 1) {
      getItems();
    }
  };

  const DecreaseQty = async (id, qty, price) => {
    const response = await fetch(
      Global.BASE_URL +
        `addtocart&productId=${id}&userId=${User}&qty=${qty - 1}&price=${
          price * (qty - 1)
        }`,
    );
    const data = await response.json();
    if (data.response.status == 1) {
      getItems();
    }
  };

  useEffect(() => {
    getItems();
  }, []);
  return (
    <>
      {Loading ? (
        <Loader isLoading={Loading} />
      ) : (
        <View style={{flex: 1}}>
          <View>
            <FlatList
              data={Products}
              ListEmptyComponent={
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                    height: 400,
                  }}>
                  <Text
                    style={{
                      color: Colours.PrimaryColor,
                      fontFamily: Family.Medium,
                      fontSize: 18,
                    }}>
                    Your Cart is Empty
                  </Text>

                  <TouchableOpacity
                    style={{
                      marginVertical: 50,
                      backgroundColor: Colours.PrimaryColor,
                      paddingVertical: 10,
                      paddingHorizontal: 20,
                      borderRadius: 10,
                    }}
                    onPress={() => navigation.goBack()}>
                    <Text
                      style={{
                        color: Colours.light,
                        fontFamily: Family.Medium,
                        fontSize: 14,
                      }}>
                      Continue Shopping
                    </Text>
                  </TouchableOpacity>
                </View>
              }
              renderItem={({item}) => {
                return (
                  <TouchableOpacity
                    style={{
                      marginHorizontal: 10,
                      marginVertical: 10,
                      backgroundColor: Colours.light,
                      borderRadius: 10,
                      flexDirection: 'row',
                      padding: 10,
                    }}>
                    <Image
                      source={{
                        uri: item.img,
                      }}
                      style={{
                        width: 100,
                        height: 100,
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
                        {item.productName}
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

                      <View
                        style={{
                          flexDirection: 'row',
                          width: '45%',
                          marginTop: 5,
                        }}>
                        {item.qty !== 1 ? (
                          <TouchableOpacity
                            style={{
                              paddingHorizontal: 10,
                              backgroundColor: Colours.PrimaryColor,
                              paddingVertical: 2,
                              width: '35%',
                            }}
                            onPress={() =>
                              DecreaseQty(
                                item.productId,
                                item.qty,
                                item.unitPrice,
                              )
                            }>
                            <MinusIcon color={Colours.light} size={16} />
                          </TouchableOpacity>
                        ) : (
                          <TouchableOpacity
                            style={{
                              paddingHorizontal: 10,
                              backgroundColor: Colours.PrimaryColor,
                              paddingVertical: 2,
                              width: '35%',
                            }}
                            onPress={() => RemoveCart(item.productId)}>
                            <TrashIcon color={Colours.light} size={14} />
                          </TouchableOpacity>
                        )}

                        <View
                          style={{
                            paddingHorizontal: 10,
                            backgroundColor: Colours.Background,
                            paddingVertical: 2,
                            width: '35%',
                          }}>
                          <Text
                            style={{
                              textAlign: 'center',
                              color: Colours.TextGrayColour,
                              fontFamily: Family.Regular,
                              fontSize: 12,
                            }}>
                            {item.qty}
                          </Text>
                        </View>
                        <TouchableOpacity
                          style={{
                            paddingHorizontal: 10,
                            backgroundColor: Colours.PrimaryColor,
                            paddingVertical: 2,
                            width: '35%',
                          }}
                          onPress={() =>
                            IncreaseQty(
                              item.productId,
                              item.qty,
                              item.unitPrice,
                            )
                          }>
                          <PlusIcon color={Colours.light} size={16} />
                        </TouchableOpacity>
                      </View>
                    </View>

                    <TouchableOpacity
                      style={{
                        marginVertical: 10,
                        borderRadius: 5,
                        position: 'absolute',
                        top: 1,
                        right: 10,
                      }}
                      onPress={() => RemoveCart(item.productId)}>
                      <TrashIcon color={'red'} size={24} />
                    </TouchableOpacity>
                  </TouchableOpacity>
                );
              }}
            />
          </View>

          {Total == 0 ? null : (
            <TouchableOpacity
              style={{
                position: 'absolute',
                bottom: 0,
                width: '100%',
                backgroundColor: Colours.PrimaryColor,
                paddingVertical: 15,
              }}
              onPress={() =>
                navigation.navigate('Address', {
                  Total,
                  priceArr,
                  productIdArr,
                  qtyArr,
                })
              }>
              <Text
                style={{
                  color: Colours.light,
                  fontFamily: Family.SemiBold,
                  textAlign: 'center',
                }}>
                Pay ₹ {Total}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </>
  );
};

export default Cart;

const styles = StyleSheet.create({});
