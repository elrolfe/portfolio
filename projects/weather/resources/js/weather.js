$(document).ready(function() {
    $.getJSON("//freegeoip.net/json/?callback=?", function(data) {
        var apiURL = "//api.apixu.com/v1/current.json?key=a8ae7f2a7aca446181d14511161508&q=" + data.latitude + "," + data.longitude;
        $.getJSON(apiURL, function(weather) {
            console.log(weather)
            $("#location").text(data.city + ", " + data.region_name);
            $("#conditions").html("<img src=\"" + weather.current.condition.icon + "\">");
            $("#conditions-text").text(weather.current.condition.text);
            $("#temp-value-f").html(weather.current.temp_f + "<i class=\"wi wi-fahrenheit\"></i>");
            $("#temp-value-c").html(weather.current.temp_c + "<i class=\"wi wi-celsius\"></i>");
            
            $(".loading").hide();
            $(".weather").show();
        });
    });
        
    $("#temp-scale").change(function() {
        if ($("#temp-scale").prop("checked")) {
            $(".fahrenheit").css("display", "none");
            $(".celsius").css("display", "inline");
        } else {
            $(".fahrenheit").css("display", "inline");
            $(".celsius").css("display", "none");
        }
    });
});