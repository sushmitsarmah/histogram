$(document).ready(function () {
    $('button').click(function () {
        console.log('button click');

        $.ajax({
            url: 'gethistdata',
            success: function (result) {
                debugger;
                console.log(result);
                var hist = document.getElementById('hist');
                var obj = JSON.parse(result)

                plothist(obj.data)
                // hist.innerHTML = result;
            },
            method: 'GET'
        })
    });

    const plothist = (data) => {
        const trace = {
            x: data,
            type: 'histogram',
        };
        const datas = [trace];

        Plotly.newPlot('hist', datas);
    }

    plothist();    

/*     const slider = document.getElementById('myRange');
    const output = document.getElementById('demo');

    // Display the default slider value
    output.innerHTML = slider.value;

    // Update the current slider value (each time you drag the slider handle)
    slider.oninput = () => {
        output.innerHTML = this.value;
    }; */
});