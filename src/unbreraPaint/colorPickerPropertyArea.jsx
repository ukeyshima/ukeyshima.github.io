import React from "react";

class ColorPickerPropertyArea extends React.Component {
    constructor(props) {
        super(props);
    }
    handleClick() {
        this.props.colorpickerevent();
    }
    render() {
        return <div style={this.props.style}
                onClick={this.handleClick.bind(this)}>✎</div>
    }
}

export default ColorPickerPropertyArea;