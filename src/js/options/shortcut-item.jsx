import React from 'react';
import { FormGroup, ControlLabel, FormControl, Glyphicon, Col, Row } from 'react-bootstrap';
import { icon } from './style.css';

export default class ShortcutItem extends React.Component {

  constructor() {
    super();
    this.state = {
      showSaveIcon: false,
    };
    this.onChange = this.onChange.bind(this);
    this.onSave = this.onSave.bind(this);
  }

  onChange() {
    if (!this.state.showSaveIcon) {
      this.setState({ showSaveIcon: true });
    }
  }

  onSave() {
    this.props.onUpdateClick(this.props.base, this.props.shortcut, this.shortcutInput.value);
  }

  render() {
    const { shortcut, title, base, onRemoveClick } = this.props;
    const { showSaveIcon } = this.state;
    return (
    <FormGroup>
      <Row>
      <Col md={3}>
        <h5>{title}</h5>
      </Col>
      <Col md={4}>
      <FormControl
        inputRef={(shortcutInput) => { this.shortcutInput = shortcutInput; }}
        onChange={this.onChange}
        type="text"
        maxLength={10}
        defaultValue={shortcut}
        placeholder="Press key for shortcut"
      />
      </Col>
      { showSaveIcon && <Col md={1}><Glyphicon onClick={this.onSave} className={icon} bsClass="glyphicon" glyph="ok" /></Col> }
      <Col md={1}>
        <Glyphicon onClick={() => onRemoveClick(base, shortcut)} className={icon} bsClass="glyphicon" glyph="remove" />
      </Col>
      </Row>
    </FormGroup>
    );
  }

}
