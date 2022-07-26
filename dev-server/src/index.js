'use strict';

//import react and reactDom for browser rendering
import React from 'react';
import ReactDom from 'react-dom';

import Moment from 'moment';

//import the react-json-view component (installed with npm)
import JsonViewer from './../../src/js/index';

//render 2 different examples of the react-json-view component
ReactDom.render(
    <div>
        {/* just pass in your JSON to the src attribute */}
        <JsonViewer
            sortKeys
            src={getExampleJson1()}
            quotesOnKeys={false}
            collapseStringsAfterLength={12}
            name={'result'}
            enableClipboard={false}
            shouldCollapse={({ src, namespace, type }) => {
                if (type === 'array' && src.indexOf('test') > -1) {
                    return true;
                } else if (namespace.indexOf('moment') > -1) {
                    return true;
                }
                return false;
            }}
            displayDataTypes={false}
            displayObjectSize={false}
            theme={{
                base00: 'white',
                base01: '#ddd',
                base02: '#ddd',
                base03: '#000',
                base04: 'purple',
                base05: '#000',
                base06: '#000',
                base07: '#000',
                base08: '#000',
                base09: '#DF0002',
                base0A: '#ff0',
                base0B: '#3A00DC', // float
                base0C: '#000',
                base0D: '#101010', // arrow open
                base0E: '#101010', // arrow close
                base0F: '#3A00DC' // int
            }}
        />
        <br />
    </div>,
    document.getElementById('app-container')
);

/*-------------------------------------------------------------------------*/
/*     the following functions just contain test json data for display     */
/*-------------------------------------------------------------------------*/

//just a function to get an example JSON object
function getExampleJson1() {
    return {
        hello: {
            world: 'world'
        },
        array: ['zero', 'one'],
        key: 'value',
        arrayOfObjects: [{ a: 'b' }, { a: 'c' }],
        arrayOfArray: [
            ['1', '2'],
            ['3', '4'],
            [{ a: 'b' }, { x: 'z' }],
            [(['9', '10'], ['11', '12'], [1, 1.55])]
        ]
    };
    // return {
    //     string: 'this is a test string',
    //     integer: 42,
    //     empty_array: [],
    //     empty_object: {},
    //     array: [1, 2, 3, 'test'],
    //     float: -2.757,
    //     undefined_var: undefined,
    //     parent: {
    //         sibling1: true,
    //         sibling2: false,
    //         sibling3: null,
    //         isString: value => {
    //             if (typeof value === 'string') {
    //                 return 'string';
    //             } else {
    //                 return 'other';
    //             }
    //         }
    //     },
    //     string_number: '1234',
    //     date: new Date(),
    //     moment: Moment(),
    //     regexp: /[0-9]/gi
    // };
}

//and another a function to get an example JSON object
function getExampleJson2() {
    return {
        normalized: {
            '1-grams': {
                body: 1,
                testing: 1
            },
            '2-grams': {
                'testing body': 1
            },
            '3-grams': {}
        },
        noun_phrases: {
            body: 1
        },
        lemmatized: {
            '1-grams': {
                test: 1,
                body: 1
            },
            '2-grams': {
                'test body': 1
            },
            '3-grams': {}
        },
        dependency: {
            '1-grams': {
                testingVERBROOTtestingVERB: 1,
                bodyNOUNdobjtestingVERB: 1
            },
            '2-grams': {
                'testingVERBROOTtestingVERB bodyNOUNdobjtestingVERB': 1
            },
            '3-grams': {}
        }
    };
}

function getExampleJson3() {
    return {
        example_information:
            'this example has the collapsed prop set to true and the indentWidth prop is set to 8',
        default_collapsed: true,
        collapsed_array: [
            'you expanded me',
            'try collapsing and expanding the root node',
            'i will still be expanded',
            {
                leaf_node: true
            }
        ]
    };
}

function getExampleJson4() {
    const large_array = new Array(225).fill(
        'this is a large array full of items'
    );

    large_array.push(getExampleArray());

    large_array.push(new Array(75).fill(Math.random()));

    return large_array;
}

function getExampleArray() {
    return [
        'you can also display arrays!',
        new Date(),
        1,
        2,
        3,
        {
            pretty_cool: true
        }
    ];
}
