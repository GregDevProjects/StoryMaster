import React from "react";
import Person from  './person';
import Grid from '@material-ui/core/Grid';

export default class PeopleContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            people : []
        }

    }

    componentDidMount() {
        console.log('fetching data')
        fetch('https://swapi.co/api/people/')
            .then(res => {
                console.warn(res.status, 'Use res.status to check if the request was successful')
                return res.json();
            }).then(data => {
            this.setState({people : data.results});
        })
    }



    render() {
        return(
            <div>
                <Grid
                    container

                >

                        {this.state.people.map((item, index) => (
                            <Grid item xs={12}>
                                <Person key={index} stats={item}/>
                            </Grid>
                        ))}

                </Grid>
            </div>
        )
    }

}