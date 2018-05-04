import React from "react";

class SizeChangeArea extends React.Component {
    constructor(props) {
        super(props);
    }
    handleMouseDown(e) {
        this.props.sizechangestart(e);
    }
    render() {
        return <div style={this.props.style}
            onMouseDown={this.handleMouseDown.bind(this)}
        />
    }
}

export default SizeChangeArea;