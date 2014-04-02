
Plant = function(initial_part, parent) {
    if (!(this instanceof Plant))
        return new Plant(width, height);

    this.parts = [initial_part];
    this.growth_parts = [initial_part];
    this.flower_parts = [];
    this.chromosome = parent === undefined ? new Chromosome() : new Chromosome(parent.chromosome);
    this.health = INITIAL_PLANT_HEALTH;
    this.alive = true;
};

Plant.prototype.parts = null;
Plant.prototype.chromosome = null;
Plant.prototype.health = null;
Plant.prototype.alive = null;
Plant.prototype.flower_parts = null;

// separate function so Chrome can optimise it
Plant.prototype._get_bias_array = function(direction, bias_array) {
    for (var i = 0, len = this.chromosome.growth_direction_bias[direction]; i < len; i++) {
        bias_array.push(direction);
    }
};

Plant.prototype.get_growth_target = function() {
    // plant gets this health back in grow()
    // so it's expensive to get this wrong
    this.health--;

    if (this.growth_parts.length === 0) {
        // can't grow anywhere
        return false;
    }

    bias_array = [];
    for (var direction in this.chromosome.growth_direction_bias) {
        this._get_bias_array(direction, bias_array);
    }

    growth_targets = [];
    for (var i = 0, part; part = this.growth_parts[i++];) {
        var direction = bias_array.random_element();
        growth_targets.push({
            'new_part' : this.get_new_part(direction, part),
            'root' : part
        });
    }
    return growth_targets.random_element();
};

Plant.prototype.get_new_part = function(direction, root_element) {
    var newx = root_element.x;
    var newy = root_element.y;
    switch(direction) {
        case 'up':
            newy--;
            break;
        case 'down':
            newy++;
            break;
        case 'left':
            newx--;
            break;
        case 'right':
            newx++;
            break;
    }
    return {
        'x' : newx,
        'y' : newy
    };
};

Plant.prototype.grow = function(new_part, root_element) {
    var growth = {
        'location' : new_part
    };
    if (Math.random() < this.chromosome.split_likelihood) {
        // don't remove the growth part
    } else {
        // remove root from growth_parts
        var index = this.growth_parts.indexOf(root_element);
        this.growth_parts.splice(index, 1);
    }

    if (Math.random() < this.chromosome.grow_flower_likelihood) {
        // turn the new part into a flower!
        this.flower_parts.push(new_part);
        growth.colour = this.chromosome.flower_colour;
        // making flowers is expensive :(
        this.health--;
    } else {
        // turn it into a regular growth part
        this.growth_parts.push(new_part);
        growth.colour = this.chromosome.plant_colour;
    }
    this.parts.push(new_part);
    this.health++;
    return growth;
};

Plant.prototype.die = function() {
    //console.log('plant died');
    this.alive = false;
};