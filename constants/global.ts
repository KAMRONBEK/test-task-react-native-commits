import { LayoutAnimation } from 'react-native';

export const makeLayoutAnimation = () => {
  LayoutAnimation.easeInEaseOut();
};

// If DEBUG is true, We can see all logs and errors in the console.
// DEBUG must be false before a new release!!!
export const DEBUG = false;
