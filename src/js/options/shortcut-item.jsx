import React from 'react';
import { icon, itemHeader, removeBtn, descriptionButtonContainer } from './style.css';

export default class ShortcutItem extends React.Component {

  constructor() {
    super();
    this.state = {
      showSaveIcon: false,
      editMode: false,
    };
    this.onChange = this.onChange.bind(this);
    this.onSave = this.onSave.bind(this);
    this.onEditDescClick = this.onEditDescClick.bind(this);
    this.onSaveDescClick = this.onSaveDescClick.bind(this);
    this.onCancelDescClick = this.onCancelDescClick.bind(this);
  }

  onChange() {
    if (!this.state.showSaveIcon) {
      this.setState({ showSaveIcon: true });
    }
  }

  onSave() {
    this.props.onUpdateClick(this.props.base, this.props.shortcut, {
      shortcut: this.shortcutInput.value
    });
  }

  onEditDescClick() {
    this.setState({ editMode: true });
  }

  onSaveDescClick() {
    this.setState({ editMode: false });
    this.props.onUpdateClick(this.props.base, this.props.shortcut, {
      description: this.descriptionInput.value
    });
  }

  onCancelDescClick() {
    this.setState({ editMode: false });
  }

  render() {
    const { shortcut, title, description, base, onRemoveClick } = this.props;
    const { showSaveIcon, editMode } = this.state;

    const displayTitle = description ? `${description} (${title})` : title;
    if (editMode) {
      return (<div>
        <h5>{displayTitle}</h5>
        <div className={itemHeader}>
          <textarea
            ref={(descriptionInput) => { this.descriptionInput = descriptionInput; }}
            type="text"
            defaultValue={description}
            placeholder="Add description"
          />
          <div className={descriptionButtonContainer}>
            <button onClick={this.onSaveDescClick}>{'Save Description'}</button>
            <button onClick={this.onCancelDescClick}>{'Cancel'}</button>
          </div>
        </div>
      </div>);
    }
    return (
    <div>
      <div className={itemHeader}>
        <h5>{displayTitle}</h5>
        <button onClick={this.onEditDescClick}>{'Edit Description'}</button>
      </div>
      <input
        ref={(shortcutInput) => { this.shortcutInput = shortcutInput; }}
        onChange={this.onChange}
        type="text"
        maxLength={10}
        defaultValue={shortcut}
        placeholder="Press key for shortcut"
      />
      { showSaveIcon && <button onClick={this.onSave}>{'Save'}</button> }
      <button className={removeBtn} onClick={() => onRemoveClick(base, shortcut)}>{'Remove'}</button>
    </div>
    );
  }

}
