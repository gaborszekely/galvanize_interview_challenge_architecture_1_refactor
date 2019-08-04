
let people = [];

const addButton = document.getElementById("add-person-button");
const addPersonInput = document.getElementById("add-person-input");
const peopleCount = document.getElementById("people-count");
const peopleList = document.getElementById("people-list");

addButton.addEventListener("click", () => {
  const newPerson = addPersonInput.value;
  people.push(newPerson);
  addPersonInput.value = "";
  render();
});

function render() {
  peopleCount.innerHTML = people.length;
  peopleList.innerHTML = "";

  people.forEach(person => {
    const newLI = document.createElement("li");
    newLI.innerHTML = person;
    newLI.style.cursor = "pointer";
    newLI.id = person;

    newLI.addEventListener("click", function() {
      people = people.filter(person => person !== this.id);
      render();
    })

    peopleList.appendChild(newLI);
  });
}