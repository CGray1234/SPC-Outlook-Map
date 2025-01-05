mapboxgl.accessToken = 'pk.eyJ1IjoiY2dyYXkxMjA4IiwiYSI6ImNtM3FrNG82NTAzenoyanBuaWV3b2RwMG4ifQ.YyYLZRKo7yMJxD4j0VvpGQ';

const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/cgray1208/clry2521j017901p22zvx4y26',
    center: [-98.35, 39.5], // starting position [lng, lat]. Note that lat must be set between -90 and 90
    zoom: 4 // starting zoom
});

map.on('load', () => {
    map.addSource('day1conv', {
        type: 'geojson',
        data: 'https://www.spc.noaa.gov/products/outlook/day1otlk_cat.nolyr.geojson'
    });

    map.addSource('day1torn', {
        type: 'geojson',
        data: 'https://www.spc.noaa.gov/products/outlook/day1otlk_torn.nolyr.geojson'
    });

    map.addSource('day1wind', {
        type: 'geojson',
        data: 'https://www.spc.noaa.gov/products/outlook/day1otlk_wind.nolyr.geojson'
    });

    map.addSource('day1hail', {
        type: 'geojson',
        data: 'https://www.spc.noaa.gov/products/outlook/day1otlk_hail.nolyr.geojson'
    });

    map.addSource('day2conv', {
        type: 'geojson',
        data: 'https://www.spc.noaa.gov/products/outlook/day2otlk_cat.nolyr.geojson'
    });

    map.addSource('day2torn', {
        type: 'geojson',
        data: 'https://www.spc.noaa.gov/products/outlook/day2otlk_torn.nolyr.geojson'
    });

    map.addSource('day2wind', {
        type: 'geojson',
        data: 'https://www.spc.noaa.gov/products/outlook/day2otlk_wind.nolyr.geojson'
    });

    map.addSource('day2hail', {
        type: 'geojson',
        data: 'https://www.spc.noaa.gov/products/outlook/day2otlk_hail.nolyr.geojson'
    });

    map.addSource('day3conv', {
        type: 'geojson',
        data: 'https://www.spc.noaa.gov/products/outlook/day3otlk_cat.nolyr.geojson'
    });

    map.addSource('day3prob', {
        type: 'geojson',
        data: 'https://www.spc.noaa.gov/products/outlook/day3otlk_prob.nolyr.geojson'
    });
})

// Day 1
class outlookToggle {
    constructor(type, day) {
        this.type = type;
        this.day = day;
    }

    onAdd(map) {
        this.map = map;

        let fullType;

        if (this.type == 'conv') {
            fullType = 'Convective';
        } else if (this.type == 'torn') {
            fullType = 'Tornado';
        } else if (this.type == 'wind') {
            fullType = 'Wind';
        } else if (this.type == 'hail') {
            fullType = 'Hail';
        } else if (this.type == 'prob') {
            fullType = 'Probabilistic';
        }

        this.container = document.createElement('div');
        this.container.className = 'mapboxgl-ctrl mapboxgl-ctrl-group';

        const button = document.createElement('button');
        button.innerHTML = `Day ${this.day} ${fullType}`;
        button.style.width = 'fit-content';
        button.style.height = 'fit-content';
        button.style.padding = '5px'

        button.addEventListener('click', () => {
            const activeLayer = `day${this.day}${this.type}`;
            const activeOutlineLayer = `${activeLayer}-outline`;

            if (this.map.getLayer(activeLayer)) {
                this.map.removeLayer(activeLayer);
                this.map.removeLayer(activeOutlineLayer);
                return;
            }

            this.map.getStyle().layers.forEach((layer) => {
                if (layer.id.includes('day')) {
                    map.removeLayer(layer.id);
                }
            });

            map.addLayer({
                'id': `day${this.day}${this.type}`,
                'type': 'fill',
                'source': `day${this.day}${this.type}`,
                paint: {
                    'fill-color': ['get', 'fill'],
                    'fill-opacity': 0.5,
                }
            });

            map.addLayer({
                'id': `day${this.day}${this.type}-outline`,
                'type': 'line',
                'source': `day${this.day}${this.type}`,
                paint: {
                    'line-color': ['get', 'stroke'],
                }
            });
        });

        this.container.appendChild(button);
        return this.container;
    }

    onRemove() {
        this.container.parentNode.removeChild(this.container);
        this.map = undefined;
    }
}

const day1convButton = new outlookToggle('conv', 1);
map.addControl(day1convButton, 'top-left');

const day1tornButton = new outlookToggle('torn', 1);
map.addControl(day1tornButton, 'top-left');

const day1hailButton = new outlookToggle('hail', 1);
map.addControl(day1hailButton, 'top-left');

const day1windButton = new outlookToggle('wind', 1);
map.addControl(day1windButton, 'top-left');

const day2convButton = new outlookToggle('conv', 2);
map.addControl(day2convButton, 'top-left');

const day2tornButton = new outlookToggle('torn', 2);
map.addControl(day2tornButton, 'top-left');

const day2hailButton = new outlookToggle('hail', 2);
map.addControl(day2hailButton, 'top-left');

const day2windButton = new outlookToggle('wind', 2);
map.addControl(day2windButton, 'top-left');

const day3convButton = new outlookToggle('conv', 3);
map.addControl(day3convButton, 'top-left');

const day3probButton = new outlookToggle('prob', 3);
map.addControl(day3probButton, 'top-left');