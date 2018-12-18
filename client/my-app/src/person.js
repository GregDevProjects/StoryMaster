import React from "react";
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardContent';


export default function Person(props) {
    return(
        <Card>
            <CardHeader>
                {props.stats.name}
            </CardHeader>

            <CardContent>
                {JSON.stringify(props.stats)}
            </CardContent>
        </Card>
    )

}

function ExpandButton() {

}