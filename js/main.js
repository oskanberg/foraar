
INITIAL_PLANT_HEALTH = 500;
SUNBEAM_HEALTH_BOOST = 7;

CHROMOSOME_SPLIT_LIKELIHOOD_NORMALISER = 10;
CHROMOSOME_MUTATION_LIKELIHOOD_NORMALISER = 1;
CHROMOSOME_GROW_FLOWER_LIKELIHOOD_NORMALISER = 10;

WIDTH = 300;
HEIGHT = 150;
GROWTH_PER_SECOND = 100;
SUN_PER_SECOND = 100;
BEES_PER_SECOND = 10;

SUNBEAM_COLOUR = {
    'r' : 220,
    'g' : 220,
    'b' : 70,
    'a' : 0.05
};

BACKGROUND_COLOUR = {
    'r' : 170,
    'g' : 170,
    'b' : 255,
    'a' : 1
};

DEAD_PLANT_COLOUR = BACKGROUND_COLOUR;

window.onload = function() {
    var g = new Graphics(WIDTH, HEIGHT, 'render_canvas');
    var n = new Nature(WIDTH, HEIGHT);
    g.setup(n.get_changes.bind(n));
    g.draw_background(BACKGROUND_COLOUR.r, BACKGROUND_COLOUR.g, BACKGROUND_COLOUR.b, BACKGROUND_COLOUR.a);
    n.simulate();
};