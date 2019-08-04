"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _instanceof(left, right) { if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) { return !!right[Symbol.hasInstance](left); } else { return left instanceof right; } }

function _classCallCheck(instance, Constructor) { if (!_instanceof(instance, Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var PubSub =
/*#__PURE__*/
function () {
  function PubSub() {
    _classCallCheck(this, PubSub);

    this._events = {};
  }

  _createClass(PubSub, [{
    key: "on",
    value: function on(event, callback) {
      this._events[event] = this._events[event] || [];

      this._events[event].push(callback);
    }
  }, {
    key: "off",
    value: function off(event, callback) {
      if (this._events[event]) {
        this._events[event] = this._events[event].filter(function (cb) {
          return cb !== callback;
        });
      }
    }
  }, {
    key: "trigger",
    value: function trigger(event) {
      if (this._events[event]) {
        this._events[event].forEach(function (event) {
          event();
        });
      }
    }
  }]);

  return PubSub;
}();
/**************************************/



var PeopleCount =
/*#__PURE__*/
function () {
  function PeopleCount() {
    _classCallCheck(this, PeopleCount);

    this._peopleCount = 0;
    this._target = document.getElementById("people-count");
  }

  _createClass(PeopleCount, [{
    key: "init",
    value: function init() {
      App.pubSub.on("peopleChanged", this.setCount.bind(this));
    }
  }, {
    key: "getCount",
    value: function getCount() {
      return this._peopleCount;
    }
  }, {
    key: "setCount",
    value: function setCount(people) {
      this._peopleCount = people.count;

      this._render();
    }
  }, {
    key: "_render",
    value: function _render() {
      this._target.innerHTML = this._peopleCount;
    }
  }]);

  return PeopleCount;
}();

window.PeopleCount = PeopleCount;

var PeopleList =
/*#__PURE__*/
function () {
  function PeopleList() {
    _classCallCheck(this, PeopleList);

    this._target = document.getElementById("people-list");
    this._people = [];
  }

  _createClass(PeopleList, [{
    key: "getPeople",
    value: function getPeople() {
      return this._people;
    }
  }, {
    key: "setPeople",
    value: function setPeople(people) {
      this._people = people;

      this._render();
    }
  }, {
    key: "init",
    value: function init() {
      App.pubSub.on("peopleChanged", this.setPeople.bind(this));
    }
  }, {
    key: "_render",
    value: function _render() {
      this._people.forEach(function (person) {
        var newLI = document.createElement("li");
        newLI.innerHTML = person;
        newLI.style.cursor = "pointer";
        newLI.id = person;
        newLI.addEventListener("click", function () {
          var _this = this;

          App.pubSub.trigger("peopleChanged", people.filter(function (person) {
            return person !== _this.id;
          }));
        });
        peopleList.appendChild(newLI);
      });
    }
  }]);

  return PeopleList;
}();

window.PeopleList = PeopleList;

var PeopleInput =
/*#__PURE__*/
function () {
  function PeopleInput() {
    _classCallCheck(this, PeopleInput);

    this._inputTarget = document.getElementById("add-person-input");
    this._buttonTarget = document.getElementById("add-person-button");
  }

  _createClass(PeopleInput, [{
    key: "init",
    value: function init() {
      var _this2 = this;

      this._buttonTarget.addEventListener("click", function () {
        App.pubSub.trigger([].concat(_toConsumableArray(App.state.people), [_this2.inputVal]));
      });
    }
  }, {
    key: "inputVal",
    get: function get() {
      return this._inputTarget.nodeValue;
    }
  }]);

  return PeopleInput;
}();

window.PeopleInput = PeopleInput;


var App = {
  state: {
    people: 0
  },
  pubSub: new PubSub(),
  components: {
    peopleCount: new window.PeopleCount(),
    peopleList: new window.PeopleList(),
    peopleInput: new window.PeopleInput()
  },
  init: function init() {
    var _this3 = this;

    this.pubSub.on("peopleChanged", function (people) {
      _this3.people = people;
    });

    for (var component in this.components) {
      console.log(typeof component); // component.init();
    }
  }
};
App.init();