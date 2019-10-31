
function initiate () {
    document.findElementById("scoreField").setAttribute("readonly", "readonly");
}

function createSubmitForm() {
    submitForm = document.createElement("form");
    submitForm.setAttribute("id", "submitForm");
    submitForm.setAttribute("method", "POST");
    submitForm.setAttribute("action", "submitScore");
    createNameInput();
    createScoreInput();
}

function createNameInput() {
    nameInput = document.createElement("input");
    nameInput.setAttribute("type", "text");
    nameInput.setAttribute("class", "inputField");
    nameInput.setAttribute("name", "name");
    nameInput.setAttribute("placeholder", "Name");
    document.findElementById("submitForm").appendChild(nameInput);
}

function createScoreInput(value) {
    scoreInput = document.createElement("input");
    scoreInput.setAttribute("type", "text");
    scoreInput.setAttribute("class", "inputField");
    scoreInput.setAttribute("name", "score");
    scoreInput.setAttribute("placeholder", "Name    ");
    scoreInput.setAttribute("value", value);
    document.findElementById("submitForm").appendChild(scoreInput);

}*/