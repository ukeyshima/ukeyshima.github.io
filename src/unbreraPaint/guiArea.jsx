import React from "react";

class GuiArea extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visualizeUndoStack: [],
      lastVisualizeUndoStackCoord: [40, 27.5],
      visualizeBranch: [],
      visualizeFlowArrow: [0, 0, 10, 10],
      scrollLeft: 0,
      scrollTop: 0,
      commandText: ""
    };
    this.imgSize = 50;
    this.lastUndoStack = this.props.undomanager.lastUndoStack();
    this.unbra=this.unbra.bind(this);
    this.rebra=this.rebra.bind(this);
    this.undo=this.undo.bind(this);
    this.redo=this.redo.bind(this);
  }
  componentWillReceiveProps(nextProps) {
    this.visualizeTreeUndo(
      nextProps.undomanager.undoStack[0],
      nextProps.undomanager.redoStack,
      50,
      nextProps.undomanager.undoStack[0].stackWidth / 2 * (this.imgSize / 2 * 3)
    );
  }
  componentDidMount() {
    this.wrapperDivArea.addEventListener("scroll", this.handleScroll(this));
    this.topArrow.addEventListener("click", this.unbra);
    this.leftArrow.addEventListener("click", this.undo);
    this.bottomArrow.addEventListener("click", this.rebra);
    this.rightArrow.addEventListener("click", this.redo);
  }
  componentWillUnmount() {
    this.wrapperDivArea.removeEventListener("scroll", this.handleScroll(this));
    this.topArrow.addEventListener("click", this.unbra);
    this.leftArrow.addEventListener("click", this.undo);
    this.bottomArrow.addEventListener("click", this.rebra);
    this.rightArrow.addEventListener("click", this.redo);
  }
  visualizeTreeUndo(startUndoStack, redoStack, x, y) {
    const self = this;
    const visualizeUndoStack = [];
    const visualizeBranch = [];
    const lastUndoStack = this.lastUndoStack;
    let prevLastVisualizeUndoStackCoord = [75, 62.5];
    let lastVisualizeUndoStackCoord = [40, 27.5];
    (function createTreeObj(stack, x, y) {
      visualizeUndoStack.push({
        stack: stack,
        x: x,
        y: y,
        width: 50,
        height: 50
      });
      if (stack == lastUndoStack) {
        prevLastVisualizeUndoStackCoord = [x + 25, y + 25];
      }
      if (stack == self.props.undomanager.lastUndoStack()) {
        self.lastUndoStack = self.props.undomanager.lastUndoStack();
        lastVisualizeUndoStackCoord = [x - 10, y - 10];
      }
      if (stack.nextStack.length > 0) {
        let totalSpread =
          -(stack.stackWidth - 1) / 2 +
          (self.props.undomanager.getNextBranchPoint(stack.nextStack[0])
            .stackWidth -
            1) /
            2;
        let num = 0;
        stack.nextStack.forEach((e, i) => {
          if (i !== 0)
            totalSpread +=
              (self.props.undomanager.getNextBranchPoint(stack.nextStack[i - 1])
                .stackWidth -
                1) /
                2 +
              (self.props.undomanager.getNextBranchPoint(stack.nextStack[i])
                .stackWidth -
                1) /
                2;
          num = totalSpread + i;
          visualizeBranch.push({
            x1: x + self.imgSize,
            y1: y + self.imgSize / 2,
            x2: x + self.imgSize / 2 * 3,
            y2: y + self.imgSize / 2 * 3 * num + self.imgSize / 2,
            x3: x + self.imgSize + self.imgSize / 10 * 3,
            y3: y + self.imgSize / 2,
            x4: x + self.imgSize / 2 * 3 - self.imgSize / 10 * 3,
            y4: y + self.imgSize / 2 * 3 * num + self.imgSize / 2,
            stroke: self.props.undomanager.undoStack.some(
              e => e === stack.nextStack[i]
            )
              ? "#f26"
              : redoStack.some(e => e === stack.nextStack[i])
                ? "#4f2"
                : "#24f"
          });
          createTreeObj(
            e,
            x + self.imgSize / 2 * 3,
            y + self.imgSize / 2 * 3 * num
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
        lastVisualizeUndoStackCoord[0] + 35,
        lastVisualizeUndoStackCoord[1] + 35
      ]
    });
  }
  imgHandleClick(stack) {
    return function(e) {
      this.props.undomanager.recomposeUndoStack(stack);
      this.props.updaterender(stack);
      this.visualizeTreeUndo(
        this.props.undomanager.undoStack[0],
        this.props.undomanager.redoStack,
        50,
        this.props.undomanager.undoStack[0].stackWidth /
          2 *
          (this.imgSize / 2 * 3)
      );
    };
  }
  handleScroll(self) {
    return function(e) {
      self.setState({
        scrollLeft: this.scrollLeft,
        scrollTop: this.scrollTop
      });
    };
  }
  undo() {
    this.props.undomanager.undo();
    this.visualizeTreeUndo(
      this.props.undomanager.undoStack[0],
      this.props.undomanager.redoStack,
      50,
      this.props.undomanager.undoStack[0].stackWidth /
        2 *
        (this.imgSize / 2 * 3)
    );
    this.updateCommandText("undo");
  }
  redo() {
    this.props.undomanager.redo();
    this.visualizeTreeUndo(
      this.props.undomanager.undoStack[0],
      this.props.undomanager.redoStack,
      50,
      this.props.undomanager.undoStack[0].stackWidth /
        2 *
        (this.imgSize / 2 * 3)
    );
    this.updateCommandText("redo");
  }
  unbra() {
    this.props.undomanager.unbra();
    this.visualizeTreeUndo(
      this.props.undomanager.undoStack[0],
      this.props.undomanager.redoStack,
      50,
      this.props.undomanager.undoStack[0].stackWidth /
        2 *
        (this.imgSize / 2 * 3)
    );
    this.updateCommandText("unbra");
  }
  rebra() {
    this.props.undomanager.rebra();
    this.visualizeTreeUndo(
      this.props.undomanager.undoStack[0],
      this.props.undomanager.redoStack,
      50,
      this.props.undomanager.undoStack[0].stackWidth /
        2 *
        (this.imgSize / 2 * 3)
    );
    this.updateCommandText("rebra");
  }
  updateCommandText(text) {
    this.setState({
      commandText: text
    });
  }
  render() {
    return (
      <div
        ref={e => (this.wrapperDivArea = e)}
        style={{
          float: "left",
          position: "relative",
          overflow: "auto",
          width: this.props.style.width,
          height: this.props.style.height,
          backgroundColor: "#000"
        }}
      >
        <svg
          style={{
            width: this.props.style.width,
            height: this.props.style.height,
            backgroundColor: this.props.style.backgroundColor,
            position: "absolute",
            left: this.state.scrollLeft,
            top: this.state.scrollTop,
            userSelect: "none"
          }}
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
        >
          {this.state.visualizeBranch.map((e, i) => {
            const xm = Math.min(e.x1, e.x2, e.x3, e.x4);
            const xM = Math.max(e.x1, e.x2, e.x3, e.x4);
            const ym = Math.min(e.y1, e.y2, e.y3, e.y4);
            const yM = Math.max(e.y1, e.y2, e.y3, e.y4);
            if (
              xm - this.state.scrollLeft < this.props.style.width &&
              xM - this.state.scrollLeft > 0 &&
              ym - this.state.scrollTop < this.props.style.height &&
              yM - this.state.scrollTop > 0
            )
              return (
                <path
                  key={i}
                  stroke={e.stroke}
                  strokeWidth="3"
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
            width="70"
            height="70"
            fill="#f70"
          />
          {this.state.visualizeUndoStack.map((e, i) => {
            if (
              e.x - this.state.scrollLeft < this.props.style.width &&
              e.x - this.state.scrollLeft + this.imgSize > 0 &&
              e.y - this.state.scrollTop < this.props.style.height &&
              e.y - this.state.scrollTop + this.imgSize > 0
            )
              return (
                <React.Fragment key={i}>
                  <image
                    xlinkHref={e.stack.img}
                    x={e.x - this.state.scrollLeft}
                    y={e.y - this.state.scrollTop}
                    width={50}
                    height={50}
                  />
                  <text
                    x={e.x - this.state.scrollLeft}
                    y={e.y + 65 - this.state.scrollTop}
                    fontSize={20}
                    fill="#fff"
                  >{`${e.stack.id},${e.stack.branchId}`}</text>
                </React.Fragment>
              );
          })}
          {((x1, y1, x2, y2) => {
            const radian = Math.atan2(y2 - y1, x2 - x1);
            const degree = radian * 180 / Math.PI;
            if (x1 !== x2 || y1 !== y2) {
              return (
                <React.Fragment>
                  <line
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke="rgba(70,30,200,0.7)"
                    strokeWidth="70"
                  />
                  <polygon
                    transform={`translate(${x2} ${y2}) rotate(${degree})`}
                    fill="rgba(70,30,200,0.7)"
                    points={`${0},${-50} ${0},${50} ${50},${0}`}
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
          <polygon
            fill="#f05"
            points={`175,${this.props.style.height - 300} 125,${this.props.style
              .height - 250} 225,${this.props.style.height - 250}`}
            ref={e => (this.topArrow = e)}
          />
          <polygon
            fill="#f05"
            points={`50,${this.props.style.height - 175} 100,${this.props.style
              .height - 225} 100,${this.props.style.height - 125}`}
            ref={e => (this.leftArrow = e)}
          />
          <polygon
            fill="#f05"
            points={`175,${this.props.style.height - 50} 125,${this.props.style
              .height - 100} 225,${this.props.style.height - 100}`}
            ref={e => (this.bottomArrow = e)}
          />
          <polygon
            fill="#f05"
            points={`300,${this.props.style.height - 175} 250,${this.props.style
              .height - 225} 250,${this.props.style.height - 125}`}
            ref={e => (this.rightArrow = e)}
          />
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
              (e.x - this.state.scrollLeft < this.props.style.width &&
                e.x - this.state.scrollLeft + this.imgSize > 0 &&
                e.y - this.state.scrollTop < this.props.style.height &&
                e.y - this.state.scrollTop + this.imgSize > 0) ||
              e.x === maxX ||
              e.y === maxY
            )
              return (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    left: e.x,
                    top: e.y,
                    width: 50,
                    height: 50
                  }}
                  onClick={this.imgHandleClick(e.stack).bind(this)}
                />
              );
          });
        })()}
      </div>
    );
  }
}

export default GuiArea;
