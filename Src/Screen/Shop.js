import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import Family from '../Utilities/Family';
import Colours from '../Assets/Colours';
import ShopHeader from '../Assets/ShopHeader';

const Shop = ({navigation}) => {
  return (
    <View style={{flex: 1}}>
      <ShopHeader name={'Shop'} navigation={navigation} />
    </View>
  );
};

export default Shop;

const styles = StyleSheet.create({});
