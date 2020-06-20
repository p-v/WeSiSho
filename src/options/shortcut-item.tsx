import React, {createRef} from 'react';

type ShortcutItemState = {
  showSaveIcon: boolean;
}

type ShortcutItemProps = {
  base: string;
  description: string;
  shortcut: string;
  title: string;
  onUpdateClick: (a: string, b: string, c: string) => void;
  onRemoveClick: (a: string, b: string) => void;
}

export default class ShortcutItem extends React.Component<ShortcutItemProps, ShortcutItemState> {
  private shortcutInput = createRef<HTMLInputElement>();

  constructor(props: ShortcutItemProps) {
    super(props);
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
    if (this.shortcutInput.current) {
      this.props.onUpdateClick(this.props.base, this.props.shortcut,
        this.shortcutInput.current.value);
    }
  }

  render() {
    const { shortcut, title, description, base, onRemoveClick } = this.props;
    const { showSaveIcon } = this.state;

    const displayTitle = description ? `${description} (${title})` : title;
    return (
    <div>
      <h5>{displayTitle}</h5>
      <input
        ref={this.shortcutInput}
        onChange={this.onChange}
        type="text"
        maxLength={10}
        defaultValue={shortcut}
        placeholder="Press key for shortcut"
      />
      { showSaveIcon && <button onClick={this.onSave}>{'Save'}</button> }
      <button onClick={() => onRemoveClick(base, shortcut)}>{'Remove'}</button>
    </div>
    );
  }

}
