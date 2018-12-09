// var url = "https://statsapi.web.nhl.com/api/v1/schedule?expand=schedule.teams,schedule.linescore,schedule.broadcasts,schedule.ticket,schedule.game.content.media.epg&leaderCategories=&site=en_nhl&teamId=12";
// var url = "https://statsapi.web.nhl.com/api/v1/schedule?startDate=2018-11-28&endDate=2018-11-28&expand=schedule.teams,schedule.linescore,schedule.broadcasts,schedule.ticket,schedule.game.content.media.epg&leaderCategories=&site=en_nhl&teamId=17";
var url = "https://statsapi.web.nhl.com/api/v1/schedule?startDate=2018-11-21&endDate=2018-11-21&expand=schedule.teams,schedule.linescore,schedule.broadcasts,schedule.ticket,schedule.game.content.media.epg&leaderCategories=&site=en_nhl&teamId=12";
var imgloc = "json_files/nhl_logos.json";
var interval = 1000;
var d = new Date();

$(document).ready(function () {
//	$('#tabs').tabs();
//	$("#accordion").accordion();

    $('.slideshow').cycle({
        fx: 'fade'
    });

    $.ajax({
        url: imgloc,
        dataType: "data",
        success: function (data) {
            console.log(data);
        }
    });



    var away_name = "";
    var home_name = "";
    var away_score = 0;
    var home_score = 0;
    var away_shots = 0;
    var home_shots = 0;
    $.getJSON(url, function(data) {
        console.log("Loading Document weeee");
        consumeJSON("json_files/nhl_logos.json", data.dates[0].games[0].teams.away.team.id, data.dates[0].games[0].teams.home.team.id);

        if (data.dates[0].games[0].status.codedGameState === "1") {
            $('.crop').css('display', 'inline-block');
            $('.scorebug').css('display', 'none');

            away_name = "<strong>" + data.dates[0].games[0].teams.away.team.teamName + "</strong>";
            home_name = "<strong>" + data.dates[0].games[0].teams.home.team.teamName + "</strong>";

            $("#away_name").html(away_name);
            $("#home_name").html(home_name);

            away_score = data.dates[0].games[0].teams.away.score;
            home_score = data.dates[0].games[0].teams.home.score;

            $("#away_score").html(away_score);
            $("#home_score").html(home_score);

            let time = "";

            if (( data.dates[0].games[0].status.statusCode == 3 ) || ( data.dates[0].games[0].status.statusCode == 4 )) {
                time = "<b>" + data.dates[0].games[0].linescore.currentPeriodOrdinal + "</b> <i>" + data.dates[0].games[0].linescore.currentPeriodTimeRemaining + "</i>";
            } else if ( data.dates[0].games[0].status.statusCode == 7 ) {
                time = "<b>Final</b>";
            } else if (( data.dates[0].games[0].status.statusCode == 1 ) || ( data.dates[0].games[0].status.statusCode == 2 )) {
                var date = new Date(data.dates[0].games[0].gameDate);
                time = "<br><br>" + formatDate(date);
            }

            $("#time").html(time);
        } else {
            $('.crop').css('display', 'none');
            $('.scorebug').css('display', 'inline-block');

            let away_loc = "images/scorebug/team" + String(data.dates[0].games[0].teams.away.team.id) + ".png";
            let home_loc = "images/scorebug/team" + String(data.dates[0].games[0].teams.home.team.id) + ".png";

            $("#away").attr('src', away_loc);
            $("#home").attr('src', home_loc);

            if (0 < data.dates[0].games[0].linescore.currentPeriod < 4) {
                let score_per = "images/scorebug/time_" + String(data.dates[0].games[0].linescore.currentPeriod) + ".png";
                if (data.dates[0].games[0].linescore.currentPeriodTimeRemaining = "Final") {
                    score_per = "images/scorebug/time_f.png";
                    $("#score-period").attr('src', score_per);
                    $("#time_p").text("");
                } else {
                    $("#score-period").attr('src', score_per);
                    $("#time_p").text(String(data.dates[0].games[0].linescore.currentPeriodTimeRemaining));
                }

            }
            $("#home-score").text(String(data.dates[0].games[0].linescore.teams.home.goals));
            $("#home-shots").text(String(data.dates[0].games[0].linescore.teams.home.shotsOnGoal));
            $("#away-score").text(String(data.dates[0].games[0].linescore.teams.away.goals));
            $("#away-shots").text(String(data.dates[0].games[0].linescore.teams.away.shotsOnGoal));
        }
    });
}); // end ready

function consumeJSON(jsonFileURL, away, home) {
    $.ajax({
        url: jsonFileURL,
        dataType: "text",
        success: function (data) {
            var json = $.parseJSON(data);
            console.log(json.nhl[0]);
            for (i in json.nhl[0]) {
                if (i == away) {
                    $("#away_image").attr('src', json.nhl[0][i]);
                }
                if (i == home) {
                    $("#home_image").attr('src', json.nhl[0][i]);
                }
            }
        }
    });
}

var time;
var count = -1;
var formated_time;
var real_time;
setInterval(function() {
    $.getJSON(url, function(data) {
        if (( data.dates[0].games[0].status.statusCode == 3 ) || ( data.dates[0].games[0].status.statusCode == 4 )) {
            let away_loc = "images/scorebug/team" + String(data.dates[0].games[0].teams.away.team.id) + ".png";
            let home_loc = "images/scorebug/team" + String(data.dates[0].games[0].teams.home.team.id) + ".png";

            $("#away").attr('src', away_loc);
            $("#home").attr('src', home_loc);

            let score_per = "images/scorebug/time_" + String(data.dates[0].games[0].linescore.currentPeriod) + ".png";
            if (data.dates[0].games[0].linescore.currentPeriodTimeRemaining = "Final") {
                score_per = "images/scorebug/time_f.png";
                $("#score-period").attr('src', score_per);
                $("#time_p").text("");
            } else {
                $("#score-period").attr('src', score_per);
                $("#time_p").text(String(data.dates[0].games[0].linescore.currentPeriodTimeRemaining));
            }

            $("#home-score").text(String(data.dates[0].games[0].linescore.teams.home.goals));
            $("#home-shots").text(String(data.dates[0].games[0].linescore.teams.home.shotsOnGoal));
            $("#away-score").text(String(data.dates[0].games[0].linescore.teams.away.goals));
            $("#away-shots").text(String(data.dates[0].games[0].linescore.teams.away.shotsOnGoal));
        }

    });
}, interval);

function formatDate(date) {
    var monthNames = [
        "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
    ];

    var day = date.getDate();
    var monthIndex = date.getMonth();
    var year = date.getFullYear();

    var hour = date.getHours();
    var min = date.getMinutes();
    var m = "";
    if ( hour > 12 ) {
        hour -= 12;
        m = "pm";
    } else {
        m = "am";
        if ( hour == 0 ) {
            hour = 12;
        }
    }

    return "<b>" + monthNames[monthIndex] + ' ' + day + ', ' + year + '</b> <i>at</i> <b>' + hour + ':' + min + "</b>" + m;
}