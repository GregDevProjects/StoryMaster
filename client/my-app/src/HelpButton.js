import React from "react";
import Icon from '@material-ui/core/Icon';
import { loadCSS } from 'fg-loadcss/src/loadCSS';
import Fab from '@material-ui/core/Fab';



export default class HelpButton extends React.Component {

    constructor(props) {
        super(props);
        this.fontAwesomeIcon = props.fontAwesomeIcon;
        this.position = props.position;
        this.onClick = props.onClick;
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
            onClick= { () => {this.onClick()} }
            style={{
                float:"right",
                margin: 0,
                top: 'auto',
                right: this.position == 'right' ? 20 : 'auto',
                bottom: 20,
                left: this.position == 'left' ? 20 : 'auto',
                position: 'fixed',
            }}
        >
            <Icon
                className={ this.fontAwesomeIcon }
                color="inherit"
                fontSize="default"
            />
        </Fab>
        );
    }
}
//fas fa-list-ol (score)
//fas fa-book (book)
