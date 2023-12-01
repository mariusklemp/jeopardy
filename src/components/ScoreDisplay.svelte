<!-- ScoreDisplay.svelte -->
<script>
    export let teams;
    export let updateScore;
    export let currentPoints;
</script>

<!-- ScoreDisplay.svelte -->
{#if Object.keys(teams).length > 0}
    <div class="teams">
        {#each Object.entries(teams) as [team, score], index}
            <div class="team">
                <div class="score-container" style="background-image: url(public/christmas-ball{index+1}.png)">
                    <p></p>
                    <p></p>
                    <p class="text">{score}</p>
                    <p class="text">{team}</p>
                    <div class="score-buttons">
                        <div>
                            <button on:click={() => updateScore(team, -currentPoints)} class="adjust-score">
                                <img src="public/minus.png" class="minus-icon" alt="a">
                            </button>
                        </div>
                        <div>
                            <button on:click={() => updateScore(team, currentPoints)} class="adjust-score">
                                <img src="public/plus.png" class="plus-icon" alt="a">
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        {/each}
    </div>
{/if}

<!-- ScoreDisplay.svelte -->
<style>
    /* Add styling for the score display */
    .teams {
        display: flex;
        justify-content: center;
        gap: 6px;
    }

    .team {
        color: black;
        font-weight: bolder;
        text-align: center;
        width: 10rem;
    }

    .score-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        background-size: 100% 100%; /* Cover the entire container */
        background-position: center;
        background-repeat: no-repeat; /* Prevent image repeating */
        height: 150px; /* Set the height as needed */
        margin: 0;
        align-content: space-evenly;
    }

    .text{
        margin-block-start: 0;
        margin-block-end: 0;
        font-weight: bolder
    }

    .score-buttons {
        display: flex;
    }

    .adjust-score {
        padding: 5px 10px;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        background-color: transparent;
        display: flex;
    }

    .plus-icon{
        height: 20px; /* Adjust the size as needed */
        width: 20px; /* Adjust the size as needed */
        margin-block-start: 0;
        margin-block-end: 0;
    }
    .minus-icon {
        height: 25px; /* Adjust the size as needed */
        width: 25px; /* Adjust the size as needed */
        margin-block-start: 0;
        margin-block-end: 0;
    }
</style>

