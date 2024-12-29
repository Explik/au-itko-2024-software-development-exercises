let taskIdInput; 
let taskDateInput; 
let taskCategoryInput;
let taskTimeUsageInput;
let taskDescriptionInput;
let nextDateButton; 
let previousDateButton;
let projectLogElement; 

class Task {
    constructor(id, date, category, timeUsage, description) {
        this.id = id;
        this.date = date;
        this.category = category;
        this.timeUsage = timeUsage;
        this.description = description;
    }

    static create() {
        return new Task(projectLog.length + 1, '', '', 0, 'Ny opgave');
    }

    toString() {
        return `Opgave ${this.id} (${this.date}): \nKategori:${this.category} \nTidsforbrug: ${this.timeUsage} timer\nBeskrivelse: ${this.description}`;
    }
}

const categories = ['Udvikling', 'Planlægning', 'Test', 'Møder'];
let projectLog = []; 
projectLog = [
    new Task('1', '2021/10/01', 'Udvikling', 5, 'Lav en opgave'), 
    new Task('2', '2021/10/02', 'Planlægning', 2, 'Planlæg en opgave'), 
    new Task('3', '2021/10/03', 'Test', 3, 'Test en opgave'), 
    new Task('4', '2021/10/04', 'Møder', 1, 'Hold et møde')
]; 
let currentProjectDate; 

function setup() {
    noCanvas();

    const column1 = 10, column2 = 150, column3 = 340;
    const row0 = 10, row1 = 40, row2 = 280, row3 = 340, row4 = 380, row5 = 420, row6 = 460, row7 = 500, row8 = 540;

    // Create and place the labels, inputs and buttons
    let showProjectLogButton = createButton('Vis projekt log').position(column1, row0);
    let showProjectTimeUsageButton = createButton('Vis projekt tidsforbrug').position(column1 + 105, row0);

    projectLogElement = createElement('textarea')
        .position(column1, row1)
        .attribute('disabled', '')
        .attribute('cols', '54')
        .attribute('rows', '15'); 

    previousDateButton = createButton('Forrige').position(column1, row2);
    nextDateButton = createButton('Næste').position(column1 + 65, row2); 
    const addTaskButton = createButton('Tilføj opgave').position(column3 - 3, row2);

    createSpan('Opgave id').position(column1, row3);
    taskIdInput = createInput().position(column2, row3);
    const findTaskButton = createButton('Find').position(column3, row3);

    createSpan('Dato').position(column1, row4);
    taskDateInput = createInput().position(column2, row4);
    createSpan('åååå/mm/dd').position(column3, row4);

    createSpan('Kategori').position(column1, row5);
    taskCategoryInput = createSelect().position(column2, row5);
    categories.forEach(category => taskCategoryInput.option(category));

    createSpan('Forbrugt tid').position(column1, row6);
    taskTimeUsageInput = createInput().position(column2, row6);
    createSpan('timer').position(column3, row6);

    createSpan('Beskrivelse').position(column1, row7);
    taskDescriptionInput = createInput().position(column2, row7);
    
    const saveTaskButton = createButton('Gem').position(column1, row8);
    const deleteTaskButton = createButton('Slet').position(column1 + 50, row8);

    // Attach event listeners
    showProjectLogButton.mousePressed(showProjectLogForFirstDate);
    showProjectTimeUsageButton.mousePressed(showProjectTimeUsage);
    previousDateButton.mousePressed(showProjectLogForPreviousDate);
    nextDateButton.mousePressed(showProjectLogForNextDate);
    addTaskButton.mousePressed(addTask);
    findTaskButton.mousePressed(findTask);
    saveTaskButton.mousePressed(saveTask);
    deleteTaskButton.mousePressed(deleteTask);

    // Populate project iog
    showProjectLogForFirstDate();
}

function showProjectLogForFirstDate() {
    // Check if project log is empty
    if (projectLog.length === 0) {
        projectLogElement.value('Ingen opgaver angivet, tryk "Tilføj opgave".');
        updateDateNavigationVisibility(false);
        return;
    }

    // Find first date of project 
    const projectDates = projectLog.map(task => task.date);
    projectDates.sort((a, b) => a - b);
    const firstDate = projectDates[0];

    // Show project log for first date and navigation
    showProjectLogForDate(firstDate);
}

function showProjectTimeUsage() {
    updateDateNavigationVisibility(false);

    // Check if project log is empty
    if (projectLog.length === 0) {
        currentMode = 'error';
        projectLogElement.value('Ingen opgaver angivet, tryk "Tilføj opgave".');
        return;
    }

    // Calculate time usage per category
    const buffer = {}; 
    
    for(let category of categories) {
        buffer[category] = 0;
    }

    for(let task of projectLog) {
        if (buffer[task.category] === undefined) 
            throw new Error(`Unsupported category: ${task.category}`);

        buffer[task.category] += task.timeUsage; 
    }

    // Show time usage per category
    let result = '';
    for(let category in buffer) {
        result += `${category}: ${buffer[category]} timer\n`;
    }

    projectLogElement.value(result);
}

function showProjectLogForPreviousDate() {
    // Find previous date
    const projectDates = getProjectDates();
    const previousDate = projectDates.findLast(date => date < currentProjectDate);
    if (!previousDate) {
        alert('Ingen tidligere datoer fundet');
        return;
    }

    // Show project log for previous date
    showProjectLogForDate(previousDate);
}

function showProjectLogForNextDate() {
    // Find next date
    const projectDates = getProjectDates();
    const nextDate = projectDates.find(date => date > currentProjectDate);
    if (!nextDate) {
        alert('Ingen senere datoer fundet');
        return;
    }

    // Show project log for next date
    showProjectLogForDate(nextDate);
}

function getProjectDates() {
    const projectDates = projectLog.map(task => task.date);
    projectDates.sort((a, b) => a - b);
    return projectDates;
}

function showProjectLogForDate(date) {
    currentProjectDate = date;

    const projectLogForDate = projectLog.filter(task => task.date === date);
    const projectTasks = projectLogForDate.map(task => task.toString()).join('\n\n');
    
    projectLogElement.value(projectTasks);
    updateDateNavigationVisibility(true); 
}

function updateDateNavigationVisibility(show) {
    previousDateButton.style('visibility', show ? 'visible' : 'hidden');
    nextDateButton.style('visibility', show ? 'visible' : 'hidden');
}

function addTask() {
    const task = Task.create();
    writeTaskInput(task);
}

function findTask() {
    const taskId = taskIdInput.value();
    const task = projectLog.find(t => t.id === taskId);
    if (!task) {
        alert('Opgave med id ' + taskId + ' blev ikke fundet');
        return;
    }

    writeTaskInput(task);
}

function saveTask() {
    const task = new Task();
    readTaskInput(task);

    const taskError = validateTaskInput(task);
    if (taskError) {
        alert(taskError);
        return;
    }

    const existingTaskIndex = projectLog.findIndex(t => t.id === task.id);
    if (existingTaskIndex === -1) {
        projectLog.push(task);
    } else {
        projectLog[existingTaskIndex] = task;
    }

    showProjectLogForDate(task.date);
}

function deleteTask() {
    const taskId = taskIdInput.value();
    const taskIndex = projectLog.findIndex(t => t.id === taskId);
    if (taskIndex === -1) {
        alert('Opgave med id ' + taskId + ' blev ikke fundet');
        return;
    }

    projectLog.splice(taskIndex, 1);
    showProjectLogForDate(currentProjectDate);
}

function validateTaskInput(task) {
    if (!task.id)
        return 'Id skal være udfyldt';

    if (!task.date)
        return 'Dato skal være udfyldt';
    if (isNaN(new Date(task.date)))
        return 'Dato skal være en gyldig dato';
    if (task.date < 0)
        return 'Dato skal være et positivt tal';

    if (!task.category)
        return 'Kategori skal være udfyldt';
    if (!categories.includes(task.category))
        return 'Kategori skal være en af: ' + categories.join(', ');

    if (!task.timeUsage)
        return 'Tidsforbrug skal være udfyldt';
    if (isNaN(task.timeUsage))
        return 'Tidsforbrug skal være et tal';
    if (task.timeUsage < 0)
        return 'Tidsforbrug skal være et positivt tal';

    if (!task.description)
        return 'Beskrivelse skal være udfyldt';

    return undefined;
}

function readTaskInput(task) {
    task.id = taskIdInput.value();
    task.date = taskDateInput.value();
    task.category = taskCategoryInput.value();
    task.timeUsage = taskTimeUsageInput.value();
    task.description = taskDescriptionInput.value();
}

function writeTaskInput(task) {
    taskIdInput.value(task.id);
    taskDateInput.value(task.date);
    taskCategoryInput.value(task.category);
    taskTimeUsageInput.value(task.timeUsage);
    taskDescriptionInput.value(task.description);
}