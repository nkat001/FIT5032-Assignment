<template>
    <h1 class="p-5 text-center">Send Bulk Emails</h1>

    <!-- Search Input -->
    <div class="text-center mb-3">
        <input type="text" v-model="searchQuery" placeholder="Search users by name or email..." class="form-control"
            style="width: 50%; margin: auto;" />
    </div>

    <!-- DataTable for users -->
    <div class="col-12 col-md-8 col-lg-6 offset-md-2 offset-lg-3 text-center mb-5">
        <DataTable :value="filteredUsers" v-model:selection="selectedUsers" ref="dt" showGridlines removableSort
            paginator :tableStyle="tableStyle" :rows="10" :rowsPerPageOptions="[5, 10, 20, 50]" :rowClass="getRowClass"
            table-style="min-width:50rem max-width:100rem" class="table-hover">

            <!-- Name, Email, and Type Columns -->
            <Column field="username" header="Name" sortable style="width: 20%"></Column>
            <Column field="email" header="Email" style="width: 30%"></Column>
            <Column field="userType" header="Type" sortable style="width: 20%"></Column>

            <!-- Checkbox for selecting users -->
            <Column selectionMode="multiple" headerStyle="width: 5%" />
        </DataTable>
    </div>

    <!-- Button to Send Bulk Email -->
    <div class="text-center mb-5">
        <button @click="scrollToEmailForm" class="btn btn-primary">Send Bulk Email</button>
    </div>

    <!-- Email Form for Subject and Message -->
    <div v-if="showEmailForm" ref="emailFormRef" class="col-12 col-md-8 col-lg-6 offset-md-2 offset-lg-3">
        <h3 class="text-center">Email Details</h3>
        <form @submit.prevent="sendBulkEmail">
            <div class="mb-3">
                <label for="subject" class="form-label">Subject:</label>
                <input v-model="subject" class="form-control" type="text" id="subject" autocomplete="off" required />
            </div>
            <div class="mb-3">
                <label for="message" class="form-label">Message:</label>
                <textarea v-model="message" class="form-control" id="message" required rows="5"></textarea>
            </div>
            <div class="text-center mt-3 mb-5">
                <button type="button" @click="generateContent" class="btn btn-secondary me-3">Generate Content</button>
                <button type="submit" class="btn btn-success me-3">Send Emails</button>
                <button type="button" @click="showEmailForm = false" class="btn btn-secondary ml-2">Cancel</button>
            </div>
        </form>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { GoogleGenerativeAI } from "@google/generative-ai";

// Firestore instance
const db = getFirestore();

// Reactive variables for users and selected users
const users = ref([]);
const selectedUsers = ref([]);
const subject = ref('');
const message = ref('');
const showEmailForm = ref(false);
const emailFormRef = ref(null);
const searchQuery = ref('');
const GEMINI_API_KEY = 'AIzaSyBws0FAlpWcwrrT1E7Lyq8rk6J-yl41CJI'

// Fetch users from Firestore
const fetchUsers = async () => {
    const querySnapshot = await getDocs(collection(db, 'users'));
    users.value = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));
};

// Computed property for filtered users based on search query
const filteredUsers = computed(() => {
    if (!searchQuery.value) return users.value;
    return users.value.filter(user => {
        return user.username.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.value.toLowerCase());
    });
});

// Scroll to email form
const scrollToEmailForm = () => {
    showEmailForm.value = true;
    if (emailFormRef.value) {
        emailFormRef.value.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
};

// Send bulk email
const sendBulkEmail = async () => {
    if (selectedUsers.value.length === 0) {
        alert('No users selected!');
        return;
    }

    const emailList = selectedUsers.value.map(user => user.email);

    try {
        await fetch('http://localhost:3000/send-bulk-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                recipients: emailList,
                subject: subject.value,
                message: message.value,
            }),
        });
        alert('Emails sent successfully!');
        showEmailForm.value = false;
        resetFields();
    } catch (error) {
        console.error('Error sending emails:', error);
        alert('Failed to send emails');
    }
};

// Generate content using Gemini
const generateContent = async () => {
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `Create an email about our new services. Subject: ${subject.value}`;
    try {
        const result = await model.generateContent(prompt);
        message.value = result.response.text(); // Update message with generated content
    } catch (error) {
        console.error("Error generating content:", error);
        alert("Failed to generate email content.");
    }
};

// Reset the fields
const resetFields = () => {
    subject.value = '';
    message.value = '';
    selectedUsers.value = [];
};

// Fetch users when the component is mounted
onMounted(() => {
    fetchUsers();
});
</script>

<style>
.table-hover tbody tr:hover {
    background-color: #e0dfdf;
}
</style>
