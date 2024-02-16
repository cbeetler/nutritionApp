export default class AppData {
  constructor() {
    this.food = [];
  }

  addFood = (carbs = 0, protein = 0, fat = 0) => {
    this.food.push({
      carbs: Number.parseInt(carbs, 10),
      protein: Number.parseInt(protein, 10),
      fat: Number.parseInt(fat, 10),
    });
  };

  getTotalCalories = () => {
    return (
      this.getTotal("carbs") * 4 +
      this.getTotal("protein") * 4 +
      this.getTotal("fat") * 9
    );
  };

  getTotal = (nutrition) => {
    let total = 0;
    this.food.forEach((item) => {
      total += item[nutrition];
    });
    return total;
  };
}
