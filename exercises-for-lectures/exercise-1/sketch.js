let destinationInput;
let durationInput;
let messageOutput;
let activityOutput;

const beach = 'strand';
const mountain = 'bjerge';
const city = 'by';
const countrySide = 'land';
const destinations = [beach, mountain, city, countrySide];

function setup() {
    noCanvas();

    // Create and place the labels, inputs and buttons
    const column1 = 10, column2 = 120, column3 = 320;
    const row1 = 10, row2 = 50, row3 = 90, row4 = 130;

    createSpan('Destination: ').position(column1, row1);
    destinationInput = createInput().position(column2, row1);

    createSpan('Varighed: ').position(column1, row2);
    durationInput = createInput().position(column2, row2);
    createSpan('dage').position(column3, row2);

    messageOutput = createInput().position(column2, row3).attribute("disabled", "");

    createSpan('Forslag').position(column1, row4);
    activityOutput = createInput().position(column2, row4).attribute("disabled", "");

    // Attach event listeners
    destinationInput.changed(updateActivityAndMessage);
    durationInput.changed(updateActivityAndMessage);
}

function updateActivityAndMessage() {
    // Fetch inputs
    const input = readInput();

    // Validate input, return if any errors are found
    const destinationError = validateDestinationInput(input);
    if (destinationError) {
        messageOutput.value(destinationError);
        return;
    }
    
    // Generate activity (requires valid destination)
    const activity = generateActivity(input.destination);
    activityOutput.value(activity);

    // Validate input, return if any errors are found
    const durationError = validateDurationInput(input);
    if (durationError) {
        messageOutput.value(durationError);
        return;
    }

    // Generate message (requires valid destination and duration)
    const message = generateMessage(input.destination, input.duration);
    messageOutput.value(message);
}

function generateMessage(destination, duration) {
    if (destination === beach) {
        return generateBeachMessage(duration);
    } else if (destination === mountain) {
        return generateMountainMessage(duration);
    } else if (destination === city) {
        return generateCityMessage(duration);
    } else if (destination === countrySide) {
        return generateCountrySideMessage(duration);
    } else {
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

function generateActivity(destination) {
    // "strand" → "Tag en svømmetur og slap af."
    // "bjerge" → "Planlæg en vandretur."
    // "by" → "Udforsk lokale museer og caféer."
    // "land" → "Tag en cykeltur og nyd naturen."
    switch(destination) {
        case beach:
            return 'Tag en svømmetur og slap af.';
        case mountain:
            return 'Planlæg en vandretur.';
        case city:
            return 'Udforsk lokale museer og caféer.';
        case countrySide:
            return 'Tag en cykeltur og nyd naturen.';
        default:
            return 'Fejl: Ukendt destination';
    }
} 

function validateDestinationInput(input) {
    // Validate destination, return any error if found
    if (!input.rawDestination)
        return 'Fejl: Udfyld venligst destination';

    if (!destinations.includes(input.destination))
        return 'Fejl: Ukendt destination';

    // Return no error
    return undefined;
}

function validateDurationInput(input) {
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
    const destination = rawDestination && rawDestination.toLowerCase().trim();

    const rawDuration = durationInput.value();
    const duration = parseInt(rawDuration);

    return { destination, rawDestination, duration, rawDuration };
}