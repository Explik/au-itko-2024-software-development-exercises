let salaryInput;
let expensesInput;
let messageOutput;

function setup() {
    noCanvas();

    const column1 = 10, column2 = 150, column3 = 340;
    const row1 = 10, row2 = 50, row3 = 90;

    // Create and place the labels, inputs and buttons
    createSpan('Månedlig indkomst: ').position(column1, row1);
    salaryInput = createInput().position(column2, row1);
    createSpan('kr.').position(column3, row1);

    createSpan('Månedlige udgifter: ').position(column1, row2);
    expensesInput = createInput().position(column2, row2);
    createSpan('kr.').position(column3, row2);

    messageOutput = createInput().position(column2, row3).attribute("disabled", "");

    // Attach event listeners
    salaryInput.changed(beregnOpsparingOgBudget);
    expensesInput.changed(beregnOpsparingOgBudget);

    // Fetch initial feedback
    beregnOpsparingOgBudget();
}

function beregnOpsparingOgBudget() {
    // Fetch and validate inputs
    const input = readInput();
    const inputError = validateInput();
    if (inputError) {
        messageOutput.value(inputError);
        return;
    }

    // Calculate savings and give feedback
    const savings = beregnOpsparing(input.salary, input.expenses);
    const savingsFeedback = beregnBudgetNiveau(savings);
    messageOutput.value(savingsFeedback);
}

function beregnOpsparing(income, expenses) {
    // beregnOpsparing(indkomst, udgifter) → Beregner og returnerer månedlig opsparing som indkomst minus udgifter.
    const savings = income - expenses;
    return savings;
}

function beregnBudgetNiveau(savings) {
    // bestemBudgetniveau(opsparing) → Returnerer en feedback-besked baseret på opsparingen:
    // - Opsparing < 0 → "Du bruger mere end du tjener. Overvej at reducere udgifterne."
    // - 0 ≤ Opsparing ≤ 1000 → "Din opsparing er lav. Prøv at spare mere."
	// - Opsparing > 1000 → "God opsparing. Fortsæt sådan!"
    if (savings < 0) {
        return "Du bruger mere end du tjener. Overvej at reducere udgifterne.";
    }
    else if (savings <= 1000) {
        return "Din opsparing er lav. Prøv at spare mere.";
    }
    else return "God opsparing. Fortsæt sådan!";
}

function validateInput() {
    const input = readInput();

    // Validate input, return if any errors are found
    if (!input.rawSalary)
        return 'Indkomst skal være udfyldt';
    if (isNaN(input.salary))
        return 'Indkomsten skal være et tal';
    if (input.salary < 0)
        return 'Indkomsten skal være et positivt tal';

    // Validate input, return if any errors are found
    if (!input.rawExpenses)
        return 'Udgifter skal være udfyldt';
    if (isNaN(input.expenses))
        return 'Udgifterne skal være et tal';
    if (input.expenses < 0)
        return 'Udgifterne skal være et positivt tal';

    // Return no error
    return undefined;
}

function readInput() {
    const rawSalary = salaryInput.value();
    const rawExpenses = expensesInput.value();

    const salary = parseInt(rawSalary);
    const expenses = parseInt(rawExpenses);

    return { salary, rawSalary, expenses, rawExpenses };
}
