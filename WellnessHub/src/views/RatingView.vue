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
    <!-- for the cards -->
    <div class="row mt-5" v-if="submittedCards.length">
        <div class="d-flex flex-wrap justify-content-center">
            <div v-for="(card, index) in submittedCards" :key="index" class="card m-2" style="width: 18rem">
                <div class="card-header">Rating</div>
                <ul class="list-group list-group-flush">
                    <li class="list-group-item">Rating: {{ card.rating }}</li>
                    <li class="list-group-item">Review: {{ card.review }}</li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import DOMPurify from 'dompurify';

const ratings = ref(JSON.parse(localStorage.getItem('ratings')) || [])
const submittedCards = ref(JSON.parse(localStorage.getItem('submittedCards')) || [])

const formData = ref({
    rating: '',
    review: '',
})

const errors = ref({
    rating: null,
    review: null
})

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

const submitForm = () => {
    validateRating(true)
    validateReview(true)
    if (!errors.value.rating && !errors.value.review) {
        const sanitizedReview = DOMPurify.sanitize(formData.value.review)
        console.log("sani : " + sanitizedReview);
        
        const newCard = { rating: formData.value.rating, review: sanitizedReview }
        submittedCards.value.push(newCard)
        ratings.value.push(formData.value.rating)

        localStorage.setItem('submittedCards', JSON.stringify(submittedCards.value))
        localStorage.setItem('ratings', JSON.stringify(ratings.value))

        formData.value = { rating: '', review: '' }
    }
}

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
