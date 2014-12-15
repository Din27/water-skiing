$(function () {
    window.updateScores = function() {
        var topResults = {
            slalom: 0,
            tricks: 0,
            jump: 0
        };

        window.teams.each(function(team) {
            team.getPlayers().each(function(player) {
                var playerSlalomResult = player.getSlalomResult();
                if (playerSlalomResult > topResults.slalom) topResults.slalom = playerSlalomResult;
                //    todo trick jump
            });
        });

        window.teams.each(function(team) {
            team.getPlayers().each(function(player) {
                var playerSlalomScore = (player.getSlalomResult() * 1000) / topResults.slalom;
                player.setSlalomScore(Math.round(playerSlalomScore * 100) / 100);
            });
        });
    };
});