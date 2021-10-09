import React from "react";
import { Card, CardContent, Typography } from "@material-ui/core";
import './InfoBox.css';


function InfoBox({ title, cases, total, active, isRed, ...props }) {
  return (
    <Card 
    onClick={props.onClick}
    //according to BEM, (--) is when we modify an element
    //string interpolation---> what we are doing with the className, we add a property to influence styling:
    className={`InfoBox ${active && 'infoBox--selected'} ${isRed && 'infoBox---red'}`}>
      <CardContent>
        <Typography className="InfoBox__title" color="textSecondary">{title}</Typography>
        <h2 className={`InfoBox__cases ${!isRed && 'infoBox__cases---green'}`}>{cases}</h2>
        <Typography className="InfoBox__total" color="textSecondary">
            {total} Total
        </Typography>
      </CardContent>
    </Card>
  );
}

export default InfoBox;
