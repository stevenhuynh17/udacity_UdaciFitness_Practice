import React, { Component } from 'react'
import { View, TouchableOpacity, Text, StyleSheet, Platform } from 'react-native'
import { getMetricMetaInfo, timeToString, getDailyReminderValue } from '../utils/helpers'
import { submitEntry, removeEntry } from '../utils/api'
import { Ionicons } from '@expo/vector-icons'
import { connect } from 'react-redux'
import { addEntry } from '../actions'

import UdaciSteppers from './UdaciSteppers'
import UdaciSlider from './UdaciSlider'
import DateHeader from './DateHeader'
import TextButton from './TextButton'

function SubmitBtn({ onPress }) {
  return (
    <TouchableOpacity
      onPress={onPress}>
        <Text>Submit</Text>
    </TouchableOpacity>
  )
}

class AddEntry extends Component {
  state = {
    run: 0,
    bike: 0,
    swim: 0,
    sleep: 0,
    eat: 0
  }

  increment = (metric) => {
    const { max, step } = getMetricMetaInfo(metric)

    this.setState((state) => {
      const count = state[metric] + step

      return {
        ...state,
        [metric]: count > max ? max : count
      }
    })
  }

  decrement = (metric) => {
    const { step } = getMetricMetaInfo(metric)
    this.setState((state) => {
      const count = state[metric] - step

      return {
        ...state,
        [metric]: count < 0 ? 0 : count
      }
    })
  }

  slide = (metric, value) => {
    this.setState(() => {
      return {
        [metric]: value
      }
    })
  }

  submit = () => {
    const key = timeToString()
    const entry = this.state

    this.props.dispatch(addEntry({
      [key]: entry
    }))

    // Update Redux
    this.setState(() => {
      return {
        run: 0,
        bike: 0,
        swim: 0,
        sleep: 0,
        eat: 0
      }
    })
  }

  reset = () => {
    const key = timeToString()

    this.props.dispatch(addEntry({
      [key]:getDailyReminderValue()
    }))
  }

  render() {
    const metaInfo = getMetricMetaInfo()

    if (this.props.alreadyLogged) {
      return (
        <View>
          <Ionicons
            name={'ios-happy-outline'}
            size={100}
          />
          <Text>You already logged your infomration for today.</Text>
          <TextButton onPress={this.reset}>
            Reset
          </TextButton>
        </View>
      )
    }

    return (
      <View>
        <DateHeader date={(new Date()).toLocaleDateString()}/>
        {Object.keys(metaInfo).map((key) => {
          const { getIcon, type, displayName, ...rest } = metaInfo[key]
          const value = this.state[key]
          return (
            <View key={key}>
              {getIcon()}
              {type === 'slider'
                ? <UdaciSlider
                    value={value}
                    onChange={(value) => this.slide(key, value)}
                    {...rest}
                  />
                : <UdaciSteppers
                    value={value}
                    onIncrement={() => this.increment(key)}
                    onDecrement={() => this.decrement(key)}
                    {...rest}
                  />
              }
            </View>
          )
        })}
        <SubmitBtn onPress={this.submit}/>
      </View>
    )
  }
}

function mapStateToProps (state) {
  const key = timeToString()

  return {
    alreadyLogged: state[key] && typeof state[key].today === 'undefined'
  }
}

export default connect(mapStateToProps)(AddEntry)
