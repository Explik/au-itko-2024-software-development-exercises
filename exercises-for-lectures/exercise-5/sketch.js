let weekPlans = [];
let currentWeekPlan;

let weekNumberInput; 

let weekNumberOutput; 
let planMondayInput;
let planTuesdayInput;
let planWednesdayInput;
let planThursdayInput;
let planFridayInput;
let planSaturdayInput;
let planSundayInput;

class WeekPlan {
    constructor(weekNumber, monday, tuesday, wednesday, thursday, friday, saturday, sunday) {
        this.weekNumber = weekNumber;
        this.monday = monday;
        this.tuesday = tuesday;
        this.wednesday = wednesday;
        this.thursday = thursday;
        this.friday = friday;
        this.saturday = saturday;
        this.sunday = sunday;
    }

    static createDefault(weekNumber) {
        return new WeekPlan(weekNumber, 'Ingen data', 'Ingen data', 'Ingen data', 'Ingen data', 'Ingen data', 'Ingen data', 'Ingen data');
    }

    static createEmpty() {
        return new WeekPlan('', '', '', '', '', '', '', '');
    }
}

function setup() {
    // Create and place the labels, inputs and buttons
    const column1 = 10, column2 = 120, column3 = 320;
    const row1 = 10, row2 = 70, row3 = 110, row4 = 150, row5 = 190, row6 = 230, row7 = 270, row8 = 310, row9 = 350, row10 = 390;

    noCanvas(); 
    
    createSpan('Uge nr.: ').position(column1, row1);
    weekNumberInput = createInput().position(column2, row1);
    const createPlanButton = createButton('Ny kostplan').position(column3, row1);

    createSpan('Uge nr.: ').position(column1, row2);
    weekNumberOutput = createInput().position(column2, row2).attribute("disabled", "");

    createSpan('Mandag: ').position(column1, row3);
    planMondayInput = createInput().position(column2, row3);

    createSpan('Tirsdag: ').position(column1, row4);
    planTuesdayInput = createInput().position(column2, row4);

    createSpan('Onsdag: ').position(column1, row5);
    planWednesdayInput = createInput().position(column2, row5);

    createSpan('Torsdag: ').position(column1, row6);
    planThursdayInput = createInput().position(column2, row6);

    createSpan('Fredag: ').position(column1, row7);
    planFridayInput = createInput().position(column2, row7);

    createSpan('Lørdag: ').position(column1, row8);
    planSaturdayInput = createInput().position(column2, row8);
    const updatePlanButton = createButton('Ændre kostplan').position(column3, row8);

    createSpan('Søndag: ').position(column1, row9);
    planSundayInput = createInput().position(column2, row9);
    const deletePlanButton = createButton('Slet kostplan').position(column3, row9);

    const previousWeekButton = createButton('Forrige uge').position(column1, row10);
    const nextWeekButton = createButton('Næste uge').position(column1 + 85, row10);

    // Add event listeners to the buttons
    createPlanButton.mousePressed(createPlan);
    updatePlanButton.mousePressed(updatePlan);
    deletePlanButton.mousePressed(deletePlan);
    nextWeekButton.mousePressed(findNextWeeksPlan);
    previousWeekButton.mousePressed(findPreviousWeeksPlan);    
}

function createPlan() {
    const weekPlanNumber = parseInt(weekNumberInput.value());
    
    // Check if the week number is a number
    if (isNaN(weekPlanNumber)) {
        alert('Uge nr. skal være et tal');
        return;
    }

    // Check if the week number already exists
    const weekNumberExists = weekPlans.some(plan => plan.weekNumber === weekPlanNumber);
    if (weekNumberExists) {
        alert('Ugen eksisterer allerede');
        return;
    }

    // Create a new week plan (with default values for each day)
    const newWeekPlan = WeekPlan.createDefault(weekPlanNumber);
    currentWeekPlan = newWeekPlan;
    weekPlans.push(newWeekPlan);
    writePlanInputs(newWeekPlan);

    // Clear the week number input
    weekNumberInput.value('');
}

function updatePlan() {
    if (!currentWeekPlan) {
        alert('Ingen plan valgt');
        return;
    }
    readPlanInputs(currentWeekPlan);
}

function deletePlan() {
    if (!currentWeekPlan) {
        alert('Ingen plan valgt');
        return;
    }

    // Delete the week plan from the array
    const weekPlanIndex = weekPlans.findIndex(plan => plan === currentWeekPlan);
    weekPlans.splice(weekPlanIndex, 1);
    currentWeekPlan = undefined;

    // Clear the inputs
    writePlanInputs(WeekPlan.createEmpty());
}

function findNextWeeksPlan() {
    if (!currentWeekPlan) {
        alert('Ingen plan valgt');
        return;
    }
    findPlanForWeek(currentWeekPlan.weekNumber + 1);
}

function findPreviousWeeksPlan() {
    if (!currentWeekPlan) {
        alert('Ingen plan valgt');
        return;
    }
    findPlanForWeek(currentWeekPlan.weekNumber - 1);
}

function findPlanForWeek(weekNumber) {
    // Validate the week number
    if (weekNumber < 1 || weekNumber > 52) {
        alert('Uge nr. skal være mellem 1 og 52');
        return;
    }

    // Find the next week plan
    const weekPlan = weekPlans.find(plan => plan.weekNumber === weekNumber);
    if (weekPlan) {
        currentWeekPlan = weekPlan;
        writePlanInputs(currentWeekPlan);
    }
    else alert('Ingen data for denne uge');
}

function readPlanInputs(weekplan) {
    weekplan.monday = planMondayInput.value();
    weekplan.tuesday = planTuesdayInput.value();
    weekplan.wednesday = planWednesdayInput.value();
    weekplan.thursday = planThursdayInput.value();
    weekplan.friday = planFridayInput.value();
    weekplan.saturday = planSaturdayInput.value();
    weekplan.sunday = planSundayInput.value();
}

function writePlanInputs(weekplan) {
    // Set the values of the inputs
    weekNumberOutput.value(weekplan.weekNumber);
    planMondayInput.value(weekplan.monday);
    planTuesdayInput.value(weekplan.tuesday);
    planWednesdayInput.value(weekplan.wednesday);
    planThursdayInput.value(weekplan.thursday);
    planFridayInput.value(weekplan.friday);
    planSaturdayInput.value(weekplan.saturday);
    planSundayInput.value(weekplan.sunday);
}