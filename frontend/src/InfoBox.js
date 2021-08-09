import React from 'react'
import { Card, CardContent, Typography } from "@material-ui/core"

function InfoBox({ title, cases, total }) {
    return (
        <Card className="infoBox">
            <CardContent>
                {/*Title Coronavirus Cases*/}
                <Typography className="infoBox__title" color="textSexondary">
                    {title}
                </Typography>

                {/*+120k Number of cases*/}
                <h2 className="infoBox__cases">{cases}</h2>

                {/*1.2M Total*/}
                <Typography className="infoBox__total" color="textSexondary">
                    {total} Total
                </Typography>
            </CardContent>
        </Card>
    )
}

export default InfoBox
