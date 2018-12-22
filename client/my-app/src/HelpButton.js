import React from "react";
import Icon from '@material-ui/core/Icon';
import { loadCSS } from 'fg-loadcss/src/loadCSS';
import Fab from '@material-ui/core/Fab';

export default class HelpButton extends React.Component {

    constructor(props) {
        super(props);
        //TODO: pass page description as a prop
    }

    componentDidMount() {
        loadCSS(
          'https://use.fontawesome.com/releases/v5.1.0/css/all.css',
          document.querySelector('#insertion-point-jss'),
        );
    }

    render() {

        return (
            <Fab
            size="medium" 
            color="secondary"
            style={{
            float:"right",
            margin: 0,
            top: 'auto',
            right: 20,
            bottom: 20,
            left: 'auto',
            position: 'fixed'
        }}
        >
            <Icon
                className={'fas fa-question'}
                color="inherit"
                fontSize="default"
            />
        </Fab>
        );
    }
}