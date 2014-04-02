
Nature = function(width, height) {
    if (!(this instanceof Nature))
        return new Nature(width, height);

    this.width = width;
    this.height = height;
    this.state = create_array(width, height);
    this.plants = [];
    this.changes = [];
};

Nature.prototype.height = null;
Nature.prototype.width = null;
Nature.prototype.state = null;
Nature.prototype.plants = null;
Nature.prototype.changes = null;

Nature.prototype.create_new_plant = function(location_x, location_y, parent) {
    if (this.check_location_free(location_x, location_y)) {
        //console.log('new plant growing at x:' + location_x + ' y:' + location_y);

        var new_plant = new Plant({'x' : location_x, 'y' : location_y}, parent);
        this.plants.push(new_plant);
        this.state[location_x][location_y] = new_plant;
        this.changes.push({
            'location' : {
                'x' : location_x,
                'y' : location_y
            },
            'colour' : new_plant.chromosome.plant_colour
        });
    } else {
        //console.log('seedling died :(');
    }
};

Nature.prototype.grow_all_plants = function() {
    for (var i = 0, plant; plant = this.plants[i++];) {
        var growth_target = plant.get_growth_target();
        if (growth_target === false) {
            continue;
        }
        if (this.check_location_free(growth_target.new_part.x, growth_target.new_part.y)) {
            var growth = plant.grow(growth_target.new_part, growth_target.root);
            this.state[growth.location.x][growth.location.y] = plant;
            this.changes.push({
                'location'  : growth.location,
                'colour'    : growth.colour
            });
        }
    }
};

Nature.prototype.check_location_free = function(location_x, location_y) {
    if (location_x < 0 || location_y < 0) {
        return false;
    }
    if (location_x >= this.width ||  location_y >= this.height) {
        return false;
    }
    if (typeof this.state[location_x] !== 'undefined' && typeof this.state[location_x][location_y] !== 'undefined') {
        return false;
    }
    return true;
};

Nature.prototype.get_changes = function() {
    var changes = this.changes;
    this.changes = [];
    return changes;
};

Nature.prototype.sample_sunbeam = function() {
    var location_x = ~~getRandomArbitary(0, this.width);
    var column = this.state[location_x];
    var subject;
    for (var i = 0, length = column.length; i < length; i++) {
        if (typeof column[i] !== 'undefined') {
            //console.log('sunbeam hit ' + column[i].health);
            column[i].health += SUNBEAM_HEALTH_BOOST;
            break;
        }
        this.changes.push({
            'location'  : {
                'x' : location_x,
                'y' : i
            },
            'colour' : SUNBEAM_COLOUR
        });
    }

    for (var i = 0, plant; plant = this.plants[i++];) {
        if (--plant.health <= 0 ) {
            // plant died
            this.plants.splice(i-1, 1);
            // remove all parts
            var parts = plant.parts;
            for (var i = 0, part; part = parts[i++];) {
                this.state[part.x][part.y] = undefined;
                this.changes.push({
                    'location'  : {
                        x : part.x,
                        y : part.y
                    },
                    'colour'  : DEAD_PLANT_COLOUR,
                });
            }
            plant.die();
        }
    }
};

Nature.prototype.sample_honeybee = function() {
    var all_possible_flowers = [];
    for (var i = 0, plant; plant = this.plants[i++];) {
        for (var j = 0, flower; flower = plant.flower_parts[j++];) {
            all_possible_flowers.push({
                'location'  : flower,
                'plant'     : plant
            });
        }
    }
    if (all_possible_flowers.length === 0) return false;
    var chosen_flower = all_possible_flowers.random_element();
    // the higher the flower, the further away the seed may fall
    var new_position_x = chosen_flower.location.x + ~~(getRandomArbitary(-1, 1) * chosen_flower.location.y);
    this.create_new_plant(new_position_x, HEIGHT - 1, chosen_flower.plant);
};

Nature.prototype.simulate = function() {
    this.create_new_plant(~~getRandomArbitary(0, WIDTH), HEIGHT - 1);
    this.create_new_plant(~~getRandomArbitary(0, WIDTH), HEIGHT - 1);
    this.create_new_plant(~~getRandomArbitary(0, WIDTH), HEIGHT - 1);
    this.create_new_plant(~~getRandomArbitary(0, WIDTH), HEIGHT - 1);
    this.create_new_plant(~~getRandomArbitary(0, WIDTH), HEIGHT - 1);
    this.create_new_plant(~~getRandomArbitary(0, WIDTH), HEIGHT - 1);
    this.create_new_plant(~~getRandomArbitary(0, WIDTH), HEIGHT - 1);
    this.create_new_plant(~~getRandomArbitary(0, WIDTH), HEIGHT - 1);
    this.create_new_plant(~~getRandomArbitary(0, WIDTH), HEIGHT - 1);
    this.create_new_plant(~~getRandomArbitary(0, WIDTH), HEIGHT - 1);
    this.create_new_plant(~~getRandomArbitary(0, WIDTH), HEIGHT - 1);
    this.create_new_plant(~~getRandomArbitary(0, WIDTH), HEIGHT - 1);
    this.create_new_plant(~~getRandomArbitary(0, WIDTH), HEIGHT - 1);
    this.create_new_plant(~~getRandomArbitary(0, WIDTH), HEIGHT - 1);
    setInterval(this.grow_all_plants.bind(this), 1000 / GROWTH_PER_SECOND);
    setInterval(this.sample_sunbeam.bind(this), 1000 / SUN_PER_SECOND);
    setInterval(this.sample_honeybee.bind(this), 1000 / BEES_PER_SECOND);
    setInterval(function () {
        for (var i = 0, plant; plant = this.plants[i++];) {
            console.log(plant.chromosome.grow_flower_likelihood);
            console.log(plant.chromosome.growth_direction_bias);
        }
        console.log('=================================================================');
    }.bind(this), 5000);
};