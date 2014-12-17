$(function () {
    window.updateScores = function() {
        var topResults = {
            slalom: 0,
            tricks: 0,
            jump: 0
        };

        var saveTopResults = function () {
            window.teams.each(function (team) {
                team.getPlayers().each(function (player) {
                    var playerSlalomResult = player.getSlalomResult();
                    if (playerSlalomResult > topResults.slalom) topResults.slalom = playerSlalomResult;

                    var playerTricksResult = player.getTricksResult();
                    if (playerTricksResult > topResults.tricks) topResults.tricks = playerTricksResult;

                    var playerJumpResult = player.getJumpResult();
                    if (playerJumpResult > topResults.jump) topResults.jump = playerJumpResult;
                });
            });
        };

        var updateScoresForPlayersAndTeams = function() {
            window.teams.each(function(team) {
                team.getPlayers().each(function(player) {
                    updateScoresForPlayer(player);
                });

                updateScoresForTeam(team);
            });
        };

        var updateScoresForPlayer = function(player) {
            var playerSlalomScore = topResults.slalom == 0 ? 0 : ((player.getSlalomResult() * 1000) / topResults.slalom);
            player.setSlalomScore(Math.round(playerSlalomScore * 100) / 100);

            var playerTricksScore = topResults.tricks == 0 ? 0 : ((player.getTricksResult() * 1000) / topResults.tricks);
            player.setTricksScore(Math.round(playerTricksScore * 100) / 100);

            // Men : ((skiers best event score minus 25m) x 1000) / (Best Overall Skiers score minus 25m)
            // Women : ((skiers best event score minus 17m) x 1000) / (Best Overall Skiers score minus 17m)
            var metersMinus = player.getGender() === 'M' ? 25 : 17;
            var playerJumpResultWithNegative = ((player.getJumpResult() - metersMinus) * 1000) / (topResults.jump - metersMinus);
            // A skiers overall score in jumping shall not be reduced below zero.
            var playerJumpResult = (playerJumpResultWithNegative < 0 || _.isNaN(playerJumpResultWithNegative) || player.getJumpResult() == 0) ? 0 : playerJumpResultWithNegative;
            player.setJumpScore(Math.round(playerJumpResult * 100) / 100);

            player.setOverallScore(player.getSlalomScore() + player.getTricksScore() + player.getJumpScore());
        };

        var updateScoresForTeam = function(team) {
            // sorting by scores
            var teamPlayersSlalomSorted = _.sortBy(team.getPlayers().models, function(player) { return - player.getSlalomScore(); });
            var teamPlayersTricksSorted = _.sortBy(team.getPlayers().models, function(player) { return - player.getTricksScore(); });
            var teamPlayersJumpSorted = _.sortBy(team.getPlayers().models, function(player) { return - player.getJumpScore(); });

            // finding scoring and not scoring players
            var teamPlayersSlalomScoring = teamPlayersSlalomSorted.slice(0, 3);
            var teamPlayersSlalomNotScoring = teamPlayersSlalomSorted.slice(3);
            var teamPlayersTricksScoring = teamPlayersTricksSorted.slice(0, 3);
            var teamPlayersTricksNotScoring = teamPlayersTricksSorted.slice(3);
            var teamPlayersJumpScoring = teamPlayersJumpSorted.slice(0, 3);
            var teamPlayersJumpNotScoring = teamPlayersJumpSorted.slice(3);

            // setting info to players to light up scoring players on view
            _.each(teamPlayersSlalomScoring, function(player) { player.setIsSlalomInTeamScore(true); });
            _.each(teamPlayersSlalomNotScoring, function(player) { player.setIsSlalomInTeamScore(false); });
            _.each(teamPlayersTricksScoring, function(player) { player.setIsTricksInTeamScore(true); });
            _.each(teamPlayersTricksNotScoring, function(player) { player.setIsTricksInTeamScore(false); });
            _.each(teamPlayersJumpScoring, function(player) { player.setIsJumpInTeamScore(true); });
            _.each(teamPlayersJumpNotScoring, function(player) { player.setIsJumpInTeamScore(false); });

            // setting scores to teams
            team.setSlalomScore(_.reduce(teamPlayersSlalomScoring, function(sum, player){ return sum + player.getSlalomScore(); }, 0));
            team.setTricksScore(_.reduce(teamPlayersTricksScoring, function(sum, player){ return sum + player.getTricksScore(); }, 0));
            team.setJumpScore(_.reduce(teamPlayersJumpScoring, function(sum, player){ return sum + player.getJumpScore(); }, 0));
            team.setOverallScore(team.getSlalomScore() + team.getTricksScore() + team.getJumpScore());
        };


        $(function () {
            saveTopResults();
            updateScoresForPlayersAndTeams();
        });

    };
});