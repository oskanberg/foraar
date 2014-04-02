# forår
forår is a (pure js) plant evolution simulation. forår is the Danish word for 'spring'.

---
##Simulation
### Plants
Plants consist of stems and flowers.

Each plant has a 'chromosome', which contains:
  - ```growth_direction_bias ``` : object representing the plant's growing direction preference
  - ```split_likelihood``` : likelihood the branch of this plant will 'split' in two
  - ```grow_flower_likelihood``` : likelihood this plant will grow a flower at any growth point
  - ```mutation_likelihood``` : likelihood that the descendent of this plant will mutate any of these variables
  - ```plant_colour``` : colour of the plant (stem/trunk)
  - ```flower_colour``` : colour of this plant's flowers


Each plant has a 'health' value which decreases at a constant rate. This value is also decreased when the plant:
  - grows a flower
  - tries to grow somewhere it can't (because something occupies the space)

### The Sun
Rays of sunlight are sampled at a constant interval. They are projected vertically downwards, and the plant that receives the light gains some parameterised amount of health.

### Bees
Bees are simulated (in the loosest sense possible) for plant reproduction. At a constant interval, a random flower is chosen. A 'seed' (i.e. new plant) appears on the ground according to the position of the flower (the higher the flower the farther the seed may fall). If the seed lands on an occupied spot, it dies.

### Parameters
The following global parameters are available for tweaking.
```javascript
INITIAL_PLANT_HEALTH
SUNBEAM_HEALTH_BOOST
CHROMOSOME_SPLIT_LIKELIHOOD_NORMALISER
CHROMOSOME_MUTATION_LIKELIHOOD_NORMALISER
CHROMOSOME_GROW_FLOWER_LIKELIHOOD_NORMALISER
GROWTH_PER_SECOND
SUN_PER_SECOND
BEES_PER_SECOND
WIDTH
HEIGHT
```
Note that ```HEIGHT``` and ```WIDTH``` do not refer to the height and width of the canvas as it is displayed in the page. They refer to the height and width of the simulation area, which is projected onto a full-screen canvas.

---
## Graphics & Compatibility
The simulation is displayed in a low resolution, mostly for aesthetic reasons.

As Dominic Szablewski wrote, [drawing a canvas with larger-than-normal pixels is hard](http://phoboslab.org/log/2012/09/drawing-pixels-is-hard), because of the way various browsers use bilinear filtering on images - including a canvas - and there's no standard way of mitigating it.

The simulation is rendered to an invisible canvas with small (200 x 100 default) resolution. On every ```requestAnimationFrame``` callback, an image is created with ```src``` set to the data URL of this canvas. This image data is then rendered to a full-size canvas. I make sure that:
```javascript
imageSmoothingEnabled = false;
webkitImageSmoothingEnabled = false;
mozImageSmoothingEnabled = false;
```
and this seems to work well in the most recent Chromium and Firefox. I suspect it won't work on IE, or in much older versions of any browser.
