import Remedy from './Remedy';

class RemedyViewModel {
  _remedyName = '';
  _remedyDesc = 'This is a Remedy';

  // Getter for remedyName
  getName() {
    return this._remedyName;
  }

  // Setter for remedyName
  setName(name) {
    this._remedyName = name;
  }

  // Getter for remedyDesc
  getDesc() {
    return this._remedyDesc;
  }

  // Setter for remedyDesc
  setDesc(desc) {
    this._remedyDesc = desc;
  }

  constructor() {
    // Initialize other properties or perform any necessary setup here.
    this.londonMax();
  }

  londonMax() {
    this.setName("apple");
    this.setDesc("new york city");
  }

  screamOne() {
    return this.getName();
  }

  screamTwo() {
    return this.getDesc();
  }
}

export default RemedyViewModel;
