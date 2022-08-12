
export const dateOfBirthToAge = (dob) => {
    const birthdateComponents = dob.split("-")
    return calculateAge(birthdateComponents[1], birthdateComponents[2], birthdateComponents[0])
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