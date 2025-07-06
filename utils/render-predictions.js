
// Accepts an optional theme argument: 'dark' or 'light'. Defaults to 'light'.
// Usage: renderPredictions(predictions, ctx, theme)
// Theme colors are matched to Tailwind's sky-400 (light) and sky-200 (dark)
const LIGHT_BOX_COLOR = "#38bdf8"; // sky-400
const LIGHT_BOX_BG = "rgba(56, 189, 248, 0.15)";
const LIGHT_LABEL_BG = "#38bdf8";
const LIGHT_LABEL_TEXT = "#fff";

// Much darker, more muted overlay for dark mode
const DARK_BOX_COLOR = "#1e293b"; // slate-800
const DARK_BOX_BG = "rgba(30, 41, 59, 0.55)"; // slate-800 with more opacity
const DARK_LABEL_BG = "#334155"; // slate-700
const DARK_LABEL_TEXT = "#f1f5f9"; // slate-100

export const renderPredictions = (predictions, ctx, theme = 'light') => {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  // Theme colors
  const isDark = theme === 'dark';
  const BOX_COLOR = isDark ? DARK_BOX_COLOR : LIGHT_BOX_COLOR;
  const BOX_BG = isDark ? DARK_BOX_BG : LIGHT_BOX_BG;
  const LABEL_BG = isDark ? DARK_LABEL_BG : LIGHT_LABEL_BG;
  const LABEL_TEXT = isDark ? DARK_LABEL_TEXT : LIGHT_LABEL_TEXT;

  // Fonts
  const font = "16px sans-serif";
  ctx.font = font;
  ctx.textBaseline = "top";

  predictions.forEach((prediction) => {
    const [x, y, width, height] = prediction["bbox"];

    // bounding box
    ctx.strokeStyle = BOX_COLOR;
    ctx.lineWidth = 4;
    ctx.strokeRect(x, y, width, height);

    // fill the color
    ctx.fillStyle = BOX_BG;
    ctx.fillRect(x, y, width, height);

    // Draw the label background.
    ctx.fillStyle = LABEL_BG;
    const textWidth = ctx.measureText(prediction.class).width;
    const textHeight = parseInt(font, 10); // base 10
    ctx.fillRect(x, y, textWidth + 4, textHeight + 4);

    ctx.fillStyle = LABEL_TEXT;
    ctx.fillText(prediction.class, x, y);
  });
};

