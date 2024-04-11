document.addEventListener('DOMContentLoaded', function() {
    const colorpickInput = document.getElementById('colorpick');
    const hueInput = document.getElementById('hue');
    const saturationInput = document.getElementById('saturation');
    const brightnessInput = document.getElementById('brightness');
    const paletteContainer = document.getElementById('palette');
    const savePaletteBtn = document.getElementById('savePalette');
    const sharePaletteBtn = document.getElementById('sharePalette');
    
    var colorpc = colorpickInput.value;
    var baseColor, colorList, hue, brightness, saturation;
    colorpickInput.oninput = function(){
        colorpc = this.value;
        baseColor = hexToCssHsl(colorpc); 
        colorList = hexToCssHsl(colorpc, true);
        hue = colorList[0];
        saturation = colorList[1];
        brightness = colorList[2];
        hueInput.value = hue;
        brightnessInput.value = brightness;
        saturationInput.value = saturation;
    }

    colorpickInput.addEventListener('input', updatePalette);
    hueInput.addEventListener('input', updatePalette);
    saturationInput.addEventListener('input', updatePalette);
    brightnessInput.addEventListener('input', updatePalette);
    savePaletteBtn.addEventListener('click', savePalette);
    sharePaletteBtn.addEventListener('click', sharePalette);
    
    
    
    
    updatePalette()
    function updatePalette() {
        
        
        
        
        hue = hueInput.value;
        saturation = saturationInput.value;
        brightness = brightnessInput.value;
        HEXcolor = hslToHex(hue, saturation, brightness);

        // Clear existing colors
        paletteContainer.innerHTML = '';

        // Add base color
        mainColor(baseColor);

        // Add color opposite on the hue channel
        const oppositeHue = (180-hue)%360;
        const oppositeColor = `hsl(${oppositeHue}, ${saturation}%, ${brightness}%)`;
        const sharecolor =`hsl(${hue}, ${saturation}%, ${brightness}%)`;
        document.getElementById("share").href = `https://api.whatsapp.com/send?text=${sharecolor}`;
        addColor(oppositeColor);

        // Add colors with slightly different brightness and saturation
        brighterbrightness = Math.min(100, brightness - 5);

        saturedsaturation = Math.max(0, saturation + 20);
        const brighterColor = `hsl(${hue}, ${saturation}%, ${brighterbrightness}%)`;
        const moreSaturatedColor = `hsl(${hue}, ${saturedsaturation}%, ${brightness}%)`;
        addColor(brighterColor);
        addColor(moreSaturatedColor);

        // Add colors with different hue
        const middleHue1 = 340-hue;
        const middleSat1 = Math.max(0, saturation - 15);
        const middleBright1 = Math.max(0, brightness - 35);

        const middleHue2 = (300+hue)%360;
        const middleSat2 = Math.max(0, saturation - 30);
        const middleBright2 = Math.min(100, brightness - 10);

        const middleColor1 = `hsl(${middleHue1}, ${middleSat1}%, ${middleBright1}%)`;
        const middleColor2 = `hsl(${middleHue2}, ${middleSat2}%, ${middleBright2}%)`;
        addColor(middleColor1);
        addColor(middleColor2);
    }

    function hexToCssHsl(hex, valuesOnly = false) {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        var r = parseInt(result[1], 16);
        var g = parseInt(result[2], 16);
        var b = parseInt(result[3], 16);
        r /= 255, g /= 255, b /= 255;
        var max = Math.max(r, g, b), min = Math.min(r, g, b);
        var h, s, l = (max + min) / 2;
        if (max == min) {
            h = s = 0; // achromatic
        } else {
            var d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch(max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }
        
        h = Math.round(h * 360);
        s = Math.round(s * 100);
        l = Math.round(l * 100);
        
        cssList = [h, s, l]
        var csString = h + ',' + s + '%,' + l + '%';
        var cssString = 'hsl(' + csString + ')';
        
        if (valuesOnly){
            return cssList;
        }
        return cssString;
    }
    function hslToHex(h, s, l) {
        l /= 100;
        const a = s * Math.min(l, 1 - l) / 100;
        const f = n => {
            const k = (n + h / 30) % 12;
            const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
            return Math.round(255 * color).toString(16).padStart(2, '0');   // convert to Hex and prefix "0" if needed
        };
        return `#${f(0)}${f(8)}${f(4)}`;
    }

    function mainColor(color) {
        const shade = document.createElement('div');
        shade.classList.add('maincolor');
        shade.style.backgroundColor = color;
        paletteContainer.appendChild(shade);

        const HSL = document.createElement('p');
        HSL.textContent = `${color}`;
        HSL.style.color = color;
        HSL.style.display = "block";
        shade.appendChild(HSL);
        paletteContainer.appendChild(shade);
    }
    function addColor(color) {
        const shade = document.createElement('div');
        shade.classList.add('color');
        shade.style.backgroundColor = color;
        paletteContainer.appendChild(shade);

        const HSL = document.createElement('p');
        HSL.textContent = `${color}`;
        HSL.style.color = color;
        HSL.style.display = "block";
        shade.appendChild(HSL);
        paletteContainer.appendChild(shade);
    }

    function sharePalette() {
        // Take a screenshot of the palette container
        html2canvas(paletteContainer).then(canvas => {
            // Convert the canvas to a data URL
            const imageDataURL = canvas.toDataURL();
    
            // Create a temporary link element
            const downloadLink = document.createElement('a');
            downloadLink.href = imageDataURL;
            downloadLink.download = 'palette.png'; // Set the file name
    
            // Programmatically trigger the download
            downloadLink.click();
        });
    }
    
});
