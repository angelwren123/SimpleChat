import { View, Text, Image, Pressable } from 'react-native'
import React from 'react'
import { Colors } from '../../assets/Colors'
import { images } from '../../assets/images'
const HeaderComponent = ({ nameRoute, isRightIcon = false, rightIcon, handleRightButton }) => {
    return (
        // _ConditionalRendering(nameRoute)
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
            <View style={{ alignSelf: 'center' }}>
                <Text style={{ color: Colors.black, fontSize: 35, fontFamily:'MontserratAlternates-SemiBold' }}>
                    {nameRoute}
                </Text>
            </View>
            {isRightIcon === true && handleRightButton ? (
                <Pressable 
                onPress={()=>handleRightButton()}
                style={{ alignSelf: 'center', backgroundColor: Colors.black, borderRadius: 50, padding: 10 }}>
                    <Image source={rightIcon} style={{ width: 20, height: 20, tintColor: Colors.white, }} />
                </Pressable>
            ) : (
                <></>
            )}
        </View>
    )
}

export default HeaderComponent