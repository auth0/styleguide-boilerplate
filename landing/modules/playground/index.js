/* eslint no-unused-vars:0 */

import "babel-polyfill";
import React from "react";

import Editor from "./editor";
import Preview from "./preview";
import EsPreview from "./es6-preview";
import Doc from "./doc";
import classNames from 'classnames';

const ReactPlayground = React.createClass({
  propTypes: {
    title: React.PropTypes.string,
    description: React.PropTypes.string,
    codeText: React.PropTypes.string.isRequired,
    scope: React.PropTypes.object.isRequired,
    collapsableCode: React.PropTypes.bool,
    docClass: React.PropTypes.func,
    propDescriptionMap: React.PropTypes.object,
    theme: React.PropTypes.string,
    selectedLines: React.PropTypes.array,
    noRender: React.PropTypes.bool,
    es6Console: React.PropTypes.bool,
    context: React.PropTypes.object,
    initiallyExpanded: React.PropTypes.bool,
    previewComponent: React.PropTypes.node
  },

  getDefaultProps() {
    return {
      theme: "sb",
      noRender: true,
      context: {},
      initiallyExpanded: false
    };
  },

  getInitialState() {
    return {
      code: this.props.codeText,
      expandedCode: this.props.initiallyExpanded,
      external: true
    };
  },

  componentWillReceiveProps(nextProps) {
    this.setState({
      code: nextProps.codeText,
      external: true
    });
  },

  _handleCodeChange(code) {
    this.setState({
      code,
      external: false
    });
  },

  _toggleCode() {
    this.setState({
      expandedCode: !this.state.expandedCode
    });
  },

  render() {
    if (this.props.noRender === false) {
      if (process.env.NODE_ENV !== "production") {
        /* eslint-disable no-console, no-undef, max-len */
        if (typeof console !== "undefined" && console.warn) {
          console.warn(`
            Deprecation warning: noRender is being deprecated in favor of wrapped components and will be removed in the 1.x release.
            https://github.com/FormidableLabs/component-playground/issues/19 for details.
          `);
        }
        /* eslint-enable no-console, no-undef, max-len */
      }
    }

    var componentClass = classNames(
			'playground',
  		(this.props.collapsableCode ? " collapsableCode" : ""),
			this.props.className
		);

    return (
      <div className={componentClass}>
        <div className="preview_code">
          <h5>{this.props.title}</h5>
          <p>{this.props.description}</p>
          <div className="playgroundPreview">
            {this.props.es6Console ?
              <EsPreview
                code={this.state.code}
                scope={this.props.scope} />
            :
            <Preview
              context={this.props.context}
              code={this.state.code}
              scope={this.props.scope}
              noRender={this.props.noRender}
              previewComponent={this.props.previewComponent} />
            }
          </div>

          <div className={"playgroundCode" + (this.state.expandedCode ? " expandedCode" : "")}>
            <Editor
              onChange={this._handleCodeChange}
              className="playgroundStage"
              codeText={this.state.code}
              external={this.state.external}
              theme={this.props.theme}
              selectedLines={this.props.selectedLines}/>
          </div>
        </div>

        {this.props.docClass ?
          <Doc
            componentClass={this.props.docClass}
            propDescriptionMap={this.props.propDescriptionMap} />
          : ""
        }

        {this.props.collapsableCode ?
          <div className="playgroundToggleCodeBar">
            <span className="playgroundToggleCodeLink" onClick={this._toggleCode}>
              {this.state.expandedCode ? "collapse" : "expand"}
            </span>
          </div>
          : ""
        }
      </div>
    );
  }
});

export default ReactPlayground;