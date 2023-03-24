import AsyncStorage from "@react-native-async-storage/async-storage"
import {Appearance} from 'react-native';
const colorScheme = Appearance.getColorScheme();
  if (colorScheme === 'dark') {
    // Use dark color scheme
  }

export const Colors = {
    white: colorScheme === 'light' ? '#fff' : '#000',
    // white:'#000',

    gray: '#d1d1d1',
    greyish: '#000',
    greyish: '#e6e6e6',
    // black:'#fff',
    // blackish:'#f1f1f1'
    black: colorScheme === 'light' ? '#030D16' : '#fff',
    // blackish:"#182028"
}




