mapboxgl.accessToken = 'pk.eyJ1IjoiY2dyYXkxMjA4IiwiYSI6ImNtM3FrNG82NTAzenoyanBuaWV3b2RwMG4ifQ.YyYLZRKo7yMJxD4j0VvpGQ';

const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/dark-v11',
    center: [-98.35, 39.5], // starting position [lng, lat]. Note that lat must be set between -90 and 90
    zoom: 4 // starting zoom
});

const selectionContainer = document.getElementById('dropdownsContainer');
const daySelection = document.getElementById('day-dropdown');
const riskSelection = document.getElementById('outlook-dropdown');

class outlookToggle {
    onAdd(map) {
        this.map = map;

        this.container = selectionContainer;
        this.container.className = 'mapboxgl-ctrl mapboxgl-ctrl-group';

        refreshOutlook(1, 'cat');

        daySelection.addEventListener('change', () => {
            if ((daySelection.selectedIndex + 1) == 3) {
                removeRiskOptions();

                riskSelection.options[0].text = 'Categorical';
                riskSelection.options[0].value = 'cat';

                let probSelection = document.createElement('option');
                probSelection.value = 'prob';
                probSelection.text = 'Probabilistic';
                riskSelection.add(probSelection);
            }

            if ((daySelection.selectedIndex + 1) > 3) {
                removeRiskOptions();

                riskSelection.options[0].text = 'Probabilistic';
                riskSelection.options[0].value = 'prob';
            }

            if ((daySelection.selectedIndex + 1) < 3) {
                removeRiskOptions();

                riskSelection.options[0].text = 'Categorical';
                riskSelection.options[0].value = 'cat';

                let torSelection = document.createElement('option');
                torSelection.value = 'torn';
                torSelection.text = 'Tornado';
                riskSelection.add(torSelection);

                let windSelection = document.createElement('option');
                windSelection.value = 'wind';
                windSelection.text = 'Wind';
                riskSelection.add(windSelection);

                let hailSelection = document.createElement('option');
                hailSelection.value = 'hail';
                hailSelection.text = 'Hail';
                riskSelection.add(hailSelection);
            }

            refreshOutlook(daySelection.selectedIndex + 1, riskSelection.options[riskSelection.selectedIndex].value);
        });

        riskSelection.addEventListener('change', () => {
            refreshOutlook(daySelection.selectedIndex + 1, riskSelection.options[riskSelection.selectedIndex].value);
        });

        this.container.appendChild(daySelection);
        this.container.appendChild(riskSelection);
        return this.container;
    }

    onRemove() {
        this.map = undefined;
    }
}

function removeRiskOptions() {
    var i, L = riskSelection.options.length - 1;
    for (i = L; i > 0; i--) {
        riskSelection.remove(i);
    }
}

map.on('load', () => {
    const yes = new outlookToggle();
    map.addControl(yes, 'top-left');
});

function refreshOutlook(day, risk) {
    if (map.getLayer('outlook')) {
        map.removeLayer('outlook');
    }

    if (map.getLayer('outlook-outline')) {
        map.removeLayer('outlook-outline');
    }

    if (map.getSource('outlookSource')) {
        map.removeSource('outlookSource');
    }

    if (day <= 3) {
        map.addSource('outlookSource', {
            type: 'geojson',
            data: `https://www.spc.noaa.gov/products/outlook/day${day}otlk_${risk}.nolyr.geojson`
        });
    } else {
        map.addSource('outlookSource', {
            type: 'geojson',
            data: `https://www.spc.noaa.gov/products/exper/day4-8/day${day}prob.nolyr.geojson`
        });
    }

    map.addLayer({
        id: 'outlook',
        type: 'fill',
        source: 'outlookSource',
        paint: {
            'fill-color': ['get', 'fill'],
            'fill-opacity': 0.5
        }
    }, 'admin-1-boundary-bg');

    map.addLayer({
        id: 'outlook-outline',
        type: 'line',
        source: 'outlookSource',
        paint: {
            'line-color': ['get', 'stroke'],
        }
    }, 'admin-1-boundary-bg');

    console.log(`https://www.spc.noaa.gov/products/outlook/day${day}otlk_${risk}.nolyr.geojson`)
}
