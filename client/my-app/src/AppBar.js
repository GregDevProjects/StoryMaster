import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu'
import SearchIcon from '@material-ui/icons/Search';
import MoreIcon from '@material-ui/icons/MoreVert';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';






export default class NavBar extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            expanded: false,
        }

    }

    handleClick = function(event) {
        this.setState({ anchorEl: event.currentTarget });
    }.bind(this);

    handleClose = function(event) {
        this.setState({ anchorEl: null });
    }.bind(this);



    changePage = function(newPage) {
        this.handleClose(undefined);
        this.props.go(newPage)
    }

    render() {
        const { anchorEl } = this.state;
        const open = Boolean(anchorEl);

        return (
            <AppBar position="fixed" color="primary" >
                <Toolbar>
                    <IconButton color="inherit" aria-label="Open drawer">
                        <MenuIcon
                            onClick={this.handleClick}
                        />
                        <Menu
                            id="simple-menu"
                            anchorEl={anchorEl}
                            onClose={this.handleClose}
                            open={open}
                        >
                        <MenuItem
                            onClick={()=>{this.changePage('HelloWorld')}}
                        >
                        Hello World
                        </MenuItem>
                        <MenuItem
                            onClick={()=>{this.changePage('PeopleContainer')}}
                        >
                        Fetch
                        </MenuItem>
                        </Menu>
                    </IconButton>
                    <div>
                        <IconButton color="inherit">
                            <SearchIcon />
                        </IconButton>
                        <IconButton color="inherit">
                            <MoreIcon />
                        </IconButton>
                    </div>
                </Toolbar>
            </AppBar>
        )
    }
}