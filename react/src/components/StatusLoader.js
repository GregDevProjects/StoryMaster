import React from "react";
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import LinearProgress from '@material-ui/core/LinearProgress';

export default function StatusLoader(props) {
    const percentComplete = props.percentComplete;
    const text = props.text;
    const variant = props.variant;
    const color = props.color;
    return <React.Fragment>
        <Grid
                container
                justify="center"
                alignItems="center"
            >
                <Typography
                    style={{
                        display: "inline-block",
                        marginLeft: "10px",
                        position: "relative",
                        fontSize: "20px",
                        bottom: "3px",
                        textAlign: "center"
                    }}
                >
                    {text}
                </Typography>
            </Grid>
            <LinearProgress 
                variant={variant}
                color={color}
                value={percentComplete * 100}
            />
    </React.Fragment>
}