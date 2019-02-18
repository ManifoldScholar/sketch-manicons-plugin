const template = `import React, { Component } from "react";
import PropTypes from "prop-types";

export default class <%= name %> extends Component {

  static propTypes = {
    width: PropTypes.number,
    height: PropTypes.number,
    className: PropTypes.string
  };

  static defaultProps = {
    className: "",
    width: <%= width %>,
    height: <%= height %>,
  };

  render() {

    const { className, width, height } = this.props;

    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        width={width}
        height={height}
        viewBox="<%= viewBox %>"
      >
        <%- svg %>
      </svg>
    );
  }
}
`
export default template;
