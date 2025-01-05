mapboxgl.accessToken = 'pk.eyJ1IjoiY2dyYXkxMjA4IiwiYSI6ImNtM3FrNG82NTAzenoyanBuaWV3b2RwMG4ifQ.YyYLZRKo7yMJxD4j0VvpGQ';

const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/cgray1208/clry2521j017901p22zvx4y26',
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
            refreshOutlook(daySelection.selectedIndex + 1, riskSelection.options[riskSelection.selectedIndex].value);

            if ((daySelection.selectedIndex + 1) >= 3 && riskSelection.options[1].text == 'Tornado') {
                for (let i = 1; i < 3; i++) {
                    riskSelection.options.remove(i);
                }
                riskSelection.options[1].value = 'prob';
                riskSelection.options[1].text = 'Probabilistic';
            }

            if ((daySelection.selectedIndex + 1) < 3 && riskSelection.options[1].text == 'Probabilistic') {
                riskSelection.options[1].text = 'Tornado';
                riskSelection.options[1].value = 'Tornado';

                const windOption = document.createElement('option');
                windOption.text = 'Wind';
                windOption.value = 'wind';
                riskSelection.add(windOption);

                const hailOption = document.createElement('option');
                hailOption.text = 'Hail';
                hailOption.value = 'hail';
                riskSelection.add(hailOption);
            }
        });

        riskSelection.addEventListener('change', () => {
            refreshOutlook(daySelection.selectedIndex + 1, riskSelection.options[riskSelection.selectedIndex].value)
        });

        this.container.appendChild(daySelection);
        this.container.appendChild(riskSelection);
        return this.container;
    }

    onRemove() {
        this.map = undefined;
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

    map.addSource('outlookSource', {
        type: 'geojson',
        data: `https://www.spc.noaa.gov/products/outlook/day${day}otlk_${risk}.nolyr.geojson`
    });

    map.addLayer({
        id: 'outlook',
        type: 'fill',
        source: 'outlookSource',
        paint: {
            'fill-color': ['get', 'fill'],
            'fill-opacity': 0.5
        }
    });

    map.addLayer({
        id: 'outlook-outline',
        type: 'line',
        source: 'outlookSource',
        paint: {
            'line-color': ['get', 'stroke'],
        }
    });

    console.log(`https://www.spc.noaa.gov/products/outlook/day${day}otlk_${risk}.nolyr.geojson`)
}