import "./style.css";
import "./vars.css";
import "./fonts.css";
import { initFallingWords } from "./js/fallingWords.js";
import { initBurgerMenu } from "./js/burgerMenu.js";

// Инициализация падающих слов после загрузки DOM
document.addEventListener("DOMContentLoaded", () => {
  let fallingWordsInstance = initFallingWords();
  initBurgerMenu();

  // Debounce функция для перезапуска анимации при resize
  let resizeTimeout;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      // Очищаем старый инстанс
      if (fallingWordsInstance && fallingWordsInstance.cleanup) {
        fallingWordsInstance.cleanup();
      }
      // Создаем новый
      fallingWordsInstance = initFallingWords();
    }, 300); // Ждем 300мс после окончания resize
  });
});
