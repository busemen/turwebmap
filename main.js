const map = new maplibregl.Map({
    container: 'map',
    style:
        'https://api.maptiler.com/maps/01968702-be94-7245-8107-c9d04b6e4d85/style.json?key=y8ezg67e2sizOVyTk9tS',
    center: [30.25, 59.95],
    zoom: 9
});

const closePoiModal = document.getElementById('close-details-modal')

// Генерация панели с информацией о poi
function renderPoiDetails(poiProperties) {
    const modal = document.getElementById("poi-details-modal");
    modal.innerHTML = `
        <h1 style="text-align: left">${poiProperties.Name_poi}</h1>
        <h2>Описание</h2><p>${poiProperties.description}</p>
    `;
}
map.on("load", async () => {
    // загружаем иконки для маркеров
    library = await map.loadImage('icons/library.png');
    theatre = await map.loadImage('icons/theatre.png');
    other = await map.loadImage('icons/other.png');

    map.addImage('library-icon', library.data);
    map.addImage('theatre-icon', theatre.data);
    map.addImage('other-icon', other.data);

    fetch("./data.geojson")
        .then((responce) => responce.json())
        .then((geojson) => {
            const poi = geojson
            // console.log(poi)

            poi.features.forEach((marker) => {
                // create a DOM element for the marker
                // console.log(marker.properties.img.url)
                const el = document.createElement('div');
                el.className = 'marker';
                el.style.backgroundImage =
                    `url(${marker.properties.img.url}/)`;
                el.style.width = `50px`;
                el.style.height = `50px`;

                // el.addEventListener('click', () => {
                //     window.alert(marker.properties.message);
                // });
                // add marker to map
                new maplibregl.Marker({ element: el })
                    .setLngLat(marker.geometry.coordinates)
                    .addTo(map);
            });



            // map.addSource("poi", {
            //     type: 'geojson',
            //     data: geojson
            // });

            // map.addLayer({
            //     id: 'poi-layer',
            //     source: 'poi',
            //     type: 'symbol',
            //     'layout': {
            //         'icon-image': [
            //             "match",
            //             ["get", "category"],
            //             "Театры", 'theatre-icon',
            //             "Библиотеки", 'library-icon',
            //             'other-icon'
            //         ],
            //         'icon-size': 0.05
            //     }

            // });

            // poi.features.map((f) => {
            //     document.getElementById(
            //         "list-all"
            //     ).innerHTML += `<div class="list-item">
            //     <h4>${f.properties["Name_poi"]}</h4>
            //     <a href='#' onclick="map.flyTo({center: [${f.geometry.coordinates}], zoom: 12})">Найти на карте</a>
            //     </div><hr>`;
            // })

        })
    map.on('click', 'poi-layer', (e) => {
        console.log(e.features[0].properties.img)
        poiProperty = e.features[0].properties
        renderPoiDetails(poiProperty)
        document.getElementById("poi-details-modal").style.display = "block";
        closePoiModal.style.display = "block";

    })

    map.on('mouseenter', 'poi-layer', () => {
        map.getCanvas().style.cursor = 'pointer';
    });

    map.on('mouseleave', 'poi-layer', () => {
        map.getCanvas().style.cursor = '';
    });
})

// добавляем кнопку закрытия окна
closePoiModal.addEventListener('click', () => {
    // When there is a "click"
    // it shows an alert in the browser
    document.getElementById("poi-details-modal").style.display = "none";
    closePoiModal.style.display = "none";
})
