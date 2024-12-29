let destinationInput; 
let durationInput;
let messageOutput;

const beach = 'strand';
const mountain = 'bjerge';
const city = 'by';
const countrySide = 'landet';
const destinations = [beach, mountain, city, countrySide];

function setup() {
    noCanvas(); 

    // Create and place the labels, inputs and buttons
    const column1 = 10, column2 = 120, column3 = 320;
    const row1 = 10, row2 = 50, row3 = 90;

    createSpan('Destination: ').position(column1, row1);
    destinationInput = createInput().position(column2, row1);

    createSpan('Varighed: ').position(column1, row2);
    durationInput = createInput().position(column2, row2);
    createSpan('dage').position(column3, row2);

    messageOutput = createInput().position(column2, row3).attribute("disabled", "");

    // Attach event listeners
    destinationInput.changed(updateMessage);
    durationInput.changed(updateMessage);
}

function updateMessage() {
    // Fetch inputs
    const input = readInput();

    // Validate input
    const error = validateInput();
    if (error) {
        messageOutput.value(error);
        return;
    }

    // Generate message
    const message = generateMessage(input);
    messageOutput.value(message);
} 

function generateMessage(input) {
    const { destination, duration } = input;

    switch (destination) {
        case beach:
            return generateBeachMessage(duration);
        case mountain:
            return generateMountainMessage(duration);
        case city:
            return generateCityMessage(duration);
        case countrySide:
            return generateCountrySideMessage(duration);
        default:
            return 'Fejl: Ukendt destination';
    }
}

function generateBeachMessage(duration) {
    // Længde < 3 → "En kort strandtur. Husk badetøj og solcreme!"
    // 3 ≤ Længde ≤ 7 → "Perfekt til en uges afslapning. Husk bøger og badetøj!"
    // Længde > 7 → "En længere strandferie. Overvej også nogle udflugter."

    if (duration < 3) 
        return 'En kort strandtur. Husk badetøj og solcreme!';
    else if (duration <= 7)
        return 'Perfekt til en uges afslapning. Husk bøger og badetøj!';
    else
        return 'En længere strandferie. Overvej også nogle udflugter.';
}

function generateMountainMessage(duration) {
    // Længde < 3 → "En kort tur. Sørg for at planlægge dine vandreture."
    // 3 ≤ Længde ≤ 7 → "En uge i bjergene. Husk varmt tøj og gode sko!"
    // Længde > 7 → "Overvej længere ruter og ekstra proviant."
    if (duration < 3) 
        return 'En kort tur. Sørg for at planlægge dine vandreture.';
    else if (duration <= 7)
        return 'En uge i bjergene. Husk varmt tøj og gode sko!';
    else
        return 'Overvej længere ruter og ekstra proviant.';
}   

function generateCityMessage(duration) {
    // Længde < 3 → "En kort bytur. Fokusér på de vigtigste seværdigheder."
    // 3 ≤ Længde ≤ 7 → "Perfekt til at udforske byens kultur og mad."
	// Længde > 7 → "Overvej at tage på dagsture uden for byen."
    if (duration < 3)
        return 'En kort bytur. Fokusér på de vigtigste seværdigheder.';
    else if (duration <= 7)
        return 'Perfekt til at udforske byens kultur og mad.';
    else
        return 'Overvej at tage på dagsture uden for byen.';
}   

function generateCountrySideMessage(duration) {
    // Længde < 3 → "En smuttur. Nyd roen på landet."
    // 3 ≤ Længde ≤ 7 → "Tag dig tid til at slappe af og udforske omgivelserne."
    // Længde > 7 → "Planlæg længere gåture eller cykelture."
    if (duration < 3)
        return 'En smuttur. Nyd roen på landet.';
    else if (duration <= 7)
        return 'Tag dig tid til at slappe af og udforske omgivelserne.';
    else
        return 'Planlæg længere gåture eller cykelture.';
}

function validateInput() {
    const input = readInput();

    // Validate destination, return any error if found
    if (!input.rawDestination) 
        return 'Fejl: Udfyld venligst destination';
    
    if (!destinations.includes(input.destination))
        return 'Fejl: Ukendt destination';

    // Validate duration, return any error if found
    if (!input.rawDuration) 
        return 'Fejl: Udfyld venligst varighed';
    
    if (isNaN(input.duration)) 
        return 'Fejl: Varighed skal være et tal';
    
    if (input.duration < 1) 
        return 'Fejl: Varighed skal være mindst 1';

    // Return no error 
    return undefined;
}

function readInput() {
    const rawDestination = destinationInput.value();
    const destination = rawDestination.toLowerCase();
    
    const rawDuration = durationInput.value();
    const duration = parseInt(rawDuration);

    return { destination, rawDestination, duration, rawDuration };
}