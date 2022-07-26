import React from 'react';
import JsonObject, { JsonVariable } from './DataTypes/Object';
import ArrayGroup from './ArrayGroup';

export default class extends React.PureComponent {
    render = () => {
        const { props } = this;
        const namespace = [props.name];
        const varType = new JsonVariable(props.name, props.src);
        const namespaceVariable = [{ name: varType.name, type: varType.type }];
        let ObjectComponent = JsonObject;

        if (
            Array.isArray(props.src) &&
            props.groupArraysAfterLength &&
            props.src.length > props.groupArraysAfterLength
        ) {
            ObjectComponent = ArrayGroup;
        }

        return (
            <div class="pretty-json-container object-container">
                <div class="object-content">
                    <ObjectComponent
                        namespace={namespace}
                        namespaceVariable={namespaceVariable}
                        depth={0}
                        jsvRoot={true}
                        {...props}
                    />
                </div>
            </div>
        );
    };
}
