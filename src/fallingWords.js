import Matter from "matter-js";

export function initFallingWords() {
  const container = document.getElementById("fallingText");
  if (!container) return;

  const THICCNESS = 60;

  // Создаем движок Matter.js
  const Engine = Matter.Engine;
  const Render = Matter.Render;
  const World = Matter.World;
  const Bodies = Matter.Bodies;
  const Composite = Matter.Composite;
  const Mouse = Matter.Mouse;
  const MouseConstraint = Matter.MouseConstraint;
  const Runner = Matter.Runner;

  const engine = Engine.create();
  engine.gravity.y = 1; // Гравитация

  // Создаем рендер
  const render = Render.create({
    element: container,
    engine: engine,
    options: {
      width: container.clientWidth,
      height: container.clientHeight,
      wireframes: false,
      background: "transparent",
      showAngleIndicator: false,
      pixelRatio: window.devicePixelRatio || 1,
    },
  });

  // Создаем стены (границы контейнера)
  const wallOptions = {
    isStatic: true,
    render: {
      fillStyle: "transparent",
      strokeStyle: "transparent",
      lineWidth: 0,
    },
  };

  const ground = Bodies.rectangle(
    container.clientWidth / 2,
    container.clientHeight + THICCNESS / 2,
    27184,
    THICCNESS,
    wallOptions
  );

  const leftWall = Bodies.rectangle(
    0 - THICCNESS / 2,
    container.clientHeight / 2,
    THICCNESS,
    container.clientHeight * 5,
    wallOptions
  );

  const rightWall = Bodies.rectangle(
    container.clientWidth + THICCNESS / 2,
    container.clientHeight / 2,
    THICCNESS,
    container.clientHeight * 5,
    wallOptions
  );

  const topWall = Bodies.rectangle(
    container.clientWidth / 2,
    0 - THICCNESS / 2,
    container.clientWidth,
    THICCNESS,
    wallOptions
  );

  // Чёрный блок в левом нижнем углу
  const blackBlock = Bodies.rectangle(
    375, // x = половина ширины блока (750 / 2)
    container.clientHeight - 245, // y = высота контейнера - половина высоты блока (490 / 2)
    750,
    600,
    {
      isStatic: true,
      render: {
        fillStyle: "#000000",
        strokeStyle: "transparent",
        lineWidth: 0,
      },
    }
  );

  // Добавляем стены и блок в мир
  Composite.add(engine.world, [
    ground,
    leftWall,
    rightWall,
    topWall,
    blackBlock,
  ]);

  // Слова для анимации
  const words = [
    "креатив",
    "бренд",
    "дизайн",
    "стратегия",
    "визуал",
    "идея",
    "концепт",
    "стиль",
    "айдентика",
    "проект",
  ];

  // Функция для измерения размеров текста
  function measureText(text) {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    ctx.font = "500 90px MarkTheMoment, sans-serif";
    const metrics = ctx.measureText(text);
    const width = metrics.width + 40; // padding
    const height = 44; // font size + padding
    return { width, height };
  }

  // Создаем тела для всех слов с рандомными позициями
  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    const { width, height } = measureText(word);

    // Рандомная позиция и угол как в референсе
    const x = Math.random() * container.clientWidth;
    const y = Math.random() * container.clientHeight * 0.7 + Math.random() * 40;
    const angle = (Math.random() - 0.5) * (Math.PI / 3);

    const wordBody = Bodies.rectangle(x, y, width, height, {
      angle: angle,
      friction: 0.3,
      frictionAir: 0.00001,
      restitution: 0.8,
      render: {
        fillStyle: "transparent",
        strokeStyle: "transparent",
        lineWidth: 0,
      },
      label: word,
    });

    Composite.add(engine.world, wordBody);
  }

  // Настраиваем мышь для драга
  const mouse = Mouse.create(render.canvas);
  const mouseConstraint = MouseConstraint.create(engine, {
    mouse: mouse,
    constraint: {
      stiffness: 0.2,
      render: {
        visible: false,
      },
    },
  });

  Composite.add(engine.world, mouseConstraint);

  // Разрешаем скролл через canvas
  mouseConstraint.mouse.element.removeEventListener(
    "wheel",
    mouseConstraint.mouse.mousewheel
  );
  mouseConstraint.mouse.element.removeEventListener(
    "DOMMouseScroll",
    mouseConstraint.mouse.mousewheel
  );

  // Кастомный рендеринг текста на canvas
  Matter.Events.on(render, "afterRender", () => {
    const ctx = render.context;
    ctx.font = "500 90px MarkTheMoment, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#FEC7FF";

    engine.world.bodies.forEach((body) => {
      // Рисуем только наши слова из массива words
      if (body.label && words.includes(body.label)) {
        ctx.save();
        ctx.translate(body.position.x, body.position.y);
        ctx.rotate(body.angle);

        // Рисуем фон с закругленными углами
        const metrics = ctx.measureText(body.label);
        const textWidth = metrics.width;
        const padding = 20;
        const bgWidth = textWidth + padding * 2;
        const bgHeight = 44;

        ctx.fillStyle = "rgba(0, 0, 0, 0)";

        // Рисуем rounded rectangle
        const radius = 8;
        ctx.beginPath();
        ctx.moveTo(-bgWidth / 2 + radius, -bgHeight / 2);
        ctx.lineTo(bgWidth / 2 - radius, -bgHeight / 2);
        ctx.quadraticCurveTo(
          bgWidth / 2,
          -bgHeight / 2,
          bgWidth / 2,
          -bgHeight / 2 + radius
        );
        ctx.lineTo(bgWidth / 2, bgHeight / 2 - radius);
        ctx.quadraticCurveTo(
          bgWidth / 2,
          bgHeight / 2,
          bgWidth / 2 - radius,
          bgHeight / 2
        );
        ctx.lineTo(-bgWidth / 2 + radius, bgHeight / 2);
        ctx.quadraticCurveTo(
          -bgWidth / 2,
          bgHeight / 2,
          -bgWidth / 2,
          bgHeight / 2 - radius
        );
        ctx.lineTo(-bgWidth / 2, -bgHeight / 2 + radius);
        ctx.quadraticCurveTo(
          -bgWidth / 2,
          -bgHeight / 2,
          -bgWidth / 2 + radius,
          -bgHeight / 2
        );
        ctx.closePath();
        ctx.fill();

        // Рисуем текст (uppercase)
        ctx.fillStyle = "#FEC7FF";
        ctx.fillText(body.label.toUpperCase(), 0, 0);

        ctx.restore();
      }
    });
  });

  // Запускаем рендер
  Render.run(render);

  // Создаем и запускаем runner
  const runner = Runner.create();
  Runner.run(runner, engine);

  // Функция обработки resize
  function handleResize() {
    render.canvas.width = container.clientWidth;
    render.canvas.height = container.clientHeight;

    // Обновляем позиции стен
    Matter.Body.setPosition(
      ground,
      Matter.Vector.create(
        container.clientWidth / 2,
        container.clientHeight + THICCNESS / 2
      )
    );

    Matter.Body.setPosition(
      rightWall,
      Matter.Vector.create(
        container.clientWidth + THICCNESS / 2,
        container.clientHeight / 2
      )
    );

    Matter.Body.setPosition(
      topWall,
      Matter.Vector.create(container.clientWidth / 2, 0 - THICCNESS / 2)
    );

    // Обновляем позицию чёрного блока
    Matter.Body.setPosition(
      blackBlock,
      Matter.Vector.create(375, container.clientHeight - 245)
    );
  }

  window.addEventListener("resize", handleResize);

  return {
    engine,
    render,
    runner,
    cleanup: () => {
      window.removeEventListener("resize", handleResize);
      Render.stop(render);
      Runner.stop(runner);
      World.clear(engine.world);
      Engine.clear(engine);
      render.canvas.remove();
    },
  };
}
