import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { HomeStackParamList } from './HomeStackParamList'
import { HomeScreen } from '../screens/HomeScreen'
const Stack = createNativeStackNavigator<HomeStackParamList>()

export default function HomeStack() {
    return(
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Home" component={HomeScreen} />
        </Stack.Navigator>
    )
}