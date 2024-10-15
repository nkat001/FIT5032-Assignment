<template>
    <div class="clinic-table">
        <h1 class="mt-5 text-center">Clinics</h1>
        <div class="m-5">
            <DataTable :value="clinics" tableStyle="min-width: 50rem" :tableStyle="tableStyle" paginator stripedRows
                removableSort :rows="10" :rowsPerPageOptions="[5, 10, 20, 50]">
                <Column field="name" header="Clinic Name" sortable />
                <Column field="address" header="Address" />
                <Column header="Image">
                    <template #body="slotProps">
                        <img :src="slotProps.data.image" :alt="slotProps.data.name" class="clinic-image" />
                    </template>
                </Column>
                <Column header="Location">
                    <template #body="slotProps">
                        <a href="#" @click.prevent="getDirections(slotProps.data)">Get Directions</a>
                    </template>
                </Column>
            </DataTable>
        </div>
        <!-- Map container -->
        <div class="col-12 col-md-8 col-lg-6 offset-md-2 offset-lg-3 mb-5">
            <div id="map"></div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import mapboxgl from 'mapbox-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import MapboxDirections from '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions';

import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions.css';
import 'mapbox-gl/dist/mapbox-gl.css';

const clinics = ref([]);
const size = ref({ label: 'Normal', value: 'null' });
let directions;
let currentLatitude;
let currentLongitude;
let map;

const tableStyle = computed(() => {
    switch (size.value.value) {
        case 'small':
            return { 'font-size': '12px' };
        case 'large':
            return { 'font-size': '18px' };
        default:
            return { 'font-size': '14px' };
    }
});

onMounted(async () => {
    try {
        const response = await fetch('/clinics.json');
        clinics.value = await response.json();

        navigator.geolocation.getCurrentPosition((position) => {
            currentLongitude = position.coords.longitude
            currentLatitude = position.coords.latitude

            // Initialize Mapbox map
            mapboxgl.accessToken = 'pk.eyJ1IjoibmV0aGFyYTEwIiwiYSI6ImNtMjlvNTJqYTA3ZW4yb3ByNDE5aDRremQifQ.VmoerTNcvQS_DxuQ-GnhpA';
            map = new mapboxgl.Map({
                container: 'map',
                center: [currentLongitude, currentLatitude],
                zoom: 12
            });

            // Add marker to current location
            new mapboxgl.Marker()
                .setLngLat([currentLongitude, currentLatitude])
                .setPopup(new mapboxgl.Popup().setText('You are here'))
                .addTo(map);

            // Add the Geocoder control 
            map.addControl(
                new MapboxGeocoder({
                    accessToken: mapboxgl.accessToken,
                    mapboxgl: mapboxgl
                }),
                'top-right'
            );

            // Initialize Directions
            directions = new MapboxDirections({
                accessToken: mapboxgl.accessToken,
                unit: 'metric',
                profile: 'mapbox/driving',
                interactive: false,
                controls: {
                    inputs: false,
                    instructions: true
                }
            });
            map.addControl(directions, 'top-left');
        })
    } catch (error) {
        console.error('Error fetching clinics:', error);
    }
});

// Function to get directions
const getDirections = async (clinic) => {
    if (!navigator.geolocation) {
        alert("Geolocation is not supported by your browser");
        return;
    }

    // Get the user's current location
    navigator.geolocation.getCurrentPosition(
        (position) => {
            const userLocation = [position.coords.longitude, position.coords.latitude];
            const clinicAddress = clinic.location;

            // Set the waypoints for directions
            directions.setOrigin(userLocation);
            directions.setDestination(clinicAddress);
        },
        (error) => {
            console.error('Error getting location:', error);
            alert('Unable to retrieve your location. Please allow location access.');
        }
    );
}
</script>

<style scoped>
.clinic-image {
    width: 130px;
    height: 100px;
    border-radius: 5px;
}

#map {
    height: 500px;
    width: 100%;
    margin-top: 20px;
}
</style>
