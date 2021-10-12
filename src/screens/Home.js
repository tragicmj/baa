import React, {Fragment, Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Dimensions,
  ScrollView,
  View,
  TextInput,
  Text,
  StatusBar,
  ActivityIndicator,
  FlatList,
  Pressable
} from 'react-native';

import Colors from '../constants/colors'
import axios from 'axios';
// import Icon from 'react-native-remix-icon';
import Icon from 'react-native-vector-icons/Ionicons'
import FastImage from 'react-native-fast-image';

const { width, height } = Dimensions.get("window");
const api = '23817304-3cc0c75ec949a329bc5c1bba2';

class Home extends Component {
    constructor(props) {
      super(props);
      this.state = {
          isLoading: true,
          isSearchOn: false,
          searchTxt: '',
          imgArray: [],
          page:1,
          loadingMore: false
      };
    }

    getDetails = async () => {
        await this.setState({
            page: 1
        })
        try {
            const res = await axios.get(`https://pixabay.com/api/?key=${api}&per_page=20&order=popular&image_type=photo&lang=e&page=${this.state.page}`)
            await this.setState({
                isLoading: false,
                imgArray: res.data.hits,
                page: this.state.page + 1
            })
        } catch (error) {
            console.log(error)
        }
    }

    searchImage = async () => {
        await this.setState({
            page:1
        })
        try {
            const txt = this.state.searchTxt.toLowerCase()
            var txtToSearch = txt.replace(' ', '+');
            if(txtToSearch != ""){
                const res = await axios.get(`https://pixabay.com/api/?key=${api}&q=${txtToSearch}&image_type=photo&lang=en&per_page=20&page=${this.state.page}`)
                console.log(res.data.hits)
                await this.setState({
                    page: this.state.page + 1,
                    imgArray:res.data.hits
                })
            }
        } catch (error) {
            console.log(error)
        }
    }

    searchOn = async () => {
        await this.setState({
            searchTxt: '',
            isSearchOn: true
        })
    }

    loadMore = async () => {
        await this.setState({
            loadingMore: true
        })
        try {
            if(this.state.searchTxt == ''){
                const res = await axios.get(`https://pixabay.com/api/?key=${api}&per_page=20&order=popular&image_type=photo&lang=e&page=${this.state.page}`)
                console.log(res.data.hits)
                await this.setState({
                    page: this.state.page + 1,
                    imgArray: [
                        ...this.state.imgArray,
                        ...res.data.hits
                    ]
                })
            }
            else{
                const txt = this.state.searchTxt.toLowerCase()
                var txtToSearch = txt.replace(' ', '+');
                const res = await axios.get(`https://pixabay.com/api/?key=${api}&q=${txtToSearch}&image_type=photo&lang=en&per_page=20&page=${this.state.page}`)
                    await this.setState({
                    page: this.state.page + 1,
                    imgArray: [
                        ...this.state.imgArray,
                        ...res.data.hits
                    ]
                })
            }
            await this.setState({
                loadingMore: false
            })
        } catch (error) {
            console.log(error)
        }
        await this.setState({
            loadingMore: false
        })
    }

    resetSearch = async () => {
        await this.setState({
            isSearchOn: false
        })
        if(this.state.imgArray.length == 0){
            this.getDetails()
        }
    }

    async componentDidMount() {
        this.getDetails()
    }
    
    renderItem = ({item,index}) => {
        return(
            <Pressable style={
                    index%2 == 0 ? styles.itemWrap : [styles.itemWrap,{marginTop:35,marginBottom:0}]  
                }
                onPress={
                    () => {
                        this.props.navigation.push('Details', {
                            tag: item.tags,
                            uri: item.largeImageURL,
                            height: item.imageHeight,
                            view: item.views,
                            downloads: item.downloads,
                            likes: item.likes,
                            comments: item.comments,
                            user: item.user
                        });
                    }
                }
            >
                <FastImage 
                    source={{uri: item.largeImageURL}} 
                    style={styles.itemImg} 
                    resizeMode={FastImage.resizeMode.cover}
                />
            </Pressable>
        )
    }

    renderFooter = () => {
         if (!this.state.loadingMore) return null;
         return (
           <ActivityIndicator
            size="large" color={Colors.ternary}
           />
         );
       };

    render(){
        if (this.state.isLoading) {
            return (
              <ScrollView
                contentContainerStyle={{flex: 1, justifyContent: 'center', alignItems: 'center',backgroundColor: Colors.primary}}>
                <StatusBar backgroundColor={Colors.primary} barStyle="light-content" />
                <ActivityIndicator size="large" color={Colors.ternary} />
              </ScrollView>
            );
          }

        return(
            <Fragment>
                <View style={styles.headerWrap}>
                   {
                       this.state.isSearchOn ? (
                        <View style={styles.searchBarWrap}>
                            <View style={styles.searchBarIconWrap}>
                                <Pressable 
                                    style={({pressed}) => [
                                        styles.searchBarIcon,
                                        {backgroundColor: pressed ? '#ffffff50' : '#ffffff00'},
                                    ]} 
                                    onPress={async () => {await this.resetSearch()}}
                                >
                                    <Icon name="chevron-back-outline" style={styles.searchIcon} color={Colors.white} />
                                </Pressable>
                            </View>
                            <TextInput 
                                value={this.state.searchTxt}
                                style={styles.searchBar}
                                placeholder="Search..."
                                autoFocus={true}
                                onChangeText={async (txt)=> {await this.setState({searchTxt:txt})}}
                                onEndEditing={()=>{this.searchImage()}}
                                placeholderTextColor={Colors.white}
                            />
                            <View style={styles.searchBarIconWrap}>
                                <Pressable
                                    style={({pressed}) => [
                                        styles.searchBarIcon,
                                        {backgroundColor: pressed ? '#ffffff50' : '#ffffff00',marginTop: 6},
                                    ]} 
                                    onPress={()=>{this.searchImage()}}
                                >
                                    <Icon name="search-outline" style={styles.searchIcon} color={Colors.white} />
                                </Pressable>
                            </View>
                        </View>
                       ) : (
                        <Fragment>
                            <View>
                               <FastImage source={require("../images/greenLogo.png")} style={styles.logo} />
                            </View>
                            <Pressable onPress={async () => {await this.searchOn()}}>
                                <Icon name="search-outline" style={styles.searchIcon} color={Colors.white} />
                            </Pressable>
                        </Fragment>
                       )
                   }
                </View>
               {
                   this.state.imgArray.length == 0 ? (
                        <ScrollView contentContainerStyle={{flex: 1, justifyContent: 'center', alignItems: 'center',backgroundColor: Colors.primary}}>
                            <Icon name="images-outline" color={Colors.ternary} style={styles.imgIcon} size={40} />
                            <Text style={styles.txt}>No Image Found</Text>
                        </ScrollView>
                   ) : (
                    <FlatList 
                        data={this.state.imgArray}
                        contentContainerStyle={{ paddingVertical: 40 }}
                        style={styles.flatlistWrap}
                        numColumns={2}
                        ref={(ref) => {
                            this.flatListRef = ref;
                        }}
                        ListFooterComponent={this.renderFooter}
                        showsVerticalScrollIndicator={false}
                        onEndReached={this.loadMore}
                        renderItem={this.renderItem}
                        keyExtractor={(item) => item.id}
                    />
                   )
               }
            </Fragment>
        )
    }
}

const styles = StyleSheet.create({
    headerWrap: {
        height: 90,
        backgroundColor: Colors.primary,
        paddingHorizontal: 20,
        alignItems: 'center',
        justifyContent: 'space-between',
        display: 'flex',
        flexDirection: 'row',
    },
    headerTitle: {
        fontSize: 23,
        color: Colors.white,
        fontWeight: "600"
    },
    searchIcon: {
        color: Colors.white,
        fontSize: 26
    },
    searchBarWrap:{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%'
    },
    searchBar: {
        maxWidth: '75%',
        flexBasis: '75%',
        color: Colors.white,
        borderBottomWidth: 1,
        borderBottomColor: Colors.white,
        fontSize: 15
    },
    searchBarIconWrap: {
        maxWidth: '10%',
        flexBasis: '10%'
    },
    searchBarIcon:{
        width: 40,
        height: 40,
        borderRadius: 100,
        alignItems: 'center',
        justifyContent: 'center'
    },
    logo:{
        width: 153,
        height: 35
    },
    flatlistWrap: {
        // minHeight: height * 0.9,
        flexGrow:1,
        flex: 1,
        backgroundColor: Colors.primary,
        paddingHorizontal: '3%',
    },
    itemWrap: {
        backgroundColor: Colors.primary,
        overflow:'hidden',
        maxWidth: '45%',
        flexBasis: '45%',
        marginHorizontal: 10,
        alignItems: 'center',
        justifyContent: 'space-between',
        shadowColor: Colors.secondary,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.8,
        shadowRadius: 2,  
        elevation: 3,
        borderRadius: 12,
        borderWidth: 0,
        marginBottom: 35
    },
    itemImg:{
        width: '100%',
        height: 220
    },
    imgIcon: {
        marginBottom: 12
    },
    txt:{
        fontSize: 20,
        color: Colors.white
    }
 
})

export default Home;