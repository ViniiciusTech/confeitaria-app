import { Text } from 'react-native';

export function ThemedText(props) {
  return <Text {...props}>{props.children}</Text>;
}
