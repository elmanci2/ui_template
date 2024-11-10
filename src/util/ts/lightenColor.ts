function lightenColor(color: string, transparency: number): string {
  let r = 0, g = 0, b = 0, a = 1;

  // Diccionario de colores básicos
  const namedColors: { [key: string]: string } = {
    red: "#FF0000",
    green: "#008000",
    blue: "#0000FF",
    black: "#000000",
    white: "#FFFFFF",
    yellow: "#FFFF00",
    cyan: "#00FFFF",
    magenta: "#FF00FF",
    orange: "#FFA500",
    purple: "#800080",
    gray: "#808080",
    // Añade otros colores que necesites
  };

  // Convertir nombre de color a hex si es necesario
  if (namedColors[color.toLowerCase()]) {
    color = namedColors[color.toLowerCase()];
  }

  if (/^#([0-9A-F]{3}){1,2}$/i.test(color)) { // HEX
    if (color.length === 4) {
      r = parseInt(color[1] + color[1], 16);
      g = parseInt(color[2] + color[2], 16);
      b = parseInt(color[3] + color[3], 16);
    } else if (color.length === 7) {
      r = parseInt(color.slice(1, 3), 16);
      g = parseInt(color.slice(3, 5), 16);
      b = parseInt(color.slice(5, 7), 16);
    }
  }
  else if (/^rgba?\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}(?:\s*,\s*([01]?\.\d+|\d+))?\s*\)$/i.test(color)) { // RGB o RGBA
    const rgbaValues = color.match(/\d+(\.\d+)?/g)!.map(Number);
    [r, g, b] = rgbaValues;
    a = rgbaValues.length === 4 ? rgbaValues[3] : 1;
  }
  else if (/^hsla?\(\s*\d{1,3}\s*,\s*\d{1,3}%\s*,\s*\d{1,3}%\s*(?:,\s*([01]?\.\d+|\d+))?\s*\)$/i.test(color)) { // HSLA
    const hslaValues = color.match(/\d+(\.\d+)?/g)!.map(Number);
    const [h, s, l] = hslaValues;
    a = hslaValues.length === 4 ? hslaValues[3] : 1;

    // Convertir HSL a RGB
    [r, g, b] = hslToRgb(h / 360, s / 100, l / 100);
  } 
  else {
    throw new Error("Formato de color no válido. Use HEX, RGB, RGBA, HSLA o nombre de color CSS.");
  }

  // Aplicar transparencia o factor de oscurecimiento
  if (transparency > 1) {
    const darkenFactor = 1 / transparency;
    r = Math.floor(r * darkenFactor);
    g = Math.floor(g * darkenFactor);
    b = Math.floor(b * darkenFactor);
  } else {
    a *= transparency;
  }

  return `rgba(${r}, ${g}, ${b}, ${Math.min(1, Math.max(0, a))})`;
}

// Función auxiliar para convertir HSL a RGB
function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs((h * 6) % 2 - 1));
  const m = l - c / 2;
  let r = 0, g = 0, b = 0;

  if (h < 1 / 6) [r, g, b] = [c, x, 0];
  else if (h < 1 / 3) [r, g, b] = [x, c, 0];
  else if (h < 1 / 2) [r, g, b] = [0, c, x];
  else if (h < 2 / 3) [r, g, b] = [0, x, c];
  else if (h < 5 / 6) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];

  return [
    Math.round((r + m) * 255),
    Math.round((g + m) * 255),
    Math.round((b + m) * 255)
  ];
}

export { lightenColor };
