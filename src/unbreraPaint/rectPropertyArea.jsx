import React from "react";

class RectPropertyArea extends React.Component {
    constructor(props) {
        super(props);
    }
    handleClick() {
        this.props.rectevent();
    }
    render() {
        return <div style={this.props.style}
            onClick={this.handleClick.bind(this)}>■</div>
    }
}

export default RectPropertyArea;