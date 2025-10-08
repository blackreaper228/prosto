import "./style.css";
import "./vars.css";
import "./fonts.css";
import { initFallingWords } from "./fallingWords.js";

// Инициализация падающих слов после загрузки DOM
document.addEventListener("DOMContentLoaded", () => {
  initFallingWords();
});
