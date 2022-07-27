import styled from 'styled-components';

export const VariablePopupContainer = styled.div`
    position: fixed;
    top: ${props => (props.position.top ? `${props.position.top}px` : '0')};
    left: ${props => (props.position.left ? `${props.position.left}px` : '0')};
    transform: translate(-50%, -110%);
    background-color: white;
    padding: 10px;
    box-shadow: 0 2px 20px 0 #afb2b3;
    border-radius: 4px;
    width: 300px;
    & > div {
        display: flex;
        justify-content: space-between;
    }
    z-index: 999999;
`;

export const Input = styled.input`
    color: #000000;
    border: 1px solid #858585;
    padding: 12px 7px 9px 9px;
    font-size: 15px;
    background: #ffffff;
    font-weight: normal;
    font-family: 'CircularStd-Book';
    line-height: normal;
    border-radius: 3px;
    outline: none;
    &:hover {
        border: 1px solid #2a7cff;
    }
    &:focus {
        border: 1px solid #2a7cff;
        box-shadow: 0px 0px 0 2px #2a7cff29;
    }
`;

export const Button = styled.div`
    border: solid 1px
        ${props => (props.variant === 'primary' ? '#2a7cff' : '#fafafa')};
    background-color: ${props =>
        props.variant === 'primary' ? '#2a7cff' : '#fafafa'};
    color: ${props => (props.variant === 'primary' ? '#fff' : '#101010')};
    width: 40px;
    height: 40px;
    border-radius: 4px;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    padding-bottom: 5px;
    box-sizing: border-box;
`;
