import React, { Component } from 'react';
// import clone from 'lodash/clone';
import Block from './Block';
import './App.css';

class App extends Component {
  constructor (props) {
    super(props)
    this.state = {
      board: {
        w: 70,
        h: 50
      },
      blockSize: 15,
      blocks: [],
      gameIsOn: false,
      intervalId: null,
      generations: 0
    }
    this.populateBlocks = this.populateBlocks.bind(this)
    this.handleClick = this.handleClick.bind(this)
    this.getNeighbors = this.getNeighbors.bind(this)
    this.checkNeighbors = this.checkNeighbors.bind(this)
    this.checkX = this.checkX.bind(this)
    this.checkY = this.checkY.bind(this)
    this.handleTurn = this.handleTurn.bind(this)
    this.play = this.play.bind(this)
    this.stop = this.stop.bind(this)
    this.reset = this.reset.bind(this)
  }
  componentWillMount () {
    this.populateBlocks()
  }
  componentDidMount () {
    this.play()
  }
  populateBlocks () {
    const blocks = []
    const board = this.state.board
    const size = this.state.blockSize
    for (let i = 0; i < board.h; i++) {
      for (let j = 0; j < board.w; j++) {
        blocks.push({
          x: j,
          y: i,
          posX: j * size,
          posY: i * size,
          isOn: Math.random() >= 0.5,
          neighbors: null
        })
      }
    }
    blocks.map((b) => {
      b.neighbors = this.getNeighbors(b, blocks)
      return b
    })
    this.setState({
      blocks: blocks
    })
  }
  handleClick (e) {
    if (!e.target.dataset.index) return
    const blocks = this.state.blocks
    blocks[e.target.dataset.index].isOn = !blocks[e.target.dataset.index].isOn
    this.setState({
      blocks: blocks
    })
  }
  checkNeighbors (block) {
    const neighbors = block.neighbors.map((n) => {
      return this.state.blocks[n]
    })
    const neighborsAlive = neighbors.filter((n) => {
      return n.isOn === true
    })
    if (block.isOn === true) {
      if (neighborsAlive.length < 2) return true
      // if (neighborsAlive.length === 2 || neighborsAlive.length === 3) return true
      if (neighborsAlive.length > 3) return true
      return false
    } else {
      if (neighborsAlive.length === 3) return true
      return false
    }
  }
  getNeighbors (block, blocks) {
    // console.log(block.x)
    const neighborCoords = []
    const tl = { x: this.checkX(block.x - 1), y: this.checkY(block.y - 1) }
    const t = { x: this.checkX(block.x), y: this.checkY(block.y - 1) }
    const tr = { x: this.checkX(block.x + 1), y: this.checkY(block.y - 1) }
    const l = { x: this.checkX(block.x - 1), y: this.checkY(block.y) }
    const r = { x: this.checkX(block.x + 1), y: this.checkY(block.y) }
    const bl = { x: this.checkX(block.x - 1), y: this.checkY(block.y + 1) }
    const b = { x: this.checkX(block.x), y: this.checkY(block.y + 1) }
    const br = { x: this.checkX(block.x + 1), y: this.checkY(block.y + 1) }
    neighborCoords.push(tl, t, tr, l, r, bl, b, br)
    const neighbors = neighborCoords.map((neighbor) => {
      // console.log(neighbor.x)
      const filtered = blocks.reduce((acc, b, index) => {
        if (neighbor.x === b.x && neighbor.y === b.y) {
          return index + acc
        } else {
          return acc
        }
      }, 0)
      return filtered
    })
    return neighbors
  }
  checkX (x) {
    if (x > this.state.board.w - 1) {
      x -= this.state.board.w
    }
    if (x < 0) {
      x += this.state.board.w
    }
    return x
  }
  checkY (y) {
    if (y > this.state.board.h - 1) {
      y -= this.state.board.h
    }
    if (y < 0) {
      y += this.state.board.h
    }
    return y
  }
  handleTurn () {
    let generations = this.state.generations
    let changed
    const blocks = this.state.blocks
    const changedBlocks = blocks.reduce((acc, b, index) => {
      changed = this.checkNeighbors(b)
      if (changed === true) {
        acc.push(index)
      }
      return acc
    }, [])
    for (let i = 0; i < changedBlocks.length; i++ ) {
      blocks[changedBlocks[i]].isOn = !blocks[changedBlocks[i]].isOn
    }
    generations++
    this.setState({
      blocks: blocks,
      generations: generations
    })
  }
  play () {
    const intervalId = setInterval(this.handleTurn, 50)
    this.setState({
      gameIsOn: true,
      intervalId: intervalId
    })
  }
  stop () {
    clearInterval(this.state.intervalId)
    this.setState({
      gameIsOn: false
    })
  }
  reset () {
    const blocks = this.state.blocks.map((b) => {
      b.isOn = false
      return b
    })
    this.setState({
      blocks: blocks,
      generations: 0
    })
  }
  render() {
    const borderSize = 4;
    const blocks = this.state.blocks.map((b, index) => {
      return (
        <Block
          x={b.posX}
          y={b.posY}
          size={this.state.blockSize}
          isOn={b.isOn}
          key={b.x + ' ' + b.y}
          index={index}
        />
      )
    });
    return (
      <div className="App">
        <h1>Conway's Game of Life</h1>
        <div
          style={{
            position: 'relative',
            display: 'inline-block',
            width: ((this.state.board.w * this.state.blockSize) + (borderSize * 2))+ 'px',
            height: ((this.state.board.h * this.state.blockSize) + (borderSize * 2) )+ 'px',
            border: borderSize + 'px solid #ddd'
          }}
          onClick={this.handleClick}
        >
          {blocks}
        </div>
        <hr />
        <button onClick={this.play}>Start</button>
        <button onClick={this.stop}>Stop</button>
        <button onClick={this.reset}>Clear</button>
        <span style={{ margin: '0 10px' }}>Generations: {this.state.generations}</span>
      </div>
    );
  }
}

export default App;
