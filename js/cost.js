function revenue(r)
{
    return r.reduce(function(a,b) 
    {
        return a.deliveryFee+b.deliveryFee
    })
}

function profit(input)
{
    profit = revenue(r) - input.length * 50;
    for (i = 0; i < input.length; i++) {
        for (j = 0; j < input[i].actions.length; j++) {
            if (input[i].actions[j].action == 'drive')
                profit--;
        }
        console.log(profit);
    }
    return profit;
}

function waitTime(input)
{
    wait_t = 0;
    for (i = 0; i < input.length; i++) {
        wait_t += input[i].actions.length - 1;
        console.log(wait_t);
    }
    return wait_t
}


