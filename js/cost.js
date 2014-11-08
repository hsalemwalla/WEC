function revenue(r)
{
    return r.reduce(function(a,b) 
    {
        return a.deliveryFee+b.deliveryFee
    })
}

function profit(input)
{
    var obj = JSON.parse(input);
    profit = revenue(r) - obj.length * 50;
    for (i = 0; i < obj.length; i++) {
        for (j = 0; j < obj[i].actions.length; j++) {
            if (obj[i].actions[j].action == 'drive')
                profit--;
        }
        console.log(profit);
    }
    return profit;
}

function waitTime(input)
{
    var obj = JSON.parse(input);
    wait_t = 0;
    for (i = 0; i < obj.length; i++) {
        wait_t += obj[i].actions.length - 1;
        console.log(wait_t);
    }
    return wait_t
}


