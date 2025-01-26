export const dateOfBirthToAge = (dob) => {
    const birthdateComponents = dob.split("-")

    return calculateAge(
        Number.parseInt(birthdateComponents[1], 10), 
        Number.parseInt(birthdateComponents[2], 10), 
        Number.parseInt(birthdateComponents[0], 10)
    )
}

const calculateAge = (birthMonth, birthDay, birthYear) => {
    var currentDate = new Date();
    var currentYear = currentDate.getFullYear();
    var currentMonth = currentDate.getMonth();
    var currentDay = currentDate.getDate(); 
    var calculatedAge = currentYear - birthYear;

    if (currentMonth < birthMonth - 1) {
        calculatedAge--;
    }
    if (birthMonth - 1 == currentMonth && currentDay < birthDay) {
        calculatedAge--;
    }
    return calculatedAge;
}

export const position_mapping_to_string = (position_mapping) => {
    const position = position_mapping.position

    if(position.name) {
        return position.name
    } else if(position.crew) {
        if(position.team) {
            return `Medlem av ${position.team.name} i ${position.crew.name}`
        } else if(position.chief) {
            return `Gruppeleder for ${position.crew.name}`
        } else {
            return `Medlem av ${position.crew.name}`
        }
    }

    return JSON.stringify(position)
}