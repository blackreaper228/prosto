import "./style.css";
import "./vars.css";
import "./fonts.css";
import { initFallingWords } from "./js/fallingWords.js";
import { initBurgerMenu } from "./js/burgerMenu.js";

// Инициализация падающих слов после загрузки DOM
document.addEventListener("DOMContentLoaded", () => {
  initFallingWords();
  initBurgerMenu();
});
