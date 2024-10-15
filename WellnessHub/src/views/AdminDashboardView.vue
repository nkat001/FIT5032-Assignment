<template>
    <div class="admin-dashboard">
        <div class="col-12 col-md-8 col-lg-6 offset-md-2 offset-lg-3 mt-5 text-center mb-5">
            <h2 class="text-center m-5">User Overview</h2>
            <div class=".chart-container">
                <Chart type="doughnut" :data="chartData" :canvasProps="{ 'role': 'img', 'aria-label': 'Data' }" />
            </div>
        </div>
    </div>
</template>

<script>
import { collection, getDocs } from "firebase/firestore";
import db from "../../firebase/init";
import { ref, onMounted } from 'vue';
import Chart from 'primevue/chart';

export default {
    components: {
        Chart
    },
    setup() {
        const chartData = ref({
            labels: ['Number of Patients', 'Number of Staff'],
            datasets: [
                {
                    backgroundColor: ['#66BB6A', '#FFA726'],
                    data: [0, 0]
                }
            ]
        });

        onMounted(async () => {
            const userTypes = await fetchUserData();
            chartData.value.datasets[0].data = [userTypes.patient, userTypes.staff];
        });

        return {
            chartData
        };
    }
};

const fetchUserData = async () => {
    const usersSnapshot = await getDocs(collection(db, "users"));
    const users = usersSnapshot.docs.map(doc => doc.data());

    const userTypes = {
        patient: 0,
        staff: 0
    };

    users.forEach(user => {
        if (user.userType === 'Patient') userTypes.patient++;
        if (user.userType === 'Staff') userTypes.staff++;
    });

    return userTypes;
};

</script>

<style scoped>
.chart-container {
    display: block;
    box-sizing: border-box;
    height: 400px;
    width: 400px;
    justify-content: center;
    justify-items: center;
}
</style>