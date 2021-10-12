import React, {Fragment, Component} from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Image,
  Text,
  Linking,
  Platform,
  Alert,
  Pressable,
} from 'react-native';
import Colors from '../constants/colors'
// import Snackbar from 'react-native-snackbar';
// import Icon from 'react-native-remix-icon';
import Icon from 'react-native-vector-icons/Ionicons'
import FastImage from 'react-native-fast-image';

class Details extends Component {
    constructor(props) {
      super(props);
      this.state = {
        };
    }


    async componentDidMount() {

    }

    render(){
        const {
          tag,
          view,
          uri,
          height,
          downloads,
          likes,
          comments,
          user
        } = this.props.route.params
        return(
            <ScrollView
                style={{flexGrow:1,backgroundColor: Colors.primary}}
                showsVerticalScrollIndicator={false}
            >
               <View style={styles.imgWrap}>
                    <Pressable 
                        style={({pressed}) => [
                            styles.backIconWrap,
                            {backgroundColor: pressed ? '#00000060' : '#00000030'},
                        ]} 
                        onPress={async () => {this.props.navigation.goBack()}}
                    >
                        <Icon name="chevron-back-outline" style={styles.backIcon} color={Colors.white} />
                    </Pressable>
                    <FastImage 
                        source={{uri: uri}}
                        style={[styles.itemImg,{height:height*0.13}]}
                        resizeMode={FastImage.resizeMode.cover}
                    />
               </View>
               <View style={styles.btmBar}>
                        <View style={styles.btmItemWrap}>
                            <Icon name="eye" color={Colors.white} style={styles.btmIcon} />
                            <Text style={styles.txt}>{view}</Text>
                        </View>
                        <View style={styles.btmItemWrap}>
                            <Icon name="download" color={Colors.white} style={styles.btmIcon} />
                            <Text style={styles.txt}>{downloads}</Text>
                        </View>
                        <View style={styles.btmItemWrap}>
                            <Icon name="heart" color={Colors.white} style={styles.btmIcon} />
                            <Text style={styles.txt}>{likes}</Text>
                        </View>
                        <View style={styles.btmItemWrap}>
                            <Icon name="chatbox" color={Colors.white} style={styles.btmIcon} />
                            <Text style={styles.txt}>{comments}</Text>
                        </View>
               </View>
               <View style={[styles.tagWrap,{flexWrap:'wrap'}]}>
                    <View style={{maxWidth:'25%',flexBasis: '25%'}}>
                        <Text style={[styles.txt,{color: Colors.ternary,fontSize: 18,marginRight:16}]}>
                            Tags:
                        </Text>
                    </View>
                    <View style={{maxWidth:'75%',flexBasis: '75%'}}>
                        <Text style={styles.text}>
                        {tag}
                        </Text>
                    </View>
               </View>
               <View style={[styles.tagWrap,{paddingTop:0}]}>
                    <Text style={[styles.txt,{color: Colors.ternary,fontSize: 18,marginRight:16}]}>
                    Captured By:
                    </Text>
                    <Text style={styles.text}>
                     {user}
                    </Text>
               </View>
        </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    imgWrap: {
        position:'relative',
    },
   itemImg:{
       width: '100%',
       borderBottomLeftRadius: 25,
       borderBottomRightRadius: 25
   },
   backIconWrap: {
       position: 'absolute',
       width: 40,
       height: 40,
       zIndex:2,
       top: "4%",
       left: '4%',
       borderRadius: 100,
       alignItems: 'center',
       justifyContent: 'center'
   },
   backIcon:{
    fontSize: 24
   },
   btmBar:{
       flexDirection: 'row',
       flexWrap: 'wrap',
       alignItems: 'center',
       justifyContent: 'center',
       paddingHorizontal: '5%',
       paddingVertical: 20
   },
   btmItemWrap: {
       maxWidth: '25%',
       flexBasis: '25%',
       flexDirection: 'row',
       justifyContent: 'center',
       alignItems:'center'
   },
   btmIcon: {
       fontSize: 18
   },
   txt:{
       color: Colors.white,
       fontSize: 16,
       paddingLeft: 8
   },
   tagWrap:{
    paddingHorizontal: '5%',
    flexDirection: 'row',
    paddingVertical: 18,
    alignItems: 'center'
   },
   text:{
       fontSize: 14,
       color: Colors.white,
       letterSpacing: 1,
       textTransform: 'capitalize'
   }
})

export default Details;