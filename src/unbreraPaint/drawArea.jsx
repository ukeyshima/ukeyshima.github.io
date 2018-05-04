import React from "react";
import UndoManager from "./undoManager.js"

const dist = (x1, y1, x2, y2) => {
    return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
}
class DrawArea extends React.Component {
    constructor(props) {
        super(props);
        this.initialWidth = this.props.style.width;
        this.initialHeight = this.props.style.height;
        this.state = {
            mousedown: false,
            prevCanvas: null,
            context: null,
            wrapperContext: null,
            widthRatio: 1.0,
            heightRatio: 1.0,
            undoManager: null
        }
        this.handleKeyDown=this.handleKeyDown.bind(this);
    }
    componentDidMount() {
        const canvas = this.canvas;
        const canvasWrapper = this.canvasWrapper;
        const context = canvas.getContext("2d");
        const wrapperContext = canvasWrapper.getContext("2d");
        canvas.width = this.props.style.width;
        canvas.height = this.props.style.height;
        canvasWrapper.width = this.props.style.width;
        canvasWrapper.height = this.props.style.height;
        context.fillStyle = "#fff";
        context.fillRect(0, 0, canvas.width, canvas.height);
        const undoManager = new UndoManager(canvas.toDataURL("image/png"), context.getImageData(0, 0, this.initialWidth, this.initialHeight));
        this.setState({
            context: context,
            wrapperContext: wrapperContext,
            undoManager: undoManager
        })
        this.props.updateundomanager(undoManager);
        window.addEventListener("keydown", this.handleKeyDown);
    }

    componentWillUnmount() {
        window.removeEventListener("keydown", this.handleKeyDown);
    }

    updateSizeRatio(nextWidth, nextHeight) {
        const widthRatio = nextWidth / this.initialWidth;
        const heightRatio = nextHeight / this.initialHeight;
        this.setState({
            widthRatio: widthRatio,
            heightRatio: heightRatio
        })
        this.props.changesizeratio(widthRatio);
    }
    handleMouseDown(e) {
        const event = e.nativeEvent;
        const context = this.state.context;
        const widthRatio = this.state.widthRatio;
        const heightRatio = this.state.heightRatio;
        const x = event.layerX / widthRatio;
        const y = event.layerY / heightRatio;
        this.setState({
            mousedown: true,
        })
        this.prevX = x;
        this.prevY = y;
        this.x = [x];
        this.y = [y];
        this.imageData = context.getImageData(0, 0, this.initialWidth, this.initialHeight);
    }
    handleMouseMove(e) {
        const event = e.nativeEvent;
        const canvas = this.canvas;
        const canvasWrapper = this.canvasWrapper;
        const context = this.state.context;
        const wrapperContext = this.state.wrapperContext;
        const prevX = this.prevX;
        const prevY = this.prevY;
        const widthRatio = this.state.widthRatio;
        const heightRatio = this.state.heightRatio;
        const x = event.layerX / widthRatio;
        const y = event.layerY / heightRatio;
        if (this.state.mousedown) {
            context.strokeStyle = this.props.color;
            context.lineWidth = this.props.strokewidth;
            context.lineJoin = "round";
            context.lineCap = "round";
            if (this.props.brushevent) {
                wrapperContext.clearRect(0, 0, this.initialWidth, this.initialHeight);
                this.x.push(x);
                this.y.push(y);
                context.putImageData(this.imageData, 0, 0);
                context.beginPath();
                for (let i = 0; i < this.x.length - 1; i++) {
                    context.moveTo(this.x[i], this.y[i]);
                    context.lineTo(this.x[i + 1], this.y[i + 1]);
                }
                context.stroke();
                context.closePath();
            } else if (this.props.rectevent) {
                wrapperContext.fillStyle = this.props.color;
                wrapperContext.clearRect(0, 0, this.initialWidth, this.initialHeight);
                wrapperContext.fillRect(prevX, prevY, x - prevX, y - prevY);
            } else if (this.props.circleevent) {
                wrapperContext.fillStyle = this.props.color;
                wrapperContext.clearRect(0, 0, this.initialWidth, this.initialHeight);
                wrapperContext.beginPath();
                wrapperContext.arc(prevX, prevY, dist(x, y, prevX, prevY), 0, Math.PI * 2, true);
                wrapperContext.fill();
            } else if (this.props.lineevent) {
                wrapperContext.fillStyle = this.props.color;
                wrapperContext.clearRect(0, 0, this.initialWidth, this.initialHeight);
                wrapperContext.strokeStyle = this.props.color;
                wrapperContext.lineWidth = this.props.strokewidth;
                wrapperContext.beginPath();
                wrapperContext.moveTo(prevX, prevY);
                wrapperContext.lineTo(x, y);
                wrapperContext.stroke();
                wrapperContext.closePath();
            }
        } else {
            if (!this.props.rectevent && !this.props.circleevent && !this.props.colorpickerevent) {
                wrapperContext.fillStyle = this.props.color;
                wrapperContext.clearRect(0, 0, this.initialWidth, this.initialHeight);
                wrapperContext.beginPath();
                wrapperContext.arc(x, y, this.props.strokewidth / 2, 0, Math.PI * 2, true);
                wrapperContext.fill();
            }
        }
    }
    handleMouseUp(e) {
        const event = e.nativeEvent;
        const canvas = this.canvas;
        const context = this.state.context;
        const wrapperContext = this.state.wrapperContext;
        const prevX = this.prevX;
        const prevY = this.prevY;
        const widthRatio = this.state.widthRatio;
        const heightRatio = this.state.heightRatio;
        const x = event.layerX / widthRatio;
        const y = event.layerY / heightRatio;
        const undoManager = this.state.undoManager;
        wrapperContext.clearRect(0, 0, this.initialWidth, this.initialHeight);
        if (this.props.rectevent) {
            context.fillStyle = this.props.color;
            context.fillRect(prevX, prevY, x - prevX, y - prevY);
        } else if (this.props.circleevent) {
            context.fillStyle = this.props.color;
            context.beginPath();
            context.arc(prevX, prevY, dist(x, y, prevX, prevY), 0, Math.PI * 2, true);
            context.fill();
        } else if (this.props.lineevent) {
            context.lineJoin = "butt";
            context.lineCap = "butt";
            context.strokeStyle = this.props.color;
            context.lineWidth = this.props.strokewidth;
            context.beginPath();
            context.moveTo(prevX, prevY);
            context.lineTo(x, y);
            context.stroke();
            context.closePath();
        } else if (this.props.colorpickerevent) {
            this.props.readcolor(context.getImageData(x, y, 1, 1).data);
        }
        undoManager.execute(null, canvas.toDataURL("image/png"), context.getImageData(0, 0, this.initialWidth, this.initialHeight));
        this.props.updateundomanager(undoManager);
        this.setState({
            mousedown: false,
        })
    }
    handleKeyDown(e) {
        if ((e.key === 'z' && (e.ctrlKey || e.metaKey) && e.shiftKey) || (e.key === 'Z' && (e.ctrlKey || e.metaKey) && e.shiftKey)) {
            this.state.undoManager.redo();
            const undoManager = this.state.undoManager;
            this.updateRender(undoManager.lastUndoStack());
            this.props.updatecommandtext("redo");
            this.props.updateundomanager(undoManager);
        } else if (e.key === 'z' && (e.ctrlKey || e.metaKey)) {
            this.state.undoManager.undo();
            const undoManager = this.state.undoManager;
            this.updateRender(undoManager.lastUndoStack());
            this.props.updatecommandtext("undo");
            this.props.updateundomanager(undoManager);
        } else if ((e.key === '¸' && e.altKey && e.shiftKey) || (e.key === 'Z' && e.altKey && e.shiftKey)) {
            this.state.undoManager.rebra();
            const undoManager = this.state.undoManager;
            this.updateRender(undoManager.lastUndoStack());
            this.props.updatecommandtext("rebra");
            this.props.updateundomanager(undoManager);
        } else if ((e.key === 'Ω' && e.altKey) || (e.key === 'z' && e.altKey)) {
            this.state.undoManager.unbra();
            const undoManager = this.state.undoManager;
            this.updateRender(undoManager.lastUndoStack());
            this.props.updatecommandtext("unbra");
            this.props.updateundomanager(undoManager);
        }
    }
    clearEvent(){        
        const canvas = this.canvas;
        const context = this.state.context;        
        const widthRatio = this.state.widthRatio;
        const heightRatio = this.state.heightRatio;        
        const undoManager = this.state.undoManager;        
        context.fillStyle=this.props.color;
        context.fillRect(0,0,this.initialWidth,this.initialHeight);
        this.state.undoManager.execute(null, canvas.toDataURL("image/png"), context.getImageData(0, 0, this.initialWidth, this.initialHeight));
        this.props.updateundomanager(undoManager);        
    }
    updateRender(stack) {
        const context = this.state.context;
        const imageData = stack.state;
        context.putImageData(imageData, 0, 0);
    }
    render() {
        return (<div style={{
            width: this.props.style.width,
            height: this.props.style.height,
            position: "relative",
            float: "left"
        }}>
            <canvas style={{
                width: this.props.style.width,
                height: this.props.style.height,
                position: "absolute",
                backgroundColor: "#fff"
            }}
                ref={e => { this.canvas = e }}
            ></canvas>
            <canvas style={{
                width: this.props.style.width,
                height: this.props.style.height,
                position: "absolute",
                backgroundColor: "rgba(255,255,255,0)"
            }}
                ref={e => { this.canvasWrapper = e }}
                onMouseDown={this.handleMouseDown.bind(this)}
                onMouseMove={this.handleMouseMove.bind(this)}
                onMouseUp={this.handleMouseUp.bind(this)}
            ></canvas>
        </div>)
    }
}
export default DrawArea;