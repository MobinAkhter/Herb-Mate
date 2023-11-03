// viewModel.js
import Remedy from '../Models/Remedy';

class RemedyViewModel {
    constructor(remedy) {
      this.remedy = remedy; // Assign the provided 'remedy' object directly
    }
  
    getRemedyName() {
      return this.remedy.name;
    }
  
    getRemedyDescription() {
      return this.remedy.description;
    }
  
    getRemedyImages() {
      return this.remedy.image;
    }
  
    getRemedyPrecautions() {
      return this.remedy.precautions;
    }
  }

export default RemedyViewModel;
