import React from "react";
import Drawer from '@material-ui/core/Drawer';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';

const StyledDrawer = withStyles({
    paper: {
        width: '70%',
    }
    })(Drawer);

    export default function StoryDrawer(props) {
       const open = props.open;
       const story = props.story;
       const close = props.close;
        return(  
            <StyledDrawer
                open={open}
                onClose={() => {close()}}
            >

                <Typography
                    variant="h4"
                    gutterBottom
                    style={{textAlign: "center"}}
                >
                Story
                </Typography>
                <Divider />

                <Typography
                >
                   {story}
                </Typography>
                
            </StyledDrawer>
        )
    }
