import React from 'react';
import { View, Platform, StatusBar } from 'react-native';
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import AddEntry from './components/AddEntry'
import reducer from './reducers'
import History from './components/History'
import { createBottomTabNavigator } from 'react-navigation'
import { purple, white } from './utils/colors'
import { FontAwesome, Ionicons } from '@expo/vector-icons'
import { Constants } from 'expo'

function UdaciStatusBar ({backgroundColor, ...props}) {
  return (
    <View style={{backgroundColor, height: Constants.statusBarHeight}}>
      <StatusBar translucent backgroundColor={backgroundColor} {...props} />
    </View>
  )
}

const Tabs = createBottomTabNavigator({
  History: {
    screen: History,
    navigationOptions: {
      tabBarLabel: "History",
      tabBarIcon: ({tintColor}) =>
        <Ionicons
          name='ios-bookmarks'
          size={30}
          color={tintColor} />
      },
  },
  AddEntry: {
    screen: AddEntry,
    navigationOptions: {
      tabBarLabel: 'Add Entry',
      tabBarIcon: ({tintColor}) =>
        <FontAwesome
          name='plus-square'
          size={30}
          color={tintColor} />
    }
  }
})

export default class App extends React.Component {
  render() {
    return (
      <Provider store={createStore(reducer)}>
        <View style={{flex: 1}}>
          <UdaciStatusBar backgroundColor={purple} barStyle="light-content"/>
          <History/>
        </View>
      </Provider>
    )
  }
}
