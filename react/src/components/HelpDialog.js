import React from "react";
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import { loadCSS } from 'fg-loadcss/src/loadCSS';
import Icon from '@material-ui/core/Icon';
import Grid from '@material-ui/core/Grid';

export default function HelpDialog(props) {
    const open = props.open;
    const close = props.close;

    loadCSS(
        'https://use.fontawesome.com/releases/v5.1.0/css/all.css',
        document.querySelector('#insertion-point-jss'),
    );

    return (
        <Dialog
            fullScreen={false}
            open={open}
            onClose={close}
            aria-labelledby="responsive-dialog-title"
        >
            <DialogContent>


                <Grid
                    container
                    justify="center"
                    alignItems="center"
                >
                    <Grid
                        item
                        style={{ textAlign: 'center' }}
                        xs={12}
                    >
                        <DialogContentText
                            style={{ marginBottom: "28px"}}
                        >
                                Story Master is a game of competitive creative writing
                        </DialogContentText>
                    </Grid>
                    <Grid                      
                        item
                        style={{ textAlign: 'center' }}
                        xs={12}
                    >
                        <DialogContentText>
                            <b>Write</b> how the story should start
                        </DialogContentText>
                        <Icon
                            className={'fas fa-arrow-down'} 
                            color="primary"
                            style={{fontSize: "50px"}}
                        />
                    </Grid>
                    <Grid                      
                        item
                        style={{ textAlign: 'center' }}
                        xs={12}
                    >
                        <DialogContentText>
                            <b>Vote</b> for your favorite writing
                        </DialogContentText>
                        <Icon
                            className={'fas fa-arrow-down'} 
                            color="primary"
                            style={{fontSize: "50px"}}
                        />
                    </Grid>
                    <Grid                      
                        item
                        style={{ textAlign: 'center' }}
                        xs={12}
                    >
                        <DialogContentText>
                            Repeat until the story is finished, get the most votes to <b>win</b>
                        </DialogContentText>
                    </Grid>
                </Grid>

            </DialogContent>
        </Dialog>
    )
}