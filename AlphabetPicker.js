import React, { Component } from 'react';
import { View, Text, PanResponder, Vibration } from 'react-native';
import PropTypes from 'prop-types';

class LetterPicker extends Component {

    render() {
        return (
          <TouchableOpacity onPress={() => this.props.setLatter(this.props.letter)}>
            <Text style={{ fontSize: 11, fontWeight: 'bold', color: '#7F48FB' }}>
                {this.props.letter}
            </Text>
          </TouchableOpacity>
        );
    }
}

const Alphabet = "#ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('');
export default class AlphabetPicker extends Component {
    constructor(props, context) {
        super(props, context);
        if(props.alphabet){
            Alphabet = props.alphabet;
        }
    }

    componentWillMount() {
        this._panResponder = PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => true,
            onPanResponderGrant: (e, gestureState) => {
                /*this.props.onTouchStart && this.props.onTouchStart();

                this.tapTimeout = setTimeout(() => {
                    this._onTouchLetter(this._findTouchedLetter(gestureState.y0));
                }, 100);*/
            },
            onPanResponderMove: (evt, gestureState) => {
                clearTimeout(this.tapTimeout);
                this._onTouchLetter(this._findTouchedLetter(gestureState.moveY));
            },
            onPanResponderTerminate: this._onPanResponderEnd.bind(this),
            onPanResponderRelease: this._onPanResponderEnd.bind(this),
        });
    }

    _onTouchLetter(letter) {
        ReactNativeHapticFeedback.trigger('impactLight', true);
        setTimeout(() => {
          Vibration.cancel();
        }, 250);
        letter && this.props.onTouchLetter && this.props.onTouchLetter(letter);
    }

    _onPanResponderEnd() {
        requestAnimationFrame(() => {
            this.props.onTouchEnd && this.props.onTouchEnd();
        });
    }

    _findTouchedLetter(y) {
        let top = y - (this.absContainerTop || 0);

        if (top >= 1 && top <= this.containerHeight) {
            return Alphabet[Math.floor((top / this.containerHeight) * Alphabet.length)]
        }
    }

    _onLayout(event) {
        this.refs.alphabetContainer.measure((x1, y1, width, height, px, py) => {
            this.absContainerTop = py;
            this.containerHeight = height;
        });
    }

    setLatter = (latter) => {
        this._onTouchLetter(latter);
    }

    render() {
        this._letters = this._letters || (
            Alphabet.map((letter) =>
              <LetterPicker
                letter={letter}
                key={letter}
                setLatter={this.setLatter}
              />)
        );

        return (
            <View
                ref='alphabetContainer'
                {...this._panResponder.panHandlers}
                onLayout={this._onLayout.bind(this)}
                style={{ paddingHorizontal: 5, backgroundColor: 'transprate', borderRadius: 1, justifyContent: 'center' }}>
                <View>
                    {this._letters}
                </View>
            </View>
        );
    }
}
