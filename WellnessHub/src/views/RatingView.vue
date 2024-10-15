<template>
    <div class="container">
        <div class="row">
            <div class="col-12 col-md-8 col-lg-6 offset-md-2 offset-lg-3">
                <h1 class="p-5 text-center">Submit A Review</h1>
                <form @submit.prevent="submitForm">
                    <div class="row mb-3">
                        <div class="col-12 mb-3">
                            <label for="rating" class="form-label">Rating</label><br />
                            <select id="rating" class="form-select" v-model="formData.rating"
                                @blur="() => validateRating(true)" @input="() => validateRating(false)">
                                <option value="" disabled>Select A Rating</option>
                                <option value="1">1 - Poor</option>
                                <option value="2">2 - Fair</option>
                                <option value="3">3 - Good</option>
                                <option value="4">4 - Very Good</option>
                                <option value="5">5 - Excellent</option>
                            </select>
                            <div v-if="errors.rating" class="text-danger">{{ errors.rating }}</div>
                        </div>

                        <div>
                            <label for="review" class="form-label">Review</label><br />
                            <textarea id="review" name="review" rows="3" class="form-control"
                                @blur="() => validateReview(true)" @input="() => validateReview(false)"
                                v-model="formData.review"></textarea>
                            <div v-if="errors.review" class="text-danger">{{ errors.review }}</div>
                        </div>
                    </div>
                    <div class="col-12 text-center">
                        <button type="submit" class="btn btn-primary">Submit Review</button>
                    </div>
                </form>
                <h2 class="text-center mt-5">Average Rating: {{ averageRating }}/5</h2>
            </div>
        </div>
    </div>

    <!-- for the data table -->
    <div class="col-12 col-md-8 col-lg-6 offset-md-2 offset-lg-3 mt-5 text-center mb-5">
        <div class="flex justify-center text-center mb-3">
            <SelectButton v-model="size" :options="sizeOptions" optionLabel="label" dataKey="label" />
        </div>
        <div class="text-end mb-3">
            <select class="form-select form-select-md" style="width: 160px; background-color: #e0e0e0; color: #333;"
                @change="handleExport">
                <option value="" disabled selected hidden>Export Reviews</option>
                <option value="csv">Export as CSV</option>
                <option value="pdf">Export as PDF</option>
                <option value="xlsx">Export as Excel</option>
            </select>
        </div>
        <DataTable :value="reviewsAndRatings" ref="dt" :size="size.value" showGridlines stripedRows removableSort
            paginator :tableStyle="tableStyle" :rows="10" :rowsPerPageOptions="[5, 10, 20, 50]"
            table-style="min-width:50rem max-width:100rem">
            <Column field="rating" header="Rating" sortable style="width: 20%"></Column>
            <Column field="review" header="Review" style="width: 40%"></Column>
        </DataTable>
    </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import SelectButton from 'primevue/selectbutton';
import { FilterMatchMode } from '@primevue/core/api';
import InputText from 'primevue/inputtext';
import { getAuth } from 'firebase/auth';
import { doc, getFirestore, setDoc, getDocs, collection } from 'firebase/firestore';
import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';

let dt = ref();
const auth = getAuth();
const firestore = getFirestore();

const size = ref({ label: 'Normal', value: 'null' });
const sizeOptions = ref([
    { label: 'Small', value: 'small' },
    { label: 'Normal', value: 'null' },
    { label: 'Large', value: 'large' }
]);

// Computed property to handle dynamic table size
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

const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    rating: { value: null, matchMode: FilterMatchMode.CONTAINS },
    review: { value: null, matchMode: FilterMatchMode.CONTAINS },
});

const formData = ref({
    rating: '',
    review: '',
})

const errors = ref({
    rating: null,
    review: null
})

const ratings = ref([])
const reviews = ref([])
const reviewsAndRatings = ref([])

const validateRating = (blur) => {
    if (formData.value.rating === '') {
        errors.value.rating = blur ? 'Rating cannot be empty' : null
    } else {
        errors.value.rating = null
    }
}

const validateReview = (blur) => {
    if (formData.value.review.length < 10) {
        errors.value.review = blur ? 'Review must be at least 10 characters long' : null
    } else {
        errors.value.review = null
    }
}

// Export to CSV
const exportCSV = () => {
    dt.value.exportCSV();
};

// Export to PDF
const exportPDF = () => {
    const doc = new jsPDF;
    doc.text('Ratings and Reviews', 10, 10);
    reviewsAndRatings.value.forEach((item, index) => {
        doc.text(`${index + 1}. Rating: ${item.rating}, Review: ${item.review}`, 10, 20 + index * 10);
    });
    doc.save('reviews.pdf');
};

// Export to XLSX
const exportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(reviews.value);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Reviews");
    XLSX.writeFile(workbook, 'reviews.xlsx');
}

const handleExport = (event) => {
    const selectedOption = event.target.value;

    switch (selectedOption) {
        case 'csv':
            exportCSV();
            break;
        case 'pdf':
            exportPDF();
            break;
        case 'xlsx':
            exportExcel();
            break;
        default:
            console.log("No export option selected");
    }
};

const submitForm = async () => {
    validateRating(true)
    validateReview(true)

    try {
        if (!errors.value.rating && !errors.value.review) {
            const currentUser = auth.currentUser.uid
            await setDoc(doc(firestore, 'ratings', currentUser), {
                rating: formData.value.rating
            })
            await setDoc(doc(firestore, 'reviews', currentUser), {
                review: formData.value.review
            })
            await setDoc(doc(firestore, 'reviewsAndRatings', currentUser), {
                rating: formData.value.rating,
                review: formData.value.review
            })
        }
        console.log('Review submitted');
        alert('Thank you for your review')
        formData.value = { rating: '', review: '' }
        window.location.href = '/review'
    } catch (error) {
        console.error('Error occured when adding reviews: ', error)
    }
}

// Fetch ratings from Firestore on component mount
const fetchRatings = async () => {
    const querySnapshot = await getDocs(collection(firestore, 'ratings'));
    querySnapshot.forEach((doc) => {
        ratings.value.push(parseFloat(doc.data().rating));
    });
};

// Fetch reviews from Firestore on component mount
const fetchReviews = async () => {
    const querySnapshot = await getDocs(collection(firestore, 'reviews'));
    querySnapshot.forEach((doc) => {
        reviews.value.push(parseFloat(doc.data().review));
    });
};

// Fetch ratings from Firestore on component mount
const fetchRatingsAndReviews = async () => {
    const querySnapshot = await getDocs(collection(firestore, 'reviewsAndRatings'));
    querySnapshot.forEach((doc) => {
        reviewsAndRatings.value.push((doc.data()));
    });
};

onMounted(async () => {
    await fetchRatings();
    await fetchReviews();
    await fetchRatingsAndReviews();
})

const averageRating = computed(() => {
    if (ratings.value.length === 0) return 0
    const sum = ratings.value.reduce((acc, rating) => acc + parseFloat(rating), 0)
    return (sum / ratings.value.length).toFixed(2)
})
</script>

<style scoped>
.card {
    border: 1px solid #ccc;
    border-radius: 10px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.card-header {
    background-color: #729cf7;
    color: white;
    padding: 10px;
    border-radius: 10px 10px 0 0;
}

.list-group-item {
    padding: 10px;
}
</style>
