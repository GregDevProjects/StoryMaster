import React from "react";
import Drawer from '@material-ui/core/Drawer';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Badge from '@material-ui/core/Badge';

const StyledDrawer = withStyles({
    paper: {
        width: '30%',
    }
    })(Drawer);

    // 0: {name: "asd", score: 1}
    // 1: {name: "b", score: 2}

const StyledBadge = withStyles({
    badge: {
        position: 'relative',
        left: '3px'
    }
    })(Badge);

    export default function ScoreDrawer(props) {
       const open = props.open;
       const scores = props.scores;
       const close = props.close;
        return(  
            <StyledDrawer
                open={open}
                onClose={() => {close()}}
                anchor="right"
            >
                <div style={{height:"20px"}}></div>
                <NamesWithScores scores={ scores } />
        
            </StyledDrawer>
        )
    }

    function NamesWithScores(props) {
        if (
            !props ||
            !props.scores
            ) {
            return <div></div>;
        }
        const scores = props.scores.map((result, index) => 
        <div
            key={index}
            style={{
                marginBottom: "20px",
                marginLeft:"10px"
            }}
        >
            <StyledBadge
                color="primary"
                badgeContent={result.score}
            >
                <Typography>
                    <label>{result.name}</label>
                </Typography> 
            </StyledBadge>
        </div>
        )
        return (
            <React.Fragment>
                {scores}
            </React.Fragment>
        ) 
    }