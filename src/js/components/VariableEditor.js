import React from 'react';
import AutosizeTextarea from 'react-textarea-autosize';

import { toType } from './../helpers/util';
import dispatcher from './../helpers/dispatcher';
import parseInput from './../helpers/parseInput';
import stringifyVariable from './../helpers/stringifyVariable';
import CopyToClipboard from './CopyToClipboard';

//data type components
import {
    JsonBoolean,
    JsonDate,
    JsonFloat,
    JsonFunction,
    JsonInteger,
    JsonNan,
    JsonNull,
    JsonRegexp,
    JsonString,
    JsonUndefined
} from './DataTypes/DataTypes';

//clibboard icon
import {
    Edit,
    CheckCircle,
    RemoveCircle as Remove,
    AddVariable
} from './icons';

//theme
import Theme from './../themes/getStyle';
import VariablePopup from './VariablePopup/VariablePopup';
import styled, { css } from 'styled-components';
const StyledKeyWrapper = styled.span`
    padding: 0 5px;
    &::before {
        content: '';
        clip-path: circle(50% at 100% 50%);
        width: 15px;
        height: 15px;
        display: inline-block;
        position: absolute;
        left: -15px;
        z-index: -1;
    }
    &::after {
        content: '';
        width: 15px;
        height: 15px;
        display: inline-block;
        position: absolute;
        right: -15px;
        z-index: -1;
        clip-path: circle(50% at 0 50%);
    }
    z-index: 1;
    position: relative;
    ${props =>
        props.isHovered &&
        css`
            background-color: #2a7cff29;
            &::after {
                background-color: #2a7cff29;
            }
            &::before {
                background-color: #2a7cff29;
            }
        `}
`;
class VariableEditor extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            editMode: false,
            editValue: '',
            hovered: false,
            renameKey: false,
            parsedInput: {
                type: false,
                value: null
            },
            showPopup: false,
            popupPosition: {}
        };
    }

    render() {
        const {
            variable,
            singleIndent,
            type,
            theme,
            namespace,
            namespaceVariable,
            indentWidth,
            enableClipboard,
            onEdit,
            onDelete,
            onSelect,
            displayArrayKey,
            quotesOnKeys,
            onVariableAdd
        } = this.props;
        const { editMode } = this.state;
        return (
            <div
                {...Theme(theme, 'objectKeyVal', {
                    paddingLeft: indentWidth * singleIndent
                })}
                onMouseEnter={() =>
                    this.setState({ ...this.state, hovered: true })
                }
                onMouseLeave={() =>
                    this.setState({ ...this.state, hovered: false })
                }
                class="variable-row"
                key={variable.name}
            >
                {type == 'array' ? (
                    displayArrayKey ? (
                        <>
                            <StyledKeyWrapper
                                isHovered={
                                    this.state.hovered || this.state.showPopup
                                }
                            >
                                <span
                                    {...Theme(theme, 'array-key')}
                                    key={variable.name + '_' + namespace}
                                >
                                    {variable.name}
                                </span>
                                {(this.state.hovered ||
                                    this.state.showPopup) && (
                                    <AddVariable
                                        style={{
                                            cursor: 'pointer',
                                            height: '1em',
                                            width: '1em',
                                            paddingLeft: '5px'
                                        }}
                                        handleClick={e => {
                                            this.setState({
                                                popupPosition: e.target.getBoundingClientRect(),
                                                showPopup: true
                                            });
                                        }}
                                    />
                                )}
                            </StyledKeyWrapper>
                            <div {...Theme(theme, 'colon')}>:</div>
                        </>
                    ) : null
                ) : (
                    <span>
                        <StyledKeyWrapper
                            isHovered={
                                this.state.hovered || this.state.showPopup
                            }
                        >
                            <span
                                {...Theme(theme, 'object-name')}
                                class="object-key"
                                key={variable.name + '_' + namespace}
                            >
                                {!!quotesOnKeys && (
                                    <span style={{ verticalAlign: 'top' }}>
                                        "
                                    </span>
                                )}
                                <span style={{ display: 'inline-block' }}>
                                    {variable.name}
                                </span>
                                {!!quotesOnKeys && (
                                    <span style={{ verticalAlign: 'top' }}>
                                        "
                                    </span>
                                )}
                            </span>
                            {(this.state.hovered || this.state.showPopup) && (
                                <AddVariable
                                    style={{
                                        cursor: 'pointer',
                                        height: '1em',
                                        width: '1em',
                                        paddingLeft: '5px'
                                    }}
                                    handleClick={e => {
                                        this.setState({
                                            popupPosition: e.target.getBoundingClientRect(),
                                            showPopup: true
                                        });
                                    }}
                                />
                            )}
                        </StyledKeyWrapper>
                        <span {...Theme(theme, 'colon')}>:</span>
                    </span>
                )}
                <div
                    class="variable-value"
                    onClick={
                        onSelect === false && onEdit === false
                            ? null
                            : e => {
                                  let location = [...namespace];
                                  if (
                                      (e.ctrlKey || e.metaKey) &&
                                      onEdit !== false
                                  ) {
                                      this.prepopInput(variable);
                                  } else if (onSelect !== false) {
                                      location.shift();
                                      onSelect({
                                          ...variable,
                                          namespace: location
                                      });
                                  }
                              }
                    }
                    {...Theme(theme, 'variableValue', {
                        cursor: onSelect === false ? 'default' : 'pointer'
                    })}
                >
                    {this.getValue(variable, editMode)}
                </div>
                {enableClipboard ? (
                    <CopyToClipboard
                        rowHovered={this.state.hovered}
                        hidden={editMode}
                        src={variable.value}
                        clickCallback={enableClipboard}
                        {...{ theme, namespace: [...namespace, variable.name] }}
                    />
                ) : null}
                {onEdit !== false && editMode == false
                    ? this.getEditIcon()
                    : null}
                {onDelete !== false && editMode == false
                    ? this.getRemoveIcon()
                    : null}
                {this.state.showPopup && (
                    <VariablePopup
                        position={this.state.popupPosition}
                        onClickAway={() => {
                            this.setState({
                                popupPosition: {},
                                showPopup: false,
                                hovered: false
                            });
                        }}
                        onCancel={() => {
                            this.setState({
                                popupPosition: {},
                                showPopup: false,
                                hovered: false
                            });
                        }}
                        onSubmit={key => {
                            let str = '';
                            let prevType = namespaceVariable[0].type;
                            namespaceVariable.forEach((item, index) => {
                                str +=
                                    item.type === 'object'
                                        ? `${item.name}.`
                                        : `${item.name}[`;
                                if (
                                    prevType === 'array' &&
                                    item.type === 'object'
                                ) {
                                    str = str.substring(0, str.length - 1);
                                    str += '].';
                                } else if (
                                    prevType === 'array' &&
                                    item.type === 'array'
                                ) {
                                    str = str.substring(0, str.length - 1);
                                    str += index === 0 ? '[' : '][';
                                } else if (prevType === 'array') str += ']';
                                prevType = item.type;
                            });
                            str += variable.name;
                            if (prevType === 'array') str += ']';
                            onVariableAdd(key, str);
                            this.setState({
                                popupPosition: {},
                                showPopup: false,
                                hovered: false
                            });
                        }}
                    />
                )}
            </div>
        );
    }

    getEditIcon = () => {
        const { variable, theme } = this.props;

        return (
            <div
                class="click-to-edit"
                style={{
                    verticalAlign: 'top',
                    display: this.state.hovered ? 'inline-block' : 'none'
                }}
            >
                <Edit
                    class="click-to-edit-icon"
                    {...Theme(theme, 'editVarIcon')}
                    onClick={() => {
                        this.prepopInput(variable);
                    }}
                />
            </div>
        );
    };

    prepopInput = variable => {
        if (this.props.onEdit !== false) {
            const stringifiedValue = stringifyVariable(variable.value);
            const detected = parseInput(stringifiedValue);
            this.setState({
                editMode: true,
                editValue: stringifiedValue,
                parsedInput: {
                    type: detected.type,
                    value: detected.value
                }
            });
        }
    };

    getRemoveIcon = () => {
        const { variable, namespace, theme, rjvId } = this.props;

        return (
            <div
                class="click-to-remove"
                style={{
                    verticalAlign: 'top',
                    display: this.state.hovered ? 'inline-block' : 'none'
                }}
            >
                <Remove
                    class="click-to-remove-icon"
                    {...Theme(theme, 'removeVarIcon')}
                    onClick={() => {
                        dispatcher.dispatch({
                            name: 'VARIABLE_REMOVED',
                            rjvId: rjvId,
                            data: {
                                name: variable.name,
                                namespace: namespace,
                                existing_value: variable.value,
                                variable_removed: true
                            }
                        });
                    }}
                />
            </div>
        );
    };

    getValue = (variable, editMode) => {
        const type = editMode ? false : variable.type;
        const { props } = this;
        switch (type) {
            case false:
                return this.getEditInput();
            case 'string':
                return <JsonString value={variable.value} {...props} />;
            case 'integer':
                return <JsonInteger value={variable.value} {...props} />;
            case 'float':
                return <JsonFloat value={variable.value} {...props} />;
            case 'boolean':
                return <JsonBoolean value={variable.value} {...props} />;
            case 'function':
                return <JsonFunction value={variable.value} {...props} />;
            case 'null':
                return <JsonNull {...props} />;
            case 'nan':
                return <JsonNan {...props} />;
            case 'undefined':
                return <JsonUndefined {...props} />;
            case 'date':
                return <JsonDate value={variable.value} {...props} />;
            case 'regexp':
                return <JsonRegexp value={variable.value} {...props} />;
            default:
                // catch-all for types that weren't anticipated
                return (
                    <div class="object-value">
                        {JSON.stringify(variable.value)}
                    </div>
                );
        }
    };

    getEditInput = () => {
        const { theme } = this.props;
        const { editValue } = this.state;

        return (
            <div>
                <AutosizeTextarea
                    type="text"
                    inputRef={input => input && input.focus()}
                    value={editValue}
                    class="variable-editor"
                    onChange={event => {
                        const value = event.target.value;
                        const detected = parseInput(value);
                        this.setState({
                            editValue: value,
                            parsedInput: {
                                type: detected.type,
                                value: detected.value
                            }
                        });
                    }}
                    onKeyDown={e => {
                        switch (e.key) {
                            case 'Escape': {
                                this.setState({
                                    editMode: false,
                                    editValue: ''
                                });
                                break;
                            }
                            case 'Enter': {
                                if (e.ctrlKey || e.metaKey) {
                                    this.submitEdit(true);
                                }
                                break;
                            }
                        }
                        e.stopPropagation();
                    }}
                    placeholder="update this value"
                    minRows={2}
                    {...Theme(theme, 'edit-input')}
                />
                <div {...Theme(theme, 'edit-icon-container')}>
                    <Remove
                        class="edit-cancel"
                        {...Theme(theme, 'cancel-icon')}
                        onClick={() => {
                            this.setState({ editMode: false, editValue: '' });
                        }}
                    />
                    <CheckCircle
                        class="edit-check string-value"
                        {...Theme(theme, 'check-icon')}
                        onClick={() => {
                            this.submitEdit();
                        }}
                    />
                    <div>{this.showDetected()}</div>
                </div>
            </div>
        );
    };

    submitEdit = submit_detected => {
        const { variable, namespace, rjvId } = this.props;
        const { editValue, parsedInput } = this.state;
        let new_value = editValue;
        if (submit_detected && parsedInput.type) {
            new_value = parsedInput.value;
        }
        this.setState({
            editMode: false
        });
        dispatcher.dispatch({
            name: 'VARIABLE_UPDATED',
            rjvId: rjvId,
            data: {
                name: variable.name,
                namespace: namespace,
                existing_value: variable.value,
                new_value: new_value,
                variable_removed: false
            }
        });
    };

    showDetected = () => {
        const { theme, variable, namespace, rjvId } = this.props;
        const { type, value } = this.state.parsedInput;
        const detected = this.getDetectedInput();
        if (detected) {
            return (
                <div>
                    <div {...Theme(theme, 'detected-row')}>
                        {detected}
                        <CheckCircle
                            class="edit-check detected"
                            style={{
                                verticalAlign: 'top',
                                paddingLeft: '3px',
                                ...Theme(theme, 'check-icon').style
                            }}
                            onClick={() => {
                                this.submitEdit(true);
                            }}
                        />
                    </div>
                </div>
            );
        }
    };

    getDetectedInput = () => {
        const { parsedInput } = this.state;
        const { type, value } = parsedInput;
        const { props } = this;
        const { theme } = props;

        if (type !== false) {
            switch (type.toLowerCase()) {
                case 'object':
                    return (
                        <span>
                            <span
                                style={{
                                    ...Theme(theme, 'brace').style,
                                    cursor: 'default'
                                }}
                            >
                                {'{'}
                            </span>
                            <span
                                style={{
                                    ...Theme(theme, 'ellipsis').style,
                                    cursor: 'default'
                                }}
                            >
                                ...
                            </span>
                            <span
                                style={{
                                    ...Theme(theme, 'brace').style,
                                    cursor: 'default'
                                }}
                            >
                                {'}'}
                            </span>
                        </span>
                    );
                case 'array':
                    return (
                        <span>
                            <span
                                style={{
                                    ...Theme(theme, 'brace').style,
                                    cursor: 'default'
                                }}
                            >
                                {'['}
                            </span>
                            <span
                                style={{
                                    ...Theme(theme, 'ellipsis').style,
                                    cursor: 'default'
                                }}
                            >
                                ...
                            </span>
                            <span
                                style={{
                                    ...Theme(theme, 'brace').style,
                                    cursor: 'default'
                                }}
                            >
                                {']'}
                            </span>
                        </span>
                    );
                case 'string':
                    return <JsonString value={value} {...props} />;
                case 'integer':
                    return <JsonInteger value={value} {...props} />;
                case 'float':
                    return <JsonFloat value={value} {...props} />;
                case 'boolean':
                    return <JsonBoolean value={value} {...props} />;
                case 'function':
                    return <JsonFunction value={value} {...props} />;
                case 'null':
                    return <JsonNull {...props} />;
                case 'nan':
                    return <JsonNan {...props} />;
                case 'undefined':
                    return <JsonUndefined {...props} />;
                case 'date':
                    return <JsonDate value={new Date(value)} {...props} />;
            }
        }
    };
}

//export component
export default VariableEditor;
