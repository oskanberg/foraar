
Chromosome = function(parent_chromosome) {
    if (!(this instanceof Chromosome))
        return new Chromosome(parent_chromosome);

    if (parent_chromosome !== undefined) {
        for (var property in parent_chromosome) {
            this[property] = parent_chromosome[property];
        }
        this.growth_direction_bias = {
            'up' : parent_chromosome.growth_direction_bias.up,
            'right' : parent_chromosome.growth_direction_bias.right,
            'down' : parent_chromosome.growth_direction_bias.down,
            'left' : parent_chromosome.growth_direction_bias.left,
        };
        this.mutate();
    } else {
        this.growth_direction_bias = {
            'up' : Math.floor(Math.random() * 11),
            'right' : Math.floor(Math.random() * 11),
            'down' : Math.floor(Math.random() * 11),
            'left' : Math.floor(Math.random() * 11),
        };
        this.split_likelihood = Math.random() / CHROMOSOME_SPLIT_LIKELIHOOD_NORMALISER;
        this.grow_flower_likelihood = Math.random() / CHROMOSOME_GROW_FLOWER_LIKELIHOOD_NORMALISER;
        this.mutation_likelihood = Math.random() / CHROMOSOME_MUTATION_LIKELIHOOD_NORMALISER;
        this.plant_colour = random_good_colour();
        this.flower_colour = random_good_colour();
    }
};

Chromosome.prototype.growth_direction_bias = null;
Chromosome.prototype.split_likelihood = null;
Chromosome.prototype.grow_flower_likelihood = null;
Chromosome.prototype.mutation_likelihood = null;
Chromosome.prototype.plant_colour = null;
Chromosome.prototype.flower_colour = null;

Chromosome.prototype.mutate = function() {
    for (var key in this.growth_direction_bias) {
        if (Math.random() < this.mutation_likelihood) {
            this.growth_direction_bias[key] = Math.abs(this.growth_direction_bias[key] + getRandomArbitary(-3, 3));
        }
    }
    if (Math.random() < this.mutation_likelihood) {
        this.plant_colour = random_good_colour();
    }
    if (Math.random() < this.mutation_likelihood) {
        this.flower_colour = random_good_colour();
    }
    this.probabilistically_mutate_feature(this.split_likelihood, CHROMOSOME_SPLIT_LIKELIHOOD_NORMALISER);
    this.probabilistically_mutate_feature(this.grow_flower_likelihood, CHROMOSOME_GROW_FLOWER_LIKELIHOOD_NORMALISER);
    // do this one last I guess
    this.probabilistically_mutate_feature(this.mutation_likelihood, CHROMOSOME_MUTATION_LIKELIHOOD_NORMALISER);
};

Chromosome.prototype.probabilistically_mutate_feature = function(feature, normaliser) {
    if (Math.random() < this.mutation_likelihood) {
        feature += Math.abs(getRandomArbitary(-0.1, 0.1) / normaliser);
    }
};
