<!-- App.svelte -->
<script>
  import Board from './components/Board.svelte';
  import ScoreDisplay from './components/ScoreDisplay.svelte';

  // Key: team name, value: score
  let teams = {};
  let currentPoints = 0

  function updateScore(team, points) {
    teams[team] += points;
  }
  function updatePoints(points){
    currentPoints = points
}


  function addTeam() {
    const teamName = window.prompt('Enter team name:');
    if (teamName) {
      teams[teamName] = 0;
    }
  }
</script>

<main>
  <Board {updatePoints} {addTeam}/>
  <ScoreDisplay {teams} {updateScore} {currentPoints}/>
</main>

<style>
  /* Add global styling for the app */
</style>
