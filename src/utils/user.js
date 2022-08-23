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