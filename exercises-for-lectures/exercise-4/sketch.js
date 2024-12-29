let overallBudgetInput; 
let durationInput; 
let categoryInput;
let budgetFeedbackOutput;
let dailyBudgetOutput;

const categories = ['Transport', 'Indkvartering', 'Mad', 'Aktiviteter'];

function setup() {
    noCanvas(); 

    const column1 = 10, column2 = 150, column3 = 340;
    const row1 = 10, row2 = 50, row3 = 90, row4 = 130, row5 = 170;

    // Create and place the labels, inputs and buttons
    createSpan('Ferie budget: ').position(column1, row1);
    overallBudgetInput = createInput().position(column2, row1);
    createSpan('kr.').position(column3, row1);

    createSpan('Ferie varighed').position(column1, row2);
    durationInput = createInput().position(column2, row2);
    createSpan('dage').position(column3, row2);

    createSpan('Kategori???').position(column1, row3);
    categoryInput = createSelect().position(column2, row3);
    categories.forEach(category => categoryInput.option(category));

    createSpan('Budget feedback: ').position(column1, row4);
    budgetFeedbackOutput = createInput().position(column2, row4).attribute("disabled", "");

    createSpan('Dagligt budget: ').position(column1, row5);
    dailyBudgetOutput = createInput().position(column2, row5).attribute("disabled", "");

    // Attach event listeners
    overallBudgetInput.changed(beregnDagligtBudget);
    durationInput.changed(beregnDagligtBudget);
    
    // TODO Ask customer to add purpose of categoryInput to specification

    // Fetch initial feedback
    beregnDagligtBudget();
}

function beregnDagligtBudget() {
    // Fetch inputs
    const input = readInput();

    // Validate input, return if any errors are found
    const inputError = validateInput(input);
    if (inputError) {
        dailyBudgetOutput.value("");
        budgetFeedbackOutput.value(inputError);

        return;
    }

    // Calculate daily budget and give feedback
    const dailyBudget = beregnBudgetPerDag(input.overallBudget, input.duration);
    dailyBudgetOutput.value(dailyBudget.toFixed(2) + " kr.");

    const budgetFeedback = bestemBudgetkategori(dailyBudget);
    budgetFeedbackOutput.value(budgetFeedback);
}

function beregnBudgetPerDag(overallBudget, duration) {
    // Calculate daily budget
    const dailyBudget = overallBudget / duration;
    return dailyBudget;
}

function bestemBudgetkategori(budgetPerDag) {
    // Budget pr. dag < 50 → "Stramt budget. Planlæg nøje."
    // 50 ≤ Budget pr. dag ≤ 100 → "Middelbudget. Godt planlagt!"
    // Budget pr. dag > 100 → "Luksusbudget. Nyd ferien!"
    if (budgetPerDag < 50) {
        return "Stramt budget. Planlæg nøje.";
    }
    else if (budgetPerDag <= 100) {
        return "Middelbudget. Godt planlagt!";
    }
    else return "Luksusbudget. Nyd ferien!";
}

function validateInput(input) {
    // Validate overall budget, return error message if invalid
    if (!input.rawOverallBudget)
        return "Fejl: Overordnet budget skal udfyldes.";
    if (isNaN(input.overallBudget))
        return "Fejl: Overordnet budget skal være et tal.";
    if (input.overallBudget <= 0)
        return "Fejl: Overordnet budget skal være større end 0.";

    // Validate duration, return error message if invalid
    if (!input.rawDuration)
        return "Fejl: Varighed skal udfyldes.";
    if (isNaN(input.duration))
        return "Fejl: Varighed skal være et tal.";
    if (input.duration <= 0)
        return "Fejl: Varighed skal være større end 0.";

    // TODO Add category validation

    // Return undefined if no errors are found
    return undefined;
}

function readInput() {
    const rawOverallBudget = overallBudgetInput.value();
    const overallBudget = parseFloat(rawOverallBudget);

    const rawDuration = durationInput.value();
    const duration = parseInt(rawDuration);

    // TODO Add category to input object

    return {
        overallBudget,
        rawOverallBudget,
        duration,
        rawDuration
    };
}