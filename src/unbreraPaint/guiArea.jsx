import React from 'react';
import { inject, observer } from 'mobx-react';
import GuiAreaHeader from './guiAreaHeader.jsx';

@inject(({ state }, props) => {
  return {
    undoManager: state.undoManager,
    updateRender: state.updateRender,
    updateVisualizeTreeUndoFunction: state.updateVisualizeTreeUndoFunction,
    updateUpdateCommandTextFunction: state.updateUpdateCommandTextFunction,
    imgSize: state.imgSize,
    guiAreaWidth: state.guiAreaWidth,
    guiAreaHeight: state.guiAreaHeight,
    currentStackBackgroundSize: state.currentStackBackgroundSize,
    guiAreaPositionX: state.guiAreaPosition.x,
    guiAreaPositionY: state.guiAreaPosition.y,
    headerHeight: state.headerHeight
  };
})
export default class GuiArea extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visualizeUndoStack: [],
      lastVisualizeUndoStackCoord: [
        (this.props.imgSize * 3) / 2 - this.props.imgSize / 2,
        (this.props.imgSize * 5) / 4 - this.props.imgSize / 2
      ],
      visualizeBranch: [],
      visualizeFlowArrow: [0, 0, 10, 10],
      scrollLeft: 0,
      scrollTop: 0,
      commandText: ''
    };
  }
  componentDidMount() {
    this.props.updateVisualizeTreeUndoFunction(this.visualizeTreeUndo);
    this.props.updateUpdateCommandTextFunction(this.updateCommandText);
    setTimeout(() => {
      this.visualizeTreeUndo(
        this.props.undoManager.undoStack[0],
        this.props.undoManager.redoStack,
        this.props.imgSize,
        (this.props.undoManager.undoStack[0].stackWidth / 2) *
          ((this.props.imgSize / 2) * 3)
      );
    }, 10);
    this.wrapperDivArea.addEventListener('scroll', this.handleScroll(this));
  }
  componentWillUnmount() {
    this.wrapperDivArea.removeEventListener('scroll', this.handleScroll(this));
  }
  visualizeTreeUndo = (startUndoStack, redoStack, x, y) => {
    const self = this;
    const visualizeUndoStack = [];
    const visualizeBranch = [];
    const lastUndoStack = this.lastUndoStack;
    this.lastUndoStack = this.props.undoManager.lastUndoStack();
    let prevLastVisualizeUndoStackCoord = [
      (this.props.imgSize * 3) / 2,
      (this.props.imgSize * 5) / 4
    ];
    let lastVisualizeUndoStackCoord = [
      (this.props.imgSize * 3) / 2 - this.props.currentStackBackgroundSize / 2,
      (this.props.imgSize * 5) / 4 - this.props.currentStackBackgroundSize / 2
    ];
    (function createTreeObj(stack, x, y) {
      visualizeUndoStack.push({
        stack: stack,
        x: x,
        y: y,
        width: self.props.imgSize,
        height: self.props.imgSize
      });
      if (stack == lastUndoStack) {
        prevLastVisualizeUndoStackCoord = [
          x + self.props.imgSize / 2,
          y + self.props.imgSize / 2
        ];
      }
      if (stack == self.props.undoManager.lastUndoStack()) {
        self.lastUndoStack = self.props.undoManager.lastUndoStack();
        lastVisualizeUndoStackCoord = [
          x - (self.props.currentStackBackgroundSize - self.props.imgSize) / 2,
          y - (self.props.currentStackBackgroundSize - self.props.imgSize) / 2
        ];
      }
      if (stack.nextStack.length > 0) {
        let totalSpread =
          -(stack.stackWidth - 1) / 2 +
          (self.props.undoManager.getNextBranchPoint(stack.nextStack[0])
            .stackWidth -
            1) /
            2;
        let num = 0;
        stack.nextStack.forEach((e, i) => {
          if (i !== 0)
            totalSpread +=
              (self.props.undoManager.getNextBranchPoint(stack.nextStack[i - 1])
                .stackWidth -
                1) /
                2 +
              (self.props.undoManager.getNextBranchPoint(stack.nextStack[i])
                .stackWidth -
                1) /
                2;
          num = totalSpread + i;
          visualizeBranch.push({
            x1: x + self.props.imgSize,
            y1: y + self.props.imgSize / 2,
            x2: x + (self.props.imgSize / 2) * 3,
            y2: y + (self.props.imgSize / 2) * 3 * num + self.props.imgSize / 2,
            x3: x + self.props.imgSize + (self.props.imgSize / 10) * 3,
            y3: y + self.props.imgSize / 2,
            x4:
              x + (self.props.imgSize / 2) * 3 - (self.props.imgSize / 10) * 3,
            y4: y + (self.props.imgSize / 2) * 3 * num + self.props.imgSize / 2,
            stroke: self.props.undoManager.undoStack.some(
              e => e === stack.nextStack[i]
            )
              ? '#f26'
              : redoStack.some(e => e === stack.nextStack[i])
              ? '#4f2'
              : '#24f'
          });
          createTreeObj(
            e,
            x + (self.props.imgSize / 2) * 3,
            y + (self.props.imgSize / 2) * 3 * num
          );
        });
      }
    })(startUndoStack, x, y);
    this.setState({
      lastVisualizeUndoStackCoord: lastVisualizeUndoStackCoord,
      visualizeUndoStack: visualizeUndoStack,
      visualizeBranch: visualizeBranch,
      visualizeFlowArrow: [
        prevLastVisualizeUndoStackCoord[0],
        prevLastVisualizeUndoStackCoord[1],
        lastVisualizeUndoStackCoord[0] +
          this.props.currentStackBackgroundSize / 2,
        lastVisualizeUndoStackCoord[1] +
          this.props.currentStackBackgroundSize / 2
      ]
    });
  };
  imgHandleClick = stack => {
    return e => {
      this.props.undoManager.recomposeUndoStack(stack);
      this.props.updateRender(stack);
      this.visualizeTreeUndo(
        this.props.undoManager.undoStack[0],
        this.props.undoManager.redoStack,
        this.props.imgSize,
        (this.props.undoManager.undoStack[0].stackWidth / 2) *
          ((this.props.imgSize / 2) * 3)
      );
    };
  };
  handleScroll = self => {
    return function(e) {
      self.setState({
        scrollLeft: this.scrollLeft,
        scrollTop: this.scrollTop
      });
    };
  };
  updateCommandText = text => {
    this.setState({
      commandText: text
    });
  };
  render() {
    return (
      <div
        touch-action='none'
        ref={e => (this.wrapperDivArea = e)}
        style={{
          overflow: 'auto',
          width: this.props.guiAreaWidth,
          height: this.props.guiAreaHeight + this.props.headerHeight,
          position: 'absolute',
          top: this.props.guiAreaPositionY,
          left: this.props.guiAreaPositionX,
          borderRadius: 5
        }}
      >
        <GuiAreaHeader
          style={{
            width: this.props.guiAreaWidth,
            height: this.props.headerHeight,
            backgroundColor: '#ddd',
            position: 'absolute',
            left: this.state.scrollLeft,
            top: this.state.scrollTop
          }}
        />
        <svg
          touch-action='auto'
          style={{
            width: this.props.guiAreaWidth,
            height: this.props.guiAreaHeight,
            backgroundColor: '#111',
            position: 'absolute',
            left: this.state.scrollLeft,
            top: this.state.scrollTop + this.props.headerHeight,
            userSelect: 'none'
          }}
          xmlns='http://www.w3.org/2000/svg'
          xmlnsXlink='http://www.w3.org/1999/xlink'
        >
          {this.state.visualizeBranch.map((e, i) => {
            const xm = Math.min(e.x1, e.x2, e.x3, e.x4);
            const xM = Math.max(e.x1, e.x2, e.x3, e.x4);
            const ym = Math.min(e.y1, e.y2, e.y3, e.y4);
            const yM = Math.max(e.y1, e.y2, e.y3, e.y4);
            if (
              xm - this.state.scrollLeft < this.props.guiAreaWidth &&
              xM - this.state.scrollLeft > 0 &&
              ym - this.state.scrollTop < this.props.guiAreaHeight &&
              yM - this.state.scrollTop > 0
            )
              return (
                <path
                  key={i}
                  stroke={e.stroke}
                  strokeWidth='3'
                  d={`M ${e.x1 - this.state.scrollLeft},${e.y1 -
                    this.state.scrollTop}
                                C ${e.x3 - this.state.scrollLeft},${e.y3 -
                    this.state.scrollTop} ${e.x4 -
                    this.state.scrollLeft},${e.y4 -
                    this.state.scrollTop} ${e.x2 -
                    this.state.scrollLeft},${e.y2 - this.state.scrollTop}`}
                />
              );
          })}
          <rect
            x={
              this.state.lastVisualizeUndoStackCoord[0] - this.state.scrollLeft
            }
            y={this.state.lastVisualizeUndoStackCoord[1] - this.state.scrollTop}
            width={this.props.currentStackBackgroundSize}
            height={this.props.currentStackBackgroundSize}
            fill='#f50'
          />
          {this.state.visualizeUndoStack.map((e, i) => {
            if (
              e.x - this.state.scrollLeft < this.props.guiAreaWidth &&
              e.x - this.state.scrollLeft + this.props.imgSize > 0 &&
              e.y - this.state.scrollTop < this.props.guiAreaHeight &&
              e.y - this.state.scrollTop + this.props.imgSize > 0
            )
              return (
                <React.Fragment key={i}>
                  <image
                    xlinkHref={e.stack.img}
                    x={e.x - this.state.scrollLeft}
                    y={e.y - this.state.scrollTop}
                    width={this.props.imgSize}
                    height={this.props.imgSize}
                  />
                  {/* <text
                    x={e.x - this.state.scrollLeft}
                    y={e.y + 65 - this.state.scrollTop}
                    fontSize={20}
                    fill='#fff'
                  >{`${e.stack.id},${e.stack.branchId }`}</text> */}
                </React.Fragment>
              );
          })}
          {((x1, y1, x2, y2) => {
            const radian = Math.atan2(y2 - y1, x2 - x1);
            const degree = (radian * 180) / Math.PI;
            if (x1 !== x2 || y1 !== y2) {
              return (
                <React.Fragment>
                  <line
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke='rgba(70,30,200,0.7)'
                    strokeWidth={this.props.currentStackBackgroundSize}
                  />
                  <polygon
                    transform={`translate(${x2} ${y2}) rotate(${degree})`}
                    fill='rgba(70,30,200,0.7)'
                    points={`${0},${-this.props.imgSize} ${0},${
                      this.props.imgSize
                    } ${this.props.imgSize},${0}`}
                  />
                </React.Fragment>
              );
            }
          })(
            this.state.visualizeFlowArrow[0] - this.state.scrollLeft,
            this.state.visualizeFlowArrow[1] - this.state.scrollTop,
            this.state.visualizeFlowArrow[2] - this.state.scrollLeft,
            this.state.visualizeFlowArrow[3] - this.state.scrollTop
          )}
          {/*<text
            x="50"
            y="100"
            fontSize="100"
            fill="#fff"
            strokeWidth="3"
            stroke="#000"
            fontFamily="Impact"
          >
            {this.state.commandText}
          </text>*/}
        </svg>
        {(() => {
          const maxX = Math.max(...this.state.visualizeUndoStack.map(e => e.x));
          const maxY = Math.max(...this.state.visualizeUndoStack.map(e => e.y));
          return this.state.visualizeUndoStack.map((e, i) => {
            if (
              (e.x - this.state.scrollLeft < this.props.guiAreaWidth &&
                e.x - this.state.scrollLeft + this.props.imgSize > 0 &&
                e.y - this.state.scrollTop < this.props.guiAreaHeight &&
                e.y - this.state.scrollTop + this.props.imgSize > 0) ||
              e.x === maxX ||
              e.y === maxY
            )
              return (
                <div
                  key={i}
                  style={{
                    position: 'absolute',
                    left: e.x,
                    top: e.y + this.props.headerHeight,
                    width: this.props.imgSize,
                    height: this.props.imgSize
                  }}
                  onClick={this.imgHandleClick(e.stack)}
                  onTouchStart={this.imgHandleClick(e.stack)}
                />
              );
          });
        })()}
      </div>
    );
  }
}
