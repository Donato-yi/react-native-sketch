import React from 'react';
import PropTypes from 'prop-types';
import { NativeModules, requireNativeComponent, View, ViewPropTypes } from 'react-native';

const SketchManager = NativeModules.RNSketchManager || {};

// Fallback when RN version is < 0.44
const viewPropTypes = ViewPropTypes || View.propTypes;

export default class Sketch extends React.Component {
  static propTypes = {
    fillColor: PropTypes.string,
    imageType: PropTypes.oneOf(['jpg', 'png']),
    onCreate: PropTypes.func,
    onChange: PropTypes.func,
    onClear: PropTypes.func,
    strokeColor: PropTypes.string,
    strokeThickness: PropTypes.number,
    style: viewPropTypes.style,
  };

  static defaultProps = {
    fillColor: null,
    imageType: 'png',
    onCreate: () => {},
    onChange: () => {},
    onClear: () => {},
    strokeColor: '#000000',
    strokeThickness: 1,
    style: null,
  };

  constructor(props) {
    super(props);

    // Sketch base style properties
    this.style = {
      flex: 1,
      backgroundColor: 'transparent',
    };
  }

  state = {
    imageData: null,
    key: '',
  };

  onCreate = (event) => {
    console.log('----------------------', event.nativeEvent)
    this.setState({ ...event.nativeEvent});
  }

  onChange = (event) => {
    const { imageData } = event.nativeEvent;

    this.setState({ imageData });
    this.props.onChange(imageData);
  };

  onClear = () => {
    this.setState({ imageData: null });
    this.props.onClear();
  };

  clear = () => {
    console.log('a-----------------------', this.state);
    SketchManager.clearDrawing(this.state.key);
  }

  save = () => {
    if (!this.state.imageData) return Promise.reject('No image provided!');

    return SketchManager.saveDrawing(this.state.imageData, this.props.imageType);
  };

  render() {
    const { fillColor, strokeColor, strokeThickness, ...props } = this.props;

    return (
      <RNSketch
        {...props}
        fillColor={fillColor}
        onCreate={this.onCreate}
        onChange={this.onChange}
        onClear={this.onClear}
        strokeColor={strokeColor}
        strokeThickness={strokeThickness}
        style={[this.style, this.props.style]}
      />
    );
  }
}

const RNSketch = requireNativeComponent('RNSketch', Sketch);
