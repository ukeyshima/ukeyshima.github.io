import React from "react";

class ClearPropertyArea extends React.Component {
    constructor(props) {
        super(props);
    }
    handleClick() {
        this.props.clearevent();
    }
    render() {
        return <div style={this.props.style}
            onClick={this.handleClick.bind(this)}>clear</div>
    }
}

export default ClearPropertyArea;