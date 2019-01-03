import { observable, computed, action } from 'mobx';

export default class State {
  @observable
  headerHeight = 20;

  @observable
  windowWidth = window.innerWidth;
  @action.bound
  updateWindowWidth(value) {
    this.windowWidth = value;
  }

  @observable
  windowHeight = window.innerHeight;
  @action.bound
  updateWindowHeight(value) {
    this.windowHeight = value;
  }

  @observable
  propertyAreaWidth = 100;

  @observable
  initialDrawAreaWidth =
    this.windowHeight < this.windowWidth
      ? (this.windowHeight * 2) / 3
      : this.windowWidth - this.propertyAreaWidth - 20;

  @observable
  drawAreaWidth = this.initialDrawAreaWidth;

  @action.bound
  updateDrawAreaWidth(value) {
    this.drawAreaWidth = value;
  }

  @observable
  drawAreaPosition = {
    x: this.propertyAreaWidth + 10,
    y: this.headerHeight + 10
  };
  @action.bound
  updateDrawAreaPosition(x, y) {
    this.drawAreaPosition.x = x;
    this.drawAreaPosition.y = y;
  }

  @observable
  guiAreaWidth =
    this.windowWidth > this.windowHeight
      ? this.windowWidth - this.drawAreaPosition.x - this.drawAreaWidth - 20
      : this.drawAreaWidth;

  @observable
  guiAreaHeight =
    this.windowWidth > this.windowHeight
      ? this.windowHeight - this.headerHeight - this.headerHeight - 20
      : (this.windowHeight - this.drawAreaWidth) / 2;

  @observable
  guiAreaPosition =
    this.windowWidth > this.windowHeight
      ? {
          x: this.drawAreaPosition.x + this.drawAreaWidth + 10,
          y: this.headerHeight + 10
        }
      : {
          x: this.drawAreaPosition.x,
          y:
            this.drawAreaPosition.y +
            this.drawAreaWidth +
            this.headerHeight +
            10
        };

  @action.bound
  updateGuiAreaPosition(x, y) {
    this.guiAreaPosition.x = x;
    this.guiAreaPosition.y = y;
  }

  @observable
  gestureAreaWidth = this.drawAreaWidth;

  @observable
  gestureAreaHeight =
    this.windowWidth > this.windowHeight
      ? this.windowHeight - this.drawAreaWidth - this.headerHeight * 3 - 10
      : this.windowHeight -
        this.drawAreaWidth -
        this.guiAreaHeight -
        this.headerHeight * 3 -
        40;

  @observable
  gestureAreaPosition =
    this.windowWidth > this.windowHeight
      ? {
          x: this.drawAreaPosition.x,
          y:
            this.drawAreaPosition.y +
            this.drawAreaWidth +
            this.headerHeight +
            10
        }
      : {
          x: this.drawAreaPosition.x,
          y:
            this.guiAreaPosition.y + this.guiAreaHeight + this.headerHeight + 10
        };
  @action.bound
  updateGestureAreaPosition(x, y) {
    this.gestureAreaPosition.x = x;
    this.gestureAreaPosition.y = y;
  }

  @action.bound
  windowResize() {
    this.windowWidth = window.innerWidth;
    this.windowHeight = window.innerHeight;
  }

  @observable imgSize = 40;

  @observable
  currentStackBackgroundSize = this.imgSize + 10;

  //undoManager
  @observable
  undoManager = null;

  @action.bound
  updateUndoManager(context) {
    this.undoManager = context;
  }

  @observable visualizeTreeUndo = null;
  @action.bound
  updateVisualizeTreeUndoFunction(func) {
    this.visualizeTreeUndo = func;
  }

  @observable
  updateCommandText = null;

  @action.bound
  updateUpdateCommandTextFunction(func) {
    this.updateCommandText = func;
  }

  @action.bound
  undo() {
    this.undoManager.undo();
    this.visualizeTreeUndo(
      this.undoManager.undoStack[0],
      this.undoManager.redoStack,
      this.imgSize,
      (this.undoManager.undoStack[0].stackWidth / 2) * ((this.imgSize / 2) * 3)
    );
    const undoManager = this.undoManager;
    this.updateRender(undoManager.lastUndoStack());
    this.updateCommandText('undo');
    this.updateUndoManager(undoManager);
  }
  @action.bound
  redo() {
    this.undoManager.redo();
    this.visualizeTreeUndo(
      this.undoManager.undoStack[0],
      this.undoManager.redoStack,
      this.imgSize,
      (this.undoManager.undoStack[0].stackWidth / 2) * ((this.imgSize / 2) * 3)
    );
    const undoManager = this.undoManager;
    this.updateRender(undoManager.lastUndoStack());
    this.updateCommandText('redo');
    this.updateUndoManager(undoManager);
  }
  @action.bound
  unbra() {
    this.undoManager.unbra();
    this.visualizeTreeUndo(
      this.undoManager.undoStack[0],
      this.undoManager.redoStack,
      this.imgSize,
      (this.undoManager.undoStack[0].stackWidth / 2) * ((this.imgSize / 2) * 3)
    );
    const undoManager = this.undoManager;
    this.updateRender(undoManager.lastUndoStack());
    this.updateCommandText('unbra');
    this.updateUndoManager(undoManager);
  }
  @action.bound
  rebra() {
    this.undoManager.rebra();
    this.visualizeTreeUndo(
      this.undoManager.undoStack[0],
      this.undoManager.redoStack,
      this.imgSize,
      (this.undoManager.undoStack[0].stackWidth / 2) * ((this.imgSize / 2) * 3)
    );
    const undoManager = this.undoManager;
    this.updateRender(undoManager.lastUndoStack());
    this.updateCommandText('rebra');
    this.updateUndoManager(undoManager);
  }
  @observable
  updateRender = null;
  @action.bound
  updateUpdateRenderFunction(func) {
    this.updateRender = func;
  }
  @observable
  strokeWidth = 20;
  @observable
  previewStrokeWidth = 20;
  @observable
  sizeRatio = 1.0;
  @action.bound
  updateSizeRatio(value) {
    this.strokeWidth = this.strokeWidth;
    this.previewStrokeWidth = this.strokeWidth * value;
    this.sizeRatio = value;
  }
  @action.bound
  updateStrokeWidth(value) {
    this.strokeWidth = value;
    this.previewStrokeWidth = value * this.sizeRatio;
  }
  @observable
  color = 'rgba(0,0,0,1.0)';
  @observable
  colorArray = [0, 0, 0];
  @action.bound
  updateColor(value) {
    this.color = `rgba(${value[0]},${value[1]},${value[2]},${this.opacity})`;
    this.colorArray = value;
    this.opacityAreaRender(
      this.opacityAreaGlContext,
      value.map(e => e / 255),
      this.opacityAreaUniLocation
    );
  }
  @observable
  opacity = 1.0;
  @action.bound
  updateOpacity(value) {
    this.opacity = value;
    this.color = `rgba(${this.colorArray[0]},${this.colorArray[1]},${
      this.colorArray[2]
    },${value})`;
  }

  //opacityArea
  @observable
  opaityAreaRender = null;
  @action.bound
  updateOpacityAreaRender(func) {
    this.opacityAreaRender = func;
  }
  @observable
  opacityAreaGlContext = null;
  @action.bound
  updateOpacityAreaGlContext(context) {
    this.opacityAreaGlContext = context;
  }
  @observable
  opacityAreaUniLocation = null;
  @action.bound
  updateOpacityAreaUniLocation(array) {
    this.opacityAreaUniLocation = array;
  }

  //flag
  @observable
  flag = {
    brush: true,
    rect: false,
    circle: false,
    line: false,
    colorPicker: false,
    clear: false
  };

  //buckground
  @observable
  background = {
    brush: '#eee',
    rect: '#bbb',
    circle: '#bbb',
    line: '#bbb',
    colorPicker: '#bbb',
    clear: '#bbb'
  };

  @action.bound
  brushEvent() {
    const name = 'brush';
    for (let key in this.flag) {
      this.flag[key] = key === name ? true : false;
    }
    for (let key in this.background) {
      this.background[key] = key === name ? '#eee' : '#bbb';
    }
  }

  @action.bound
  rectEvent() {
    const name = 'rect';
    for (let key in this.flag) {
      this.flag[key] = key === name ? true : false;
    }
    for (let key in this.background) {
      this.background[key] = key === name ? '#eee' : '#bbb';
    }
  }

  @action.bound
  circleEvent() {
    const name = 'circle';
    for (let key in this.flag) {
      this.flag[key] = key === name ? true : false;
    }
    for (let key in this.background) {
      this.background[key] = key === name ? '#eee' : '#bbb';
    }
  }

  @action.bound
  lineEvent() {
    const name = 'line';
    for (let key in this.flag) {
      this.flag[key] = key === name ? true : false;
    }
    for (let key in this.background) {
      this.background[key] = key === name ? '#eee' : '#bbb';
    }
  }
  @action.bound
  colorPickerEvent() {
    const name = 'colorPicker';
    for (let key in this.flag) {
      this.flag[key] = key === name ? true : false;
    }
    for (let key in this.background) {
      this.background[key] = key === name ? '#eee' : '#bbb';
    }
  }
  @action.bound
  clearEvent() {
    const name = 'clear';
    for (let key in this.flag) {
      this.flag[key] = key === name ? true : false;
    }
    for (let key in this.background) {
      this.background[key] = key === name ? '#eee' : '#bbb';
    }
    this.clear();
  }
  @observable
  clear = null;
  @action.bound
  updateClearFunction(func) {
    this.clear = func;
  }
}
