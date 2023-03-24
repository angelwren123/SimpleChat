import React from 'react';

import { View, Pressable, Dimensions, StyleSheet, Image, KeyboardAvoidingView } from 'react-native'
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { images } from '../assets/images';
import Animated, { FadeInUp, FadeOutDown, Layout } from 'react-native-reanimated';
const { width } = Dimensions.get('screen')

const CusTomBottomTabBar = ({ state, descriptors, navigation }) => {

    return (
        <>
            <View style={styles.mainContainer}>
            {state.routes.map((route, index) => {
                const { options } = descriptors[route.key];
                const label =
                    options.tabBarLabel !== undefined
                        ? options.tabBarLabel
                        : options.title !== undefined
                            ? options.title
                            : route.name;

                const isFocused = state.index === index;

                const onPress = () => {
                    const event = navigation.emit({
                        type: 'tabPress',
                        target: route.key,
                        canPreventDefault: true,
                      });

                      if (!isFocused && !event.defaultPrevented) {
                        // The `merge: true` option makes sure that the params inside the tab screen are preserved
                        navigation.navigate({ name: route.name, merge: true });
                      }
                };

                return (
                    <Animated.View
                        key={index}
                        style={[styles.mainItemContainer, { borderRightWidth: label == "notes" ? 3 : 0 }]}
                        entering={FadeInUp}
                        exiting={FadeOutDown}
                        layout={Layout.duration(1000)}
                    >
                        <Pressable
                            onPress={onPress}
                            style={{ backgroundColor: isFocused ? Colors.white : Colors.black, borderRadius: 25, }}>
                            <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1, padding: 10 }}>
                                {/* <NavigationIcon route={label} isFocused={isFocused} /> */}
                                <Image source={options?.tabBarIcon} route={label} isFocused={isFocused} style={{ tintColor: isFocused ? Colors.black : Colors.white, width: 30, height: 30 }} />
                            </View>
                        </Pressable>
                    </Animated.View>
                    
                );
            })}
        </View>
        </>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        flexDirection: 'row',
        height:70,
        backgroundColor: "#182028",
        // borderRadius: 50,
        // marginHorizontal: 10,
        // marginBottom:5

    },
    mainItemContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 10,
        borderRadius: 1,
        borderColor: "#333B42"
    },
})


export default CusTomBottomTabBar; 