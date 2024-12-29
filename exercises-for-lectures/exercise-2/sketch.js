let mealInput; 
let calloriesInput;
let messageOutput;
let recommendationOutput;

const breakfast = 'morgenmad';
const lunch = 'frokost';
const dinner = 'aftensmad';
const meals = [breakfast, lunch, dinner];

function setup() {
    noCanvas(); 

    const column1 = 10, column2 = 150;
    const row1 = 10, row2 = 50, row3 = 90, row4 = 130;

    // Create and place the labels, inputs and buttons
    createSpan('Måltid: ').position(column1, row1);
    mealInput = createSelect().position(column2, row1);
    meals.forEach(meal => mealInput.option(meal));

    createSpan('Antal kalorier: ').position(column1, row2);
    calloriesInput = createInput().position(column2, row2);

    messageOutput = createInput().position(column2, row3).attribute("disabled", "");

    createSpan('Anbefaling').position(column1, row4);
    recommendationOutput = createInput().position(column2, row4).attribute("disabled", "");

    // Attach event listeners
    mealInput.changed(updateRecommendationAndMessage);
    calloriesInput.changed(updateRecommendationAndMessage);

    // Fetch initial recommendation
    updateRecommendationAndMessage();
}

function updateRecommendationAndMessage() {
    // Fetch inputs
    const input = readInput();

    // Validate meal input, return if any errors are found
    const mealError = validateMealInput(input);
    if (mealError) {
        messageOutput.value(mealError);
        return;
    }

    // Generate recommendation (requires valid meal)
    const recommendation = generateRecommendation(input.meal);
    recommendationOutput.value(recommendation);

    // Validate callories input, return if any errors are found
    const calloriesError = validateCalloriesInput(input);
    if (calloriesError) {
        messageOutput.value(calloriesError);
        return;
    }
    
    // Generate message (requires valid meal and callories)
    const message = generateMessage(input.meal, input.callories);
    messageOutput.value(message);
}

function generateRecommendation(meal) {
    // Spec: 
    // "Morgenmad" → "Prøv havregrød eller en smoothie."
    // "Frokost" → "En salat eller sandwich kan være godt."
    // "Aftensmad" → "Overvej en varm ret som suppe eller grillet kylling."
    switch (meal) {
        case breakfast:
            return 'Prøv havregrød eller en smoothie.';
        case lunch:
            return 'En salat eller sandwich kan være godt.';
        case dinner:
            return 'Overvej en varm ret som suppe eller grillet kylling.';
        default:
            throw new Error('Unsupported meal type');
    }
}

function generateMessage(meal, callories) {
    if (meal === breakfast) {
        // Kalorier < 200 → "Let morgenmad. Tilføj lidt mere energi for en god start."
        // 200 ≤ Kalorier ≤ 400 → "En solid morgenmad. Godt for dagen!"
        // Kalorier > 400 → "Overvej at reducere kalorier til morgenmaden."
        if (callories < 200) {
            return 'Let morgenmad. Tilføj lidt mere energi for en god start.';
        } else if (callories <= 400) {
            return 'En solid morgenmad. Godt for dagen!';
        } else {
            return 'Overvej at reducere kalorier til morgenmaden.';
        }
    } else if (meal === lunch) {
        // Frokost:
        // Kalorier < 300 → "En let frokost. Overvej at tilføje mere."
        // 300 ≤ Kalorier ≤ 600 → "En balanceret frokost."
        // Kalorier > 600 → "Prøv at reducere kalorier til frokosten."
        // Aftensmad:
        if (callories < 300) {
            return 'En let frokost. Overvej at tilføje mere.';
        } else if (callories <= 600) {
            return 'En balanceret frokost.';
        } else {
            return 'Prøv at reducere kalorier til frokosten.';
        }
    } else if (meal === dinner) {
        // Kalorier < 400 → "En let aftensmad. Husk at det er dagens sidste måltid."
        // 400 ≤ Kalorier ≤ 700 → "En god afslutning på dagen."
        // Kalorier > 700 → "Prøv at undgå for tung mad om aftenen."
        if (callories < 400) {
            return 'En let aftensmad. Husk at det er dagens sidste måltid.';
        } else if (callories <= 700) {
            return 'En god afslutning på dagen.';
        } else {
            return 'Prøv at undgå for tung mad om aftenen.';
        }
    } else throw new Error('Unsupported meal type');
}

function validateMealInput(input) {
    if (!meals.includes(input.meal)) {
        return 'Ugyldigt måltid';
    }
}

function validateCalloriesInput(input) {
    if (!input.rawCallories) {
        return 'Kalorier skal udfyldes';
    }
    if (isNaN(input.callories)) {
        return 'Kalorier skal være et tal';
    }
    if (input.callories < 0) {
        return 'Kalorier skal være et positivt tal';
    }
}

function readInput() {
    const meal = mealInput.value();
    const rawCallories = calloriesInput.value();
    const callories = parseInt(rawCallories);

    return { meal, callories, rawCallories };
}