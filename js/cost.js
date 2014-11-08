function revenue(r)
{
    return r.reduce(function(a,b) 
    {
        return a.deliveryFee+b.deliveryFee
    })
}

function numOfCars(revenue)
{
    //For every $400 we are getting, send 1 car
    return Math.floor(revenue / 400) + 1;
}


