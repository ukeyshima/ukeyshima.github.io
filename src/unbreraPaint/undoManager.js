export default class UndoManager {
  constructor(initialImg, initialState) {
    this.branchId = 0;
    this.undoStack = [
      this.undoStackObj(
        null,
        initialImg,
        initialState,
        this.branchId,
        null,
        [],
        1
      )
    ];
    this.redoStack = [];
    this.undoStack[0].id = 0;
    this.id = 0;
  }
  undoStackObj(delta, img, state, branchId, frontStack, nextStack, stackWidth) {
    return {
      delta: delta,
      img: img,
      state: state,
      branchId: branchId,
      frontStack: frontStack,
      nextStack: nextStack,
      stackWidth: stackWidth
    };
  }
  undo() {
    if (this.hasUndoStack()) {
      console.log('undo!');
      const stack = this.undoStack.pop();
      this.redoStack.push(stack);
    } else {
      console.log("can't undo!");
    }
  }
  redo() {
    if (this.hasRedoStack()) {
      console.log('redo!');
      const stack = this.redoStack.pop();
      this.undoStack.push(stack);
    } else {
      console.log("can't redo!");
    }
  }
  execute(delta, img, state) {
    this.redoStack = [];
    const lastUndoStack = this.lastUndoStack();
    if (lastUndoStack.nextStack.length > 0) {
      (function repaintBranchId(stack) {
        stack.branchId = 0;
        if (!(stack.nextStack.length > 1 || stack.nextStack.length == 0)) {
          repaintBranchId(stack.nextStack[0]);
        } else {
          return;
        }
      })(lastUndoStack.nextStack[0]);
      this.branchId = lastUndoStack.nextStack.length;
    } else {
      this.branchId = lastUndoStack.branchId;
    }
    this.undoStack.push(
      this.undoStackObj(delta, img, state, this.branchId, lastUndoStack, [], 1)
    );
    lastUndoStack.nextStack.push(this.lastUndoStack());
    if (lastUndoStack.nextStack.length > 1)
      this.updateStackWidth(lastUndoStack);
    this.id++;
    this.lastUndoStack().id = this.id;
  }
  unbra() {
    const lastUndoStack = Object.assign({}, this.lastUndoStack());
    const undoStack = this.undoStack;
    const branchPointStack = undoStack
      .concat()
      .filter(e => e.nextStack.length > 1);
    const currentId = branchPointStack.map(e => e.branchId);
    currentId.push(lastUndoStack.branchId);
    const currentBranchId = currentId
      .concat()
      .reverse()
      .find(e => e > 0);
    const branchPointIndex = currentId.lastIndexOf(currentBranchId) - 1;
    const branchPoint = branchPointStack[branchPointIndex];
    if (branchPoint) {
      console.log('unbra!');
      const nextBranchId = currentBranchId - 1;
      const branchPointNum = undoStack.lastIndexOf(branchPoint);
      const j = undoStack.length - branchPointNum - 1;
      for (let i = 0; i < j; i++) {
        this.undo();
      }
      (function stackUndoStack(stack) {
        undoStack.push(stack);
        if (stack.nextStack.length === 0) return;
        stackUndoStack(stack.nextStack[stack.nextStack.length - 1]);
      })(branchPoint.nextStack[nextBranchId]);
      this.redoStack = [];
    } else {
      console.log("can't unbra!");
    }
  }
  rebra() {
    const lastUndoStack = Object.assign({}, this.lastUndoStack());
    const undoStack = this.undoStack;
    const branchPointStack = undoStack
      .concat()
      .filter(e => e.nextStack.length > 1);
    const currentId = branchPointStack.map(e => e.branchId);
    currentId.push(lastUndoStack.branchId);
    let nextBranchId = 0;
    const branchPoint = branchPointStack
      .concat()
      .reverse()
      .find((e, i) => {
        nextBranchId = currentId.concat().reverse()[i] + 1;
        return e.nextStack.length > currentId.concat().reverse()[i] + 1;
      });
    if (branchPoint) {
      console.log('rebra!');
      const branchPointNum = undoStack.lastIndexOf(branchPoint);
      const j = undoStack.length - branchPointNum - 1;
      for (let i = 0; i < j; i++) {
        this.undo();
      }
      (function stackUndoStack(stack) {
        undoStack.push(stack);
        if (stack.nextStack.length === 0) return;
        stackUndoStack(stack.nextStack[0]);
      })(branchPoint.nextStack[nextBranchId]);
      this.redoStack = [];
    } else {
      console.log("can't rebra!");
    }
  }
  recomposeUndoStack(target) {
    const nextStack = [];
    const self = this;
    const undoStack = this.undoStack;
    const branchPoint = (function searchBranchPoint(target) {
      nextStack.unshift(target);
      if (!target.frontStack) return target;
      if (undoStack.some(e => e === target.frontStack)) {
        return target.frontStack;
      } else {
        return searchBranchPoint(target.frontStack);
      }
    })(target);
    const branchPointNum = undoStack.lastIndexOf(branchPoint);
    const j = undoStack.length - branchPointNum - 1;
    for (let i = 0; i < j; i++) {
      this.undo();
    }
    (function stackUndoStack(stack, i) {
      self.undoStack.push(stack);
      if (stack === target) {
        return;
      } else {
        stackUndoStack(nextStack[i + 1], i + 1);
      }
    })(nextStack[0], 0);
    this.redoStack = [];
    (function stackRedoStack(stack) {
      if (stack.nextStack.length === 0) return;
      self.redoStack.unshift(stack.nextStack[0]);
      stackRedoStack(stack.nextStack[0]);
    })(this.lastUndoStack());
  }
  hasUndoStack() {
    return this.undoStack.length > 1;
  }
  hasRedoStack() {
    return this.redoStack.length > 0;
  }
  lastUndoStack() {
    return this.undoStack[this.undoStack.length - 1];
  }
  isBranchPoint(stack) {
    return stack.nextStack.length > 1;
  }
  updateStackWidth(stack) {
    stack.stackWidth++;
    const parent = stack.frontStack;
    if (parent) this.updateStackWidth(parent);
  }
  getNextBranchPoint(stack) {
    if (!(stack.nextStack.length > 1 || stack.nextStack.length == 0)) {
      return this.getNextBranchPoint(stack.nextStack[0]);
    } else {
      return stack;
    }
  }
}
