
Graphics = function(image_width, image_height, projector_id) {
    if (!(this instanceof Graphics))
        return new Graphics(image_width, image_height, projector_id);

    // shim layer with setTimeout fallback
    window.requestAnimationFrame = window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame    ||
        function(callback) {
            window.setTimeout(callback, 1000 / 60);
        };

    this.canvas = document.createElement('canvas');
    this.canvas.width = image_width;
    this.canvas.height = image_height;
    this.context = this.canvas.getContext('2d');
    this.render_image = new Image();

    // whenever render_image gets new data, redraw
    this.render_image.onload = () => {
      this.render_context.imageSmoothingEnabled = false;
      this.render_context.webkitImageSmoothingEnabled = false;
      this.render_context.mozImageSmoothingEnabled = false;
      this.render_context.drawImage(this.render_image, 0, 0, this.render_canvas.width, this.render_canvas.height);
    };

    this.render_canvas = document.getElementById(projector_id);
    this.render_context = this.render_canvas.getContext('2d');
    this.render_canvas.width = window.innerWidth;
    this.render_canvas.height = window.innerHeight;
    this.new_data = false;
    this.rendered = 0;
};

Graphics.prototype.canvas = null;
Graphics.prototype.context = null;

Graphics.prototype.render_image = null;
Graphics.prototype.render_canvas = null;
Graphics.prototype.render_context = null;

Graphics.prototype.new_data = null;
Graphics.prototype.changes_callback = null;

Graphics.prototype.rendered = null;

Graphics.prototype.setup = function(changes_callback) {
    this.test_card();
    if (changes_callback) {
        this.changes_callback = changes_callback;
        setInterval(this.update_changes.bind(this), 1000/30);
    }
    window.requestAnimationFrame(this.render.bind(this));
};

Graphics.prototype.update_changes = function() {
    var changes = this.changes_callback();
    for (var i = 0, change; change = changes[i++];) {
        this.draw_pixel(change.location.x, change.location.y, change.colour.r, change.colour.g, change.colour.b, change.colour.a);
        this.new_data = true;
    }
};

Graphics.prototype.render = function() {
    window.requestAnimationFrame(this.render.bind(this));
    this.rendered++;
    if (this.new_data && this.rendered >= 3) {
        this.rendered = 0;
        this.render_image.src = this.canvas.toDataURL();
        this.new_data = false;
    }
};

Graphics.prototype.test_card = function() {
    var image_data = this.context.createImageData(this.canvas.width, this.canvas.height);
    for (var i = 0, n = image_data.data.length; i < n; i += 4) {
        var colour = Math.random();
        var saturation = Math.random() * (0.8 - 0.4) + 0.4;
        var lightness = Math.random() * (0.8 - 0.4) + 0.4;
        var rgb = hslToRgb(colour, saturation, lightness);
        image_data.data[i] = rgb[0];
        image_data.data[i + 1] = rgb[1];
        image_data.data[i + 2] = rgb[2];
        image_data.data[i + 3] = 255;
    }
    this.context.putImageData(image_data, 0, 0);
    this.new_data = true;
};

Graphics.prototype.draw_background = function(r, g, b, a) {
    this.context.fillStyle = 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
};

Graphics.prototype.draw_pixel = function(x, y, r, g, b, a) {
    this.context.fillStyle = 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
    this.context.fillRect(x, y, 1, 1);
};
