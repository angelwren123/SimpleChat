import { View, Text, Dimensions, Image } from 'react-native'
import React from 'react'
import { images } from '../../assets/images';
import { Colors } from '../../assets/Colors';
const { width, height } = Dimensions.get('screen');
const HeaderProfileComponent = (props) => {
    const { user } = props
    return (
        <View style={{ marginVertical: 10, }}>
            <View style={{ flexDirection: 'row', }}>
                <View style={{ width: width / 2 - 10, height: width / 3, backgroundColor: Colors.black, borderTopRightRadius: 100, borderBottomRightRadius: 100, justifyContent: 'center', alignItems: 'flex-end' }}>
                    <View style={{ width: width / 3 - 8, height: width / 3 - 8, borderRadius: 100, marginRight: 5, backgroundColor: Colors.white, padding: 2 }}>
                        <Image
                            source={{ uri: user?.photoURL }}
                            style={{ width: width / 3 - 12, height: width / 3 - 12, borderRadius: 100, marginRight: 5, backgroundColor: Colors.white, }} />
                    </View>
                </View>
                <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1, marginRight: 20 }}>
                    <View>
                        <Text style={{ fontSize: 25, color: Colors.black, fontFamily:'MontserratAlternates-Regular' }} numberOfLines={1}>
                            {user?.displayName}
                        </Text>
                    </View>
                    <View style={{maxWidth: width/3,  flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                        <View style={{ marginRight: 2 }}>
                            <Image source={images.icons.ic_mail} style={{ width: 20, height: 20, tintColor: Colors.black }} />
                        </View>
                        <View style={{}}>
                            <Text numberOfLines={1} style={{color:Colors.black,fontFamily:'MontserratAlternates-Regular'}}>
                                {user?.email}
                            </Text>
                        </View>
                    </View>
                </View>
            </View>
        </View>
    )
}

export default React.memo(HeaderProfileComponent)