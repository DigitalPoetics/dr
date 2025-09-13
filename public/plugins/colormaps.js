// Browser version of colormap library
function colormap(options) {
  const { colormap: name, nshades = 256, format = 'float' } = options;
  const colors = [];
  
  for (let i = 0; i < nshades; i++) {
    const t = i / (nshades - 1);
    let r, g, b;
    
    switch (name) {
      case 'hot':
        r = Math.min(1, t * 3);
        g = Math.min(1, Math.max(0, t * 3 - 1));
        b = Math.min(1, Math.max(0, t * 3 - 2));
        break;
      case 'cool':
        r = t; g = 1 - t; b = 1;
        break;
      case 'jet':
        if (t < 0.125) { r = 0; g = 0; b = 0.5 + t * 4; }
        else if (t < 0.375) { r = 0; g = (t - 0.125) * 4; b = 1; }
        else if (t < 0.625) { r = (t - 0.375) * 4; g = 1; b = 1 - (t - 0.375) * 4; }
        else if (t < 0.875) { r = 1; g = 1 - (t - 0.625) * 4; b = 0; }
        else { r = 1 - (t - 0.875) * 4; g = 0; b = 0; }
        break;
      case 'bone':
        r = (7 * t) / 8; g = t; b = t;
        if (t > 3/8) { r = (11 * t - 3) / 8; g = (7 * t + 1) / 8; }
        if (t > 5/8) { r = (3 * t + 5) / 8; g = t; b = (7 * t - 3) / 8; }
        break;
      case 'viridis':
        r = 0.267 + t * 0.726; g = 0.005 + t * 0.901; b = 0.329 - t * 0.185;
        break;
      case 'plasma':
        r = 0.050 + t * 0.890; g = 0.030 + t * 0.945; b = 0.528 - t * 0.397;
        break;
      case 'copper':
        r = Math.min(1, 1.25 * t); g = 0.7812 * t; b = 0.4975 * t;
        break;
      case 'spring':
        r = 1; g = t; b = 1 - t;
        break;
      case 'summer':
        r = t; g = 0.5 + t * 0.5; b = 0.4;
        break;
      case 'autumn':
        r = 1; g = t; b = 0;
        break;
      case 'winter':
        r = 0; g = t; b = 1 - t * 0.5;
        break;
      case 'whitegray': // White background grayscale
        r = g = b =  1 - t ;
        break;
      default: // gray
        r = g = b = t;
    }
    
    colors.push(format === 'float' ? [r, g, b, 1] : [r, g, b]);
  }
  
  return colors;
}

window.colormap = colormap;
