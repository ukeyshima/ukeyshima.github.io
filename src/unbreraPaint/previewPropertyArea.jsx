import React from "react";
import PropTypes from "prop-types";

class PreviewPropertyArea extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            size: 20,
            sizeRatio: 1.0,
            width: 20,
        }
    }
    updateSizeRatio(nextSizeRatio) {        
        this.setState({
            sizeRatio: nextSizeRatio,
            width: this.state.size * nextSizeRatio
        })        
    }
    updateStrokeWidth(nextStrokeWidth) {
        this.setState({
            size: nextStrokeWidth,
            width: nextStrokeWidth * this.state.sizeRatio
        })
    }
    handleClick() {
        this.props.brushevent();
    }
    render() {
        return <div style={this.props.style}
            onClick={this.handleClick.bind(this)}>
            <div style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                transform: "translate(-50%, -50%)",
                width: this.state.width,
                height: this.state.width,
                borderRadius: "50%",
                backgroundColor: this.props.color
            }}></div>
        </div>
    }
}
PreviewPropertyArea.propTypes = {
    strokewidth: PropTypes.number,
    color: PropTypes.string
}

export default PreviewPropertyArea;