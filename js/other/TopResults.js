$(function () {
    window.updateScores = function() {
        var topResults = {
            slalom: 0,
            tricks: 0,
            jump: 0
        };

        // saving tops
        window.teams.each(function(team) {
            team.getPlayers().each(function(player) {
                var playerSlalomResult = player.getSlalomResult();
                if (playerSlalomResult > topResults.slalom) topResults.slalom = playerSlalomResult;

                var playerTricksResult = player.getTricksResult();
                if (playerTricksResult > topResults.tricks) topResults.tricks = playerTricksResult;

                var playerJumpResult = player.getJumpResult();
                if (playerJumpResult > topResults.jump) topResults.jump = playerJumpResult;
            });
        });

        // updating results for players
        window.teams.each(function(team) {
            team.getPlayers().each(function(player) {
                var playerSlalomScore = (player.getSlalomResult() * 1000) / topResults.slalom;
                player.setSlalomScore(Math.round(playerSlalomScore * 100) / 100);

                var playerTricksScore = (player.getTricksResult() * 1000) / topResults.tricks;
                player.setTricksScore(Math.round(playerTricksScore * 100) / 100);

                // Men : ((skiers best event score minus 25m) x 1000) / (Best Overall Skiers score minus 25m)
                // Women : ((skiers best event score minus 17m) x 1000) / (Best Overall Skiers score minus 17m)
                var metersMinus = player.getGender() === 'M' ? 25 : 17;
                var playerJumpResultWithNegative = ((player.getJumpResult() - metersMinus) * 1000) / (topResults.jump - metersMinus);
                // A skiers overall score in jumping shall not be reduced below zero.
                var playerJumpResult = (playerJumpResultWithNegative > 0) ? playerJumpResultWithNegative : 0;
                player.setJumpScore(Math.round(playerJumpResult * 100) / 100);
            });
        });
    };
});