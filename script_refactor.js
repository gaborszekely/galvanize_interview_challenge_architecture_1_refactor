class PubSub {
  constructor() {
    this._events = {};
  }

  on(event, callback) {
    this._events[event] = this._events[event] || [];
    this._events[event].push(callback);
  }

  off(event, callback) {
    if(this._events[event]) {
      this._events[event] = this._events[event].filter(cb => cb !== callback);
    }
  }

  trigger(event, value) {
    if(this._events[event]) {
      this._events[event].forEach(event => {
        event(value);
      })
    }
  }
}


/**
 ************  COMPONENTS  ***********************************************************
 */


class PeopleCount {
  constructor() {
    this._target = document.getElementById("people-count");
  }

  get _peopleCount() {
    return App.state.people.length;
  }

  init() {
    App.pubSub.on("peopleChanged", this._render.bind(this));
  }

  _render() {
    this._target.innerHTML = this._peopleCount;
  }
}


class PeopleList {
  constructor() {
    this._target = document.getElementById("people-list");
    this._people = [];
  }

  getPeople() {
    return this._people;
  }
  
  setPeople(people) {
    this._people = people;
    this._render();
  }

  init() {
    App.pubSub.on("peopleChanged", this.setPeople.bind(this));
  }

  _render() {
    this._target.innerHTML = "";

    this._people.forEach(person => {
      const newLI = document.createElement("li");
      newLI.innerHTML = person;
      newLI.style.cursor = "pointer";
      newLI.id = person;
  
      newLI.addEventListener("click", (e) =>{
        App.methods.setPeople(App.state.people.filter(person => person !== e.target.id));
      })
  
      this._target.appendChild(newLI);
    });
  }
}


class PeopleInput {
  constructor() {
    this._inputTarget = document.getElementById("add-person-input");
    this._buttonTarget = document.getElementById("add-person-button");
  }

  get inputVal() {
    return this._inputTarget.value;
  }

  init() {
    this._buttonTarget.addEventListener("click", () => {
      this._inputTarget.innerHTML = "";
      App.methods.setPeople([...App.state.people, this.inputVal]);
    })
  }
}


/**
 ************  APP  *********************************************************************
 */


const App = {
  state: {
    people: [],
  },
  pubSub: new PubSub(),
  components: {
    peopleCount: new PeopleCount(),
    peopleList: new PeopleList(),
    peopleInput: new PeopleInput(),
  },
  methods: {
    setPeople(people) {
      App.pubSub.trigger("peopleChanged", people);
    },
    resetPeople(people) {
      App.state.people = people;
    },
  },
  init() {
    this.pubSub.on("peopleChanged", this.methods.resetPeople.bind(this));

    for(let comp in this.components) {
      const component = this.components[comp];
      typeof component.init === 'function' && component.init();
    }
  }
};
