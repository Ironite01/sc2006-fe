export function isUsernameValid(username) {
    const re = new RegExp("^(?=(?:.*[A-Za-z]){5,}).{5,}$");
    return re.test(username);
}

export function isEmailValid(email) {
    const re = new RegExp("^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$");
    return re.test(email);
}

export function isStrongPassword(password) {
    const re = new RegExp("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$");
    return re.test(password);
}