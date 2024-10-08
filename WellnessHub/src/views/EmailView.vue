<template>
    <div class="container">
        <div class="row">
            <div class="col-12 col-md-8 col-lg-6 offset-md-2 offset-lg-3">
                <h1 class="p-5 text-center">Send Email</h1>
                <form @submit.prevent="sendEmail">
                    <div class="row mb-3">
                        <div class="col-12 mb-3">
                            <label for="recipient" class="form-label">Recipient Email:</label>
                            <input v-model="recipientEmail" class="form-control" type="email" id="recipient" required />
                        </div>
                        <div class="col-12 mb-3">
                            <label for="subject" class="form-label">Subject:</label>
                            <input v-model="subject" class="form-control" type="text" id="subject" required />
                        </div>
                        <div class="col-12 mb-3">
                            <label for="message" class="form-label">Message:</label>
                            <textarea v-model="message" class="form-control" id="message" required></textarea>
                        </div>
                        <div class="col-12 mb-3">
                            <label for="attachment" class="form-label">Select File:</label>
                            <input type="file" class="form-control" @change="handleFileUpload" id="attachment" />
                        </div>
                        <div class="col-12 text-center mt-3">
                            <button type="submit" class="btn btn-primary">Send Email</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
import { ref } from 'vue';

export default {
    setup() {
        return {
            recipientEmail: ref(""),
            subject: ref(""),
            message: ref(""),
            file: ref(null),
        };
    },
    methods: {
        handleFileUpload(event) {
            this.file = event.target.files[0];
        },

        // Sends the email by making a request to the backend
        async sendEmail() {
            const formData = new FormData();
            formData.append("recipientEmail", this.recipientEmail);
            formData.append("subject", this.subject);
            formData.append("message", this.message);
            formData.append("attachment", this.file);

            try {
                await fetch("http://localhost:3000/send-email", {
                    method: "POST",
                    body: formData,
                });
                alert("Email sent successfully!");
                this.$router.push('/')
                window.location.href = '/'
                this.resetFields()
            } catch (error) {
                console.error("Error sending email:", error);
            }
        },
        resetFields() {
            this.recipientEmail = "";
            this.subject = "";
            this.message = '';
            this.file = null;
        }
    },
};
</script>