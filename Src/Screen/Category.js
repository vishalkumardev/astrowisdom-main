import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  ToastAndroid,
  Image,
} from 'react-native';
import React, {useState, useEffect, useContext} from 'react';
import Colours from '../Assets/Colours';
import ShopHeader from '../Assets/ShopHeader';
import Global from '../Utilities/Global';
import {ShoppingCartIcon} from 'react-native-heroicons/outline';
import Family from '../Utilities/Family';
import {UserAuthContext} from '../context/UserAuthContext';
import Loader from '../Utilities/LoadingModal';

const Category = ({navigation, route}) => {
  const {User} = useContext(UserAuthContext);
  const {title, categoryId} = route.params;
  const [Products, setProducts] = useState([]);
  const [Loading, setLoading] = useState(false);
  const getData = async () => {
    setLoading(true);
    const response = await fetch(
      Global.BASE_URL + `shopByCategory&categoryId=${categoryId}`,
    );
    const data = await response.json();
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
    getData();
  }, []);

  return (
    <>
      {Loading ? (
        <Loader isLoading={Loading} />
      ) : (
        <View style={{flex: 1}}>
          <ShopHeader name={`${title}`} navigation={navigation} />

          <View>
            <FlatList
              data={Products}
              ListEmptyComponent={
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: 200,
                  }}>
                  <Text
                    style={{
                      color: Colours.PrimaryColor,
                      fontFamily: Family.SemiBold,
                      margin: 0,
                    }}>
                    No Product Found
                  </Text>
                </View>
              }
              renderItem={({item, index}) => {
                return (
                  <View
                    style={{
                      marginHorizontal: 10,
                      marginVertical: index == 0 ? 10 : 20,
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

export default Category;

const styles = StyleSheet.create({});
