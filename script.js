const svg = document.getElementById("editor");
const toggleButton = document.getElementById("toggleCurve");
let points = [];
let draggingIndex = null;
let curveType = "quadratic";

// Реализация добавления точки по правому клику мыши
svg.addEventListener("contextmenu", (e) => {
    e.preventDefault();
    const { x, y } = getMousePos(e);
    points.push({ x, y });
    render();
});

// Реализация удаления точки по двойному клику
svg.addEventListener("dblclick", (e) => {
    const index = findPointIndex(e);
    if (index !== -1) {
        points.splice(index, 1);
        render();
    }
});

// Начало перетаскивания
svg.addEventListener("mousedown", (e) => {
    if (e.target.tagName === "circle") {
        draggingIndex = findPointIndex(e);
    }
});

// Перемещение точки
svg.addEventListener("mousemove", (e) => {
    if (draggingIndex !== null) {
        const { x, y } = getMousePos(e);
        points[draggingIndex] = { x, y };
        render();
    }
});

// Завершение перетаскивания
svg.addEventListener("mouseup", () => {
    draggingIndex = null;
});

// Переключение типа кривой
toggleButton.addEventListener("click", () => {
    curveType = curveType === "quadratic" ? "cubic" : "quadratic";
    toggleButton.textContent = curveType === "quadratic" ? "Квадратичная" : "Кубическая";
    render();
});

// Функция рендера SVG
function render() {
    svg.innerHTML = ""; 
    drawPath();
    points.forEach((p, i) => drawPoint(p, i));
}

// Функция рисования линии
function drawPath() {
    if (points.length < 2) return;
    let pathData = `M ${points[0].x} ${points[0].y}`;

    if (curveType === "quadratic") {
        for (let i = 1; i < points.length; i++) {
            const prev = points[i - 1];
            const midX = (prev.x + points[i].x) / 2;
            const midY = (prev.y + points[i].y) / 2;
            pathData += ` Q ${midX} ${midY}, ${points[i].x} ${points[i].y}`;
        }
    } else {
        for (let i = 1; i < points.length - 1; i += 2) {
            const cp1 = points[i];
            const cp2 = points[i + 1] || cp1;
            const end = points[i + 2] || cp2;
            pathData += ` C ${cp1.x} ${cp1.y}, ${cp2.x} ${cp2.y}, ${end.x} ${end.y}`;
        }
    }

    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", pathData);
    svg.appendChild(path);
}

// Функция рисования точки
function drawPoint(point, index) {
    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("cx", point.x);
    circle.setAttribute("cy", point.y);
    circle.setAttribute("r", 6);
    circle.setAttribute("data-index", index);
    svg.appendChild(circle);
}

// Получение позиции курсора внутри SVG
function getMousePos(e) {
    const rect = svg.getBoundingClientRect();
    return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
    };
}

// Поиск ближайшей точки
function findPointIndex(e) {
    const { x, y } = getMousePos(e);
    return points.findIndex(p => Math.hypot(p.x - x, p.y - y) < 10);
}

// Первичный рендер
render();