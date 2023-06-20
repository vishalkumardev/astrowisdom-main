import {
  StyleSheet,
  Text,
  View,
  Modal,
  TextInput,
  Image,
  TouchableOpacity,
  ScrollView,
  FlatList,
  RefreshControl,
} from 'react-native';
import Colours from '../Assets/Colours';
import React, {useState, useEffect, useContext} from 'react';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import Search from 'react-native-vector-icons/dist/Ionicons';
import Filter from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import Grid from 'react-native-vector-icons/dist/Fontisto';
import Feather from 'react-native-vector-icons/dist/Feather';
import FontAwesome5 from 'react-native-vector-icons/dist/FontAwesome5';
import Verified from 'react-native-vector-icons/dist/Octicons';
import Entypo from 'react-native-vector-icons/dist/Entypo';
import Header from '../Assets/Header';
import GLOBAL from '../Utilities/Global';
import Family from '../Utilities/Family';
import firestore from '@react-native-firebase/firestore';
import {UserAuthContext} from '../context/UserAuthContext';
import {
  ChatBubbleOvalLeftEllipsisIcon,
  PhoneArrowUpRightIcon,
} from 'react-native-heroicons/outline';

const Call = ({navigation}) => {
  const [AstrologerData, setAstrologerData] = useState([]);
  const [Data, setData] = useState([]);
  const [Alldata, setAlldata] = useState([]);
  const [refreshing, setRefreshing] = React.useState(false);
  const [Filtermodal, setFiltermol] = useState(false);
  const [modal, setmodal] = useState(false);
  const [SelectedIndex, setSelectedIndex] = useState(0);
  const {User, getAstrolgerdata, Balance} = useContext(UserAuthContext);
  const [totalCost, settotalCost] = useState(0);
  const [Amount, setAmount] = useState(0);

  const getData = async () => {
    const response = await fetch(GLOBAL.BASE_URL + 'astrologerCallList');
    const data = await response.json();
    setData(data.past);
    setAlldata(data.past);
  };

  useEffect(() => {
    getData();
  }, []);

  const checkUserBalance = (astrologerId, rate) => {
    getAstrolgerdata().then(() => {
      const totalCost = rate * 5;
      settotalCost(totalCost);
      console.log(totalCost);
      if (Balance >= totalCost) {
        navigation.navigate('VoiceIntakeForm', {
          AstrologerId: astrologerId,
        });
      } else {
        setmodal(true);
      }
    });
  };

  const DataFilter = keyword => {
    const Result = Data.filter(value => {
      return value.category.includes(keyword);
    });
    setData(Result);
  };

  const LTH = () => {
    const Result = Data.sort((a, b) => a.rate - b.rate);
    setData(Result);
    setFiltermol(false);
  };
  const HTL = () => {
    const Result = Data.sort((a, b) => b.rate - a.rate);
    setData(Result);
    setFiltermol(false);
  };
  const Rating = () => {
    const Result = Data.sort((a, b) => b.rating - a.rating);
    setData(Result);
    setFiltermol(false);
  };
  const Experience = () => {
    const Result = Data.sort((a, b) => b.expirence - a.expirence);
    setData(Result);
    setFiltermol(false);
  };

  const sortingData = index => {
    setSelectedIndex(index);
    switch (index) {
      case 0:
        LTH();
        break;
      case 1:
        HTL();
        break;
      case 2:
        Rating();
        break;
      case 3:
        Experience();
        break;
      default:
        break;
    }
  };
  const [radioButtons, setRadioButtons] = useState([
    {
      id: '1',
      label: 'Low to High (Price)',
      value: 'LTH',
    },
    {
      id: '1',
      label: 'High to Low (Price)',
      value: 'HTL',
    },
    {
      id: '1',
      label: 'Sort By Rating ',
      value: 'Rating',
    },
    {
      id: '1',
      label: 'Sort By Experience ',
      value: 'Experience',
    },
  ]);

  const handleSearch = text => {
    if (text.length > 0) {
      let templist = Data.filter(item => {
        return item.profileName.toLowerCase().indexOf(text.toLowerCase()) > -1;
      });
      setData(templist);
    } else {
      setData(Alldata);
    }
  };

  const AstrologerList = ({item}) => {
    return (
      <TouchableOpacity
        style={{
          flex: 1,
          marginHorizontal: 5,
          backgroundColor: Colours.light,
          marginVertical: 8,
          paddingVertical: 5,
          flexDirection: 'row',
          alignItems: 'center',
          borderRadius: 10,
          paddingHorizontal: 10,
        }}
        onPress={() => {
          navigation.navigate('Profile', {
            AstrologerId: item.astrologerId,
          });
        }}>
        <Image
          source={{uri: item.photo}}
          style={{width: 60, height: 60, borderRadius: 30}}
          resizeMode="contain"
        />
        <View style={{marginHorizontal: 10, flex: 1}}>
          <Text
            style={{
              flex: 1,
              fontFamily: Family.Medium,
              color: Colours.PrimaryColor,
              fontSize: 13,
            }}>
            {item.profileName.charAt(0).toUpperCase() +
              item.profileName.slice(1)}
          </Text>
          <Text
            style={{
              fontSize: 12,
              color: Colours.TextGrayColour,
              fontFamily: Family.Medium,
            }}>
            {item.expertise.slice(0, 25)}
          </Text>
          <Text
            style={{
              fontSize: 12,
              color: Colours.TextGrayColour,
              fontFamily: Family.Medium,
              flex: 1,
            }}>
            Experience : {item.expirence}
          </Text>
          <Text
            style={{
              fontSize: 14,
              color: Colours.PrimaryColor,
              fontFamily: Family.Medium,
              flex: 1,
            }}>
            ₹{item.rate}/min
          </Text>

          <View style={{flexDirection: 'row'}}>
            <Icon
              name="star"
              size={12}
              color={item.rating >= 1 ? '#FFB300' : 'gray'}
            />
            <Icon
              name="star"
              size={12}
              color={item.rating >= 2 ? '#FFB300' : 'gray'}
            />
            <Icon
              name="star"
              size={12}
              color={item.rating >= 3 ? '#FFB300' : 'gray'}
            />
            <Icon
              name="star"
              size={12}
              color={item.rating >= 4 ? '#FFB300' : 'gray'}
            />
            <Icon
              name="star"
              size={12}
              color={item.rating >= 5 ? '#FFB300' : 'gray'}
            />
          </View>
        </View>

        <TouchableOpacity
          style={{
            marginHorizontal: 10,
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: Colours.PrimaryColor,
            paddingHorizontal: 15,
            paddingVertical: 5,
            borderRadius: 10,
            position: 'absolute',
            bottom: 10,
            right: 2,
          }}
          onPress={() => {
            checkUserBalance(item.rate, item.astrologerId);
          }}>
          <Text
            style={{
              fontFamily: Family.Medium,
              fontSize: 14,
              color: Colours.light,
              marginHorizontal: 10,
            }}>
            Call
          </Text>
          <PhoneArrowUpRightIcon color={Colours.light} size={16} />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };
  return (
    <View>
      <Header navigation={navigation} name={'Call'} />

      <ScrollView
        showsHorizontalScrollIndicator={false}
        style={{
          flexDirection: 'row',
          backgroundColor: 'white',
          padding: 5,
          paddingVertical: 10,
        }}
        horizontal={true}>
        <TouchableOpacity
          style={styles.headerFilters}
          onPress={() => {
            setData(Alldata);
            ChatFilter(null);
          }}>
          <Grid name="nav-icon-grid-a" size={14} color="gray" />
          <Text style={styles.headerFiltersText}>All</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => DataFilter('love')}
          style={styles.headerFilters}>
          <Grid name="heart" size={14} color="red" />
          <Text style={styles.headerFiltersText}>Love</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => DataFilter('Education')}
          style={styles.headerFilters}>
          <Filter name="book-education-outline" size={20} color="blue" />
          <Text style={styles.headerFiltersText}>Education</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => DataFilter('career')}
          style={styles.headerFilters}>
          <Filter name="medical-bag" size={20} color="blue" />
          <Text style={styles.headerFiltersText}>Career</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.headerFilters}
          onPress={() => DataFilter('Marriage')}>
          <Icon name="mars-double" size={20} color="purple" />
          <Text style={styles.headerFiltersText}>Marriage</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.headerFilters}
          onPress={() => DataFilter('Health')}>
          <FontAwesome5 name="clinic-medical" size={20} color="pink" />
          <Text style={styles.headerFiltersText}>Health</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.headerFilters}
          onPress={() => DataFilter('Wealth')}>
          <Entypo name="wallet" size={20} color="blue" />
          <Text style={styles.headerFiltersText}>Wealth</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.headerFilters}
          onPress={() => DataFilter('Business')}>
          <FontAwesome5 name="business-time" size={20} color="blue" />
          <Text style={styles.headerFiltersText}>Business</Text>
        </TouchableOpacity>
      </ScrollView>

      <View
        style={{
          width: '95%',
          alignSelf: 'center',
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginVertical: 5,
          alignItems: 'center',
        }}>
        <View
          style={{
            backgroundColor: Colours.light,
            flexDirection: 'row',
            width: '90%',
            alignItems: 'center',
            paddingHorizontal: 15,
            borderRadius: 50,
          }}>
          <Search name="search-outline" size={30} color="#d1cdcd" />
          <TextInput
            style={{
              color: Colours.TextGrayColour,
              fontFamily: Family.Medium,
              paddingHorizontal: 5,
              flex: 1,
            }}
            placeholder="Search Astrologer"
            placeholderTextColor="#777"
            onChangeText={text => handleSearch(text)}
          />
        </View>
        <TouchableOpacity
          onPress={() => setFiltermol(true)}
          style={{marginLeft: 10, marginRight: 10}}>
          <Filter name="filter-plus-outline" size={25} color="black" />
        </TouchableOpacity>
      </View>

      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => getData()} />
        }
        style={{marginBottom: 55}}>
        <FlatList data={Data} renderItem={AstrologerList} />
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={Filtermodal}
        onRequestClose={() => {
          setmodal(!Filtermodal);
        }}
        style={{flexDirection: 'column', justifyContent: 'flex-end'}}>
        <View
          style={{
            marginTop: 'auto',
            backgroundColor: '#fff',
            paddingHorizontal: 20,
            paddingVertical: 20,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
          }}>
          <TouchableOpacity
            onPress={() => {
              setFiltermol(false);
            }}
            style={{marginLeft: 'auto', marginTop: -10}}>
            <Feather name="x-circle" size={20} color={'gray'} />
          </TouchableOpacity>
          {radioButtons.map((item, index) => (
            <View
              style={{
                flexDirection: 'row',
                margin: 10,
                justifyContent: 'space-between',
              }}>
              <Text style={{marginLeft: 10, color: Colours.black}}>
                {item.label}
              </Text>
              <TouchableOpacity
                style={{
                  height: 24,
                  width: 24,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: '#000',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                onPress={() => {
                  sortingData(index);
                }}>
                {SelectedIndex == index ? (
                  <View
                    style={{
                      height: 16,
                      width: 16,
                      borderRadius: 8,
                      backgroundColor: 'black',
                    }}></View>
                ) : null}
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        // visible={true}
        visible={modal}
        onRequestClose={() => {
          setmodal(!modal);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TouchableOpacity
              onPress={() => {
                setmodal(false);
              }}
              style={{marginLeft: 'auto', marginTop: -10}}>
              <Feather name="x-circle" size={20} color={'gray'} />
            </TouchableOpacity>
            <Text
              style={{
                fontFamily: Family.Medium,
                fontSize: 12,
                color: Colours.primary,
                marginVertical: 10,
              }}>
              Minimum Requires Balance to chat with astrologer is Rs.
              {totalCost}
            </Text>

            <Text
              style={{
                fontSize: 14,
                fontFamily: Family.Medium,
                color: Colours.gray,
              }}>
              Recharge your Wallet
            </Text>
            <TextInput
              placeholder="Enter Amount"
              placeholderTextColor={Colours.GrayColor}
              maxLength={10}
              value={Amount}
              onChangeText={setAmount}
              style={{
                paddingVertical: 10,
                paddingHorizontal: 15,
                borderWidth: 1,
                borderColor: Colours.GrayColor,
                borderRadius: 10,
                marginVertical: 15,
                color: Colours.TextGrayColour,
              }}
              keyboardType="number-pad"
            />
            <TouchableOpacity
              style={{
                backgroundColor: Colours.primary,
                paddingVertical: 8,
                width: '30%',
                borderRadius: 5,
                marginTop: 5,
              }}
              onPress={() =>
                navigation.navigate('Add money to wallet', {
                  Amount,
                })
              }>
              <Text
                style={{
                  fontSize: 12,
                  fontFamily: Family.Medium,
                  color: Colours.light,
                  textAlign: 'center',
                }}>
                Add Money
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Call;

const styles = StyleSheet.create({
  header: {
    height: 50,
    backgroundColor: Colours.PrimaryColor,
    alignItems: 'center',
    flexDirection: 'row',
  },
  headerText: {
    fontSize: 15,
    color: 'white',
    marginLeft: 10,
  },
  headerIcons: {
    marginRight: 12,
  },
  headerWallet: {
    marginLeft: 'auto',
    backgroundColor: 'white',
    width: 35,
    alignItems: 'center',
    borderRadius: 10,
    marginRight: 13,
  },
  searchBar: {
    flexDirection: 'row',
    height: 40,
    borderRadius: 20,
    backgroundColor: Colours.GrayColor,
    borderRadius: 30,
    height: 40,
    width: '90%',
    alignSelf: 'center',
    alignItems: 'center',
    paddingLeft: 10,
    marginVertical: 5,
  },
  searchInput: {
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderColor: Colours.GrayColor,
    width: 230,
    color: Colours.TextDarkColour,
  },
  searchBar: {
    flexDirection: 'row',
    height: 40,
    borderRadius: 20,
    backgroundColor: 'white',
    borderRadius: 30,
    height: 40,
    width: '90%',
    alignSelf: 'center',
    alignItems: 'center',
    paddingLeft: 10,
    marginVertical: 5,
    borderColor: Colours.GrayColor,
    borderWidth: 1,
  },

  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 5,
  },
  headerFilters: {
    borderRadius: 100,
    backgroundColor: Colours.Background,
    width: 60,
    height: 60,
    alignItems: 'center',
    marginHorizontal: 4,
    justifyContent: 'center',
  },
  headerFiltersText: {
    fontSize: 10,
    color: Colours.TextGrayColour,
    fontFamily: Family.Light,
    marginTop: 3,
  },
  searchBar: {
    flexDirection: 'row',
    height: 40,
    borderRadius: 20,
    backgroundColor: 'white',
    borderRadius: 30,
    height: 40,
    width: '90%',
    alignSelf: 'center',
    alignItems: 'center',
    paddingLeft: 10,
    marginVertical: 5,
    borderColor: Colours.GrayColor,
    borderWidth: 1,
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 5,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalView: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },
});
