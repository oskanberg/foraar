
function hslToRgb(h, s, l) {
    var r, g, b;
    if (s === 0) {
        r = g = b = l; // achromatic
    } else {
        var  hue2rgb = function(p, q, t) {
            if(t < 0) t += 1;
            if(t > 1) t -= 1;
            if(t < 1/6) return p + (q - p) * 6 * t;
            if(t < 1/2) return q;
            if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        };

        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }
    return {
        'r' : Math.round(r * 255),
        'g' : Math.round(g * 255),
        'b' : Math.round(b * 255)
    };
}

function random_good_colour() {
    var colour = Math.random();
    colour = hslToRgb(colour, 0.6, 0.3);
    colour.a = 255;
    return colour;
}

// http://stackoverflow.com/a/966938
function create_array(length) {
    var arr = new Array(length || 0),
        i = length;

    if (arguments.length > 1) {
        var args = Array.prototype.slice.call(arguments, 1);
        while(i--) arr[length-1 - i] = create_array.apply(this, args);
    }

    return arr;
}

// http://stackoverflow.com/a/1527820
function getRandomArbitary(min, max) {
    return Math.random() * (max - min) + min;
}

// http://stackoverflow.com/a/7120353
Array.prototype.random_element = function () {
    return this[~~(Math.random() * this.length)];
};