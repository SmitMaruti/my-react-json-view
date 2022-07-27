import React, { useRef, useState } from 'react';
import { CrossIcon, RightChevron } from '../icons';
import { useOnClickOutside } from './onClickOutsite';
import {
    Button,
    Input,
    VariablePopupContainer,
    VariablePopupWrapper
} from './VariablePopup.styled';
const WIDTH = 320;
const HEIGHT = 80;
const VariablePopup = props => {
    const { position, onClickAway, onSubmit, onCancel } = props;
    let modifiedPosition = {
        top: position.top,
        left: position.left
    };
    if (modifiedPosition.left < WIDTH / 2) {
        modifiedPosition.left = WIDTH / 2 + 20;
    }
    if (modifiedPosition.top < HEIGHT) {
        modifiedPosition.top += HEIGHT + 30;
    }
    if (window.innerWidth - modifiedPosition.left < WIDTH / 2) {
        modifiedPosition.left = window.innerWidth - WIDTH / 2;
    }
    const [keyValue, setKeyValue] = useState('');
    const ref = useRef();
    useOnClickOutside(ref, onClickAway);
    return (
        <VariablePopupContainer position={modifiedPosition} ref={ref}>
            <label>Save this variable as</label>
            <div style={{ marginTop: '4px' }}>
                <Input
                    value={keyValue}
                    onChange={e => {
                        if (e.target.value.match(/^[a-zA-Z0-9]*$/)) {
                            setKeyValue(e.target.value);
                        } else {
                            setKeyValue(keyValue);
                        }
                    }}
                />
                <Button variant="primary" onClick={() => onSubmit(keyValue)}>
                    <RightChevron height="33" width="33" />
                </Button>
                <Button
                    variant="secondary"
                    onClick={onCancel}
                    style={{ paddingBottom: 0 }}
                >
                    <CrossIcon height="16" width="16" />
                </Button>
            </div>
        </VariablePopupContainer>
    );
};

export default VariablePopup;
