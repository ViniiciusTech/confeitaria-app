import { View } from 'react-native';

export function ThemedView(props) {
  return <View {...props}>{props.children}</View>;
}
