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
import Loader from '../Utilities/LoadingModal';
import {ShoppingCartIcon} from 'react-native-heroicons/outline';

const Shop = ({navigation}) => {
  const [Data, setData] = useState([]);
  const [Category, setCategory] = useState([]);
  const [Products, setProducts] = useState([]);
  const [Loading, setLoading] = useState(false);

  const {User} = useContext(UserAuthContext);
  const getItems = async () => {
    setLoading(true);
    const response = await fetch(Global.BASE_URL + `shoppingHome`);
    const data = await response.json();
    setCategory(data.category);
    setProducts(data.product);
    setLoading(false);
  };

  const addtoCart = async (id, price) => {
    const response = await fetch(
      Global.BASE_URL +
        `addtocart&productId=${id}&userId=${User}&qty=1&price=${price}`,
    );
    const data = await response.json();
    if (data.response.status == 1) {
      ToastAndroid.show('Product has been added to Cart', ToastAndroid.SHORT);
      navigation.navigate('Cart');
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
          <ShopHeader name={'AstroWisdom Shop'} navigation={navigation} />

          <View style={{paddingHorizontal: 10}}>
            <FlatList
              data={Category}
              horizontal
              showsHorizontalScrollIndicator={false}
              renderItem={({item}) => {
                return (
                  <TouchableOpacity
                    style={{
                      paddingHorizontal: 5,
                      marginVertical: 10,
                      borderRadius: 10,
                    }}
                    onPress={() =>
                      navigation.navigate('Category', {
                        title: item.categoryName,
                        categoryId: item.categoryId,
                      })
                    }>
                    <Image
                      source={{
                        uri: item.icon,
                      }}
                      style={{
                        width: 60,
                        height: 60,
                        resizeMode: 'contain',
                        borderRadius: 5,
                        alignSelf: 'center',
                      }}
                    />

                    <Text
                      style={{
                        color: Colours.TextGrayColour,
                        fontFamily: Family.Medium,
                        textAlign: 'center',
                        marginVertical: 10,
                        fontSize: 12,
                      }}>
                      {item.categoryName}
                    </Text>
                  </TouchableOpacity>
                );
              }}
            />
          </View>

          <View>
            <FlatList
              data={Products}
              renderItem={({item, index}) => {
                return (
                  <View
                    style={{
                      marginHorizontal: 10,
                      marginVertical: index == 0 ? 0 : 20,
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
                          margin: 0,
                        }}>
                        {item.product_name}
                      </Text>
                      <View
                        style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Text
                          style={{
                            color: Colours.TextGrayColour,
                            fontFamily: Family.Medium,
                            textDecorationLine: 'line-through',
                          }}>
                          ₹ {item.mrp}
                        </Text>
                        <Text
                          style={{
                            color: Colours.PrimaryColor,
                            fontFamily: Family.SemiBold,
                            marginLeft: 15,
                            fontSize: 13,
                          }}>
                          ₹ {item.offer_price}
                        </Text>
                      </View>
                      <Text
                        style={{
                          color: Colours.PrimaryColor,
                          fontFamily: Family.Regular,
                          fontSize: 10,
                          textAlign: 'justify',
                        }}>
                        {item.content.slice(0, 100)}
                      </Text>
                    </View>
                    <TouchableOpacity
                      style={{
                        paddingHorizontal: 10,
                        paddingVertical: 5,
                        backgroundColor: Colours.PrimaryColor,
                        marginVertical: 10,
                        borderRadius: 5,
                        position: 'absolute',
                        bottom: -22,
                        right: 10,
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}
                      onPress={() =>
                        addtoCart(item.productId, item.offer_price)
                      }>
                      <ShoppingCartIcon color={Colours.light} size={20} />
                      <Text
                        style={{
                          textAlign: 'center',
                          color: Colours.light,
                          fontFamily: Family.Regular,
                          fontSize: 12,
                          marginHorizontal: 5,
                        }}>
                        Buy Now
                      </Text>
                    </TouchableOpacity>
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

export default Shop;

const styles = StyleSheet.create({});
