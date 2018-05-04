import React from "react";

class CirclePropertyArea extends React.Component {
    constructor(props) {
        super(props);
    }
    handleClick() {
        this.props.circleevent();
    }
    render() {
        return <div style={this.props.style}
            onClick={this.handleClick.bind(this)}>●</div>
    }
}

export default CirclePropertyArea;