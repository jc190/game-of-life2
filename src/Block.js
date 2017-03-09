import React from 'react'

class Block extends React.Component {
  shouldComponentUpdate (nextProps, nextState) {
    return nextProps.isOn !== this.props.isOn
  }
  render () {
    return (
      <div
        style={{
          position: 'absolute',
          top: this.props.y,
          left: this.props.x,
          width: this.props.size,
          height: this.props.size,
          backgroundColor: this.props.isOn === true ? '#555' : '#ccc',
          border: '1px solid white'
        }}
        data-index={this.props.index}
      />
    )
  }
}

Block.propTypes = {
  x: React.PropTypes.number.isRequired,
  y: React.PropTypes.number.isRequired,
  size: React.PropTypes.number.isRequired,
  isOn: React.PropTypes.bool.isRequired,
  index: React.PropTypes.number.isRequired
}

export default Block
