import React from "react";
import HelpButton from './HelpButton'
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

export default class NameScreen extends React.Component {

    constructor(props) {
        super(props);
        //TODO: pass page description as a prop
    }

    render() {

        return (
            <React.Fragment>
                <CircularProgress
                    size={20}
                />

                <Typography
                    style={{
                        display: "inline-block",
                        marginLeft: "10px",
                        position: "relative",
                        fontSize: "20px",
                        bottom: "3px"
                    }}
                >
                    connecting
                </Typography>
                <Grid
                    container
                    justify="center"
                    alignItems="center"
                >
                <TextField
                    required
                    id="outlined-required"
                    label="Name"
                    margin="normal"
                    variant="outlined"
                    style={{
                        marginTop: "40px"
                    }}
                />
                </Grid>
                <Grid
                    container
                    justify="center"
                    alignItems="center"
                >
                <Button
                    variant="contained"
                    color="primary"
                    style={{marginTop: 24, marginBottom: 10}}
                    onClick={()=>{
                        this.props.changePage('NameScreen');
                    }}
                    disabled 
                >
                        FIND GAME
                    </Button>

                </Grid>
                <HelpButton/>
            </React.Fragment>
        );
    }
}
