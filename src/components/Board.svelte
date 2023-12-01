<!-- Board.svelte -->
<script>
    import { onMount } from 'svelte';
    import { fetchQuestions } from '../QuestionService';
    export let updatePoints;
    export let addTeam;

    let data = null;
    onMount(async () => {
        data = await fetchQuestions('src/data/christmas_jeopardy_mid.csv');
    });
    //TODO: Create a way to switch dataset to src/data/jeopardy_christmas_hard.csv
    let currentAnswer = "";
    let revealAnimation = false;
    let revealTimeout = null;
    let fireworkActive = false;

    let categories = ['Julefilmer', 'Juletradisjoner', 'Julekalendere', 'Julemat', 'Diverse', "Random"];
    let boardPoints = [
        [100, 150, 200, 250, 300, 350, 400, 500],
        [100, 150, 200, 250, 300, 350, 400, 500],
        [100, 150, 200, 250, 300, 350, 400, 500],
        [100, 150, 200, 250, 300, 350, 400, 500],
        [100, 150, 200, 250, 300, 350, 400, 500],
        [100, 150, 200, 250, 300, 350, 400, 500],
    ];
    let flippedQuestions = {};

    function getQuestion(category, points) {
        return data.find(question =>
            question.Category.trim().toLowerCase() === category.trim().toLowerCase() &&
            +question.Points === points
        );
    }

    async function viewQuestion(category, points) {
        // Check if the question is already flipped
        if (flippedQuestions[category] && flippedQuestions[category][points]) {
            console.log('Question already flipped');
            return;
        }

        // Retrieve the question
        const selectedCell = await getQuestion(category, points);

        // Set answerRevealed to true to trigger the animation
        revealAnimation = false;

        // Flip the question
        flippedQuestions = {
            ...flippedQuestions,
            [category]: {
                ...flippedQuestions[category],
                [points]: {
                    flipped: true,
                    selectedCell: {
                        category,
                        points,
                        question: selectedCell.Question,
                    },
                },
            },
        };
        //Set the answer
        currentAnswer = selectedCell.Answer;
        // Call updateScore with the last selected cell and points
        updatePoints(points);
    }

    function revealAnswer() {
        // Toggle a class to trigger the animation
        revealAnimation = !revealAnimation;
    }

    function playFirework() {
        fireworkActive = true;
        setTimeout(() => {
            fireworkActive = false;
        }, 500); // Adjust the timeout to match the animation duration
    }

    function getFireworkStyles(index) {
        const position = getRandomPosition();
        const size = getRandomSize();
        const color = getRandomColor();

        return `
            top: ${position.y}px;
            left: ${position.x}px;
            width: ${size}px;
            height: ${size}px;
            background-color: ${color};
        `;
    }

    function getRandomPosition() {
        return {
            x: Math.random() * 100,
            y: Math.random() * 100,
        };
    }

    function getRandomSize() {
        return Math.floor(Math.random() * 20) + 10; // Random size between 10 and 30 pixels
    }

    function getRandomColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }
</script>

<div class="board">
    {#each categories as category, rowIndex}
        <div class="board-row">
            <strong class="category">{category}</strong>
            {#each boardPoints[rowIndex] as point, cellIndex}
                {#if flippedQuestions[category] && flippedQuestions[category][point]}
                    <div class="board-cell flipped" style="background-color: #313c33;">
                        <div class="flipped-content">
                            <p>{flippedQuestions[category][point].selectedCell.question}</p>
                        </div>
                    </div>
                {:else}
                    <div class="board-cell" style="background-color: #7e0f12;" on:click={() => viewQuestion(category, point)}>
                        <!-- Display point value -->
                        {point}
                    </div>
                {/if}
            {/each}
        </div>
    {/each}

    <button on:click={addTeam} class="team-button">Add Team</button>
    <!-- Add a button to reveal the answer -->
    <button on:click={() => { revealAnswer(); playFirework(); }} class="reveal-button {revealAnimation ? 'revealed' : ''} button-firework">
        <img src="../../public/christmas_present.png" class="present-icon" alt="a">
        <div class="text-overlay">{currentAnswer}</div>
        {#if fireworkActive}
            {#each Array(4) as _, index}
                <span class="firework active" style="{getFireworkStyles(index)}"></span>
            {/each}
        {/if}
    </button>
</div>

<style>
    .category {
        color: #FCD84D;
        font-size: 20px;
    }
    .board {
        display: grid;
        grid-template-columns: repeat(6, 1fr);
        margin: 15px;
        gap: 5px;
    }

    .board-cell {
        border: 1px solid #ccc;
        text-align: center;
        height: 4rem;
        width: 10rem;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        position: relative;
        transform-style: preserve-3d;
        transition: transform 0.5s;
        color: #fff; /* Text color */
    }

    .board-cell.flipped {
        transform: rotateY(180deg);
        background-color: #fff; /* Dark red when flipped */
    }

    .flipped-content {
        transform: rotateY(180deg);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100%;
        font-size: 0.7rem;
    }
    .team-button{
        position: absolute;
        bottom: 10px;
        left: 10px;
        padding: 20px;
        border-radius: 5px;
        align-items: center;
        justify-content: center;
    }

    .reveal-button {
        position: absolute;
        bottom: 10px;
        right: 10px;
        padding: 10px;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-size: 0.7rem;
        display: flex;
        align-items: center;
        justify-content: center;
        background: transparent;
        transition: transform 0.5s ease-in-out;
    }

    .present-icon {
        width: 100px; /* Adjust the size as needed */
        height: 100px; /* Adjust the size as needed */
        transition: opacity 0.5s ease-in-out;
    }

    .text-overlay {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        color: #fff;
        opacity: 0;
        pointer-events: none; /* Ensure the text doesn't interfere with the button click */
        transition: opacity 0.5s ease-in-out;
        font-size: 1rem;
    }

    .reveal-button.revealed .present-icon {
        opacity: 0;
    }

    .reveal-button.revealed .text-overlay {
        opacity: 1;
    }

    /* Firework */

    @keyframes firework {
        0% {
            transform: scale(1);
            opacity: 1;
        }
        100% {
            transform: scale(2);
            opacity: 0;
        }
    }

    .button-firework {
        position: absolute;
    }

    .firework {
        position: absolute;
        width: 20px;
        height: 20px;
        background-color: #ffcc00; /* Adjust color as needed */
        border-radius: 50%;
        animation: firework 0.5s ease-out;
    }

    /* Add this class dynamically to trigger the animation */
    .button-firework .firework.active {
        animation: firework 0.5s ease-out;
    }

</style>
