import * as React from 'react';
import { useEffect } from 'react';
import * as ReactDom from 'react-dom';
import { Draggable } from '@syncfusion/ej2-base';

function Movable({ children, divId }) {
    // useEffect(() => {
    //     if (!divId) return
    //     let draggable = new Draggable(document.getElementById(divId), { clone: false });
    // }, [divId]);

    return (<div id='container' style={{ zIndex: 1000 }}>
        <div id={divId}>
            {children}
        </div>
    </div>);
}
export default Movable;