import React from "react";

class LinePropertyArea extends React.Component {
    constructor(props) {
        super(props);
    }
    handleClick() {
        this.props.lineevent();
    }
    render() {
        return <div style={this.props.style}
            onClick={this.handleClick.bind(this)}>＼</div>
    }
}

export default LinePropertyArea;