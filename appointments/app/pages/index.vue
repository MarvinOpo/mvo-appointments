<template>
    <div class="landing">
        <!-- Home / Hero -->
        <section id="home" class="hero">
            <v-container class="py-16">
                <v-row align="center">
                    <v-col cols="12" md="6">
                        <p class="eyebrow">Vicente Sotto Memorial Medical Center</p>
                        <h1 class="headline">
                            Skip the line.<br />Not the checkup.
                        </h1>
                        <p class="subhead">
                            Book your appointment online and track your place in
                            queue from your phone — no need to stand around the
                            waiting area.
                        </p>
                        <div class="d-flex flex-wrap ga-3 mt-6">
                            <v-btn size="x-large" color="primary" class="cta-primary" @click="goToBooking">
                                Book an appointment
                            </v-btn>
                            <v-btn size="x-large" variant="tonal" color="secondary" @click="goToQueue">
                                Check my queue number
                            </v-btn>
                        </div>
                    </v-col>

                    <v-col cols="12" md="6">
                        <div class="ticket-wrap">
                            <div class="ticket">
                                <div class="ticket-top">
                                    <span class="ticket-label">VSMMC · Pediatrics</span>
                                    <span class="ticket-label">Today</span>
                                </div>

                                <div class="ticket-number">B–042</div>

                                <div class="ticket-row">
                                    <span>Now serving</span>
                                    <span class="ticket-strong">B–039</span>
                                </div>
                                <div class="ticket-row">
                                    <span>Ahead of you</span>
                                    <span class="ticket-strong">3</span>
                                </div>
                                <div class="ticket-row">
                                    <span>Estimated wait</span>
                                    <span class="ticket-strong">~15 min</span>
                                </div>

                                <div class="ticket-perforation">
                                    <span v-for="n in 14" :key="n" class="dash"></span>
                                </div>

                                <div class="ticket-footer">
                                    Ref. code · <span>7QJ2-K9</span>
                                </div>
                            </div>
                            <div class="notch notch-left"></div>
                            <div class="notch notch-right"></div>
                        </div>
                    </v-col>
                </v-row>
            </v-container>
        </section>

        <!-- About -->
        <section id="about" class="section">
            <v-container class="py-14">
                <v-row align="center">
                    <v-col cols="12" md="5">
                        <p class="eyebrow">About</p>
                        <h2 class="section-title">
                            A public hospital, made easier to reach
                        </h2>
                        <p class="subhead mt-4">
                            VSMMC Appointments lets patients book outpatient
                            consultations and follow the queue in real time, so
                            fewer people need to wait in line in person for a
                            number.
                        </p>
                    </v-col>

                    <v-col cols="12" md="7">
                        <v-row no-gutters class="text-center">
                            <v-col cols="12" sm="4">
                                <div class="stat">24/7</div>
                                <div class="stat-label">Online booking</div>
                            </v-col>
                            <v-col cols="12" sm="4">
                                <div class="stat">Live</div>
                                <div class="stat-label">Queue tracking</div>
                            </v-col>
                            <v-col cols="12" sm="4">
                                <div class="stat">Free</div>
                                <div class="stat-label">No booking fees</div>
                            </v-col>
                        </v-row>
                    </v-col>
                </v-row>
            </v-container>
        </section>

        <!-- How to use -->
        <section id="use" class="section section-alt">
            <v-container class="py-14">
                <v-row class="text-center mb-10">
                    <v-col cols="12">
                        <h2 class="text-h4 font-weight-bold mb-2">
                            How to use
                        </h2>
                        <p class="text-subtitle-1 text-grey">
                            Follow these simple steps to start your appointment.
                        </p>
                    </v-col>
                </v-row>

                <v-row justify="center" align="center" class="process-container flex-wrap">
                    <template v-for="(step, index) in steps" :key="index">
                        <v-col cols="auto" class="text-center mb-8">
                            <v-card elevation="2" max-width="280"
                                class="rounded-xl pa-6 d-flex flex-column align-center justify-center">
                                <v-avatar size="56" color="primary" class="mb-4">
                                    <span class="text-h6 font-weight-bold text-white">{{ index + 1 }}</span>
                                </v-avatar>

                                <h3 class="text-h6 font-weight-bold mb-2">{{ step.title }}</h3>
                                <p class="text-body-2 text-grey-darken-1">
                                    {{ step.description }}
                                </p>
                            </v-card>
                        </v-col>

                        <v-col v-if="index < steps.length - 1" cols="auto"
                            class="d-none d-md-flex align-center justify-center">
                            <v-icon color="primary" size="36">mdi-arrow-right-bold</v-icon>
                        </v-col>
                    </template>
                </v-row>
            </v-container>
        </section>

        <!-- Departments -->
        <section class="section">
            <v-container class="py-14">
                <div class="d-flex flex-wrap justify-space-between align-end mb-8 ga-4">
                    <h2 class="section-title mb-0">Departments open for booking</h2>
                    <v-btn variant="text" color="primary" @click="goToBooking">
                        View all departments
                        <v-icon end size="18">mdi-arrow-right</v-icon>
                    </v-btn>
                </div>

                <v-row>
                    <v-col v-for="dept in departments" :key="dept.name" cols="6" sm="4" md="2">
                        <div class="dept-card" @click="goToBooking">
                            <v-icon size="28" color="secondary">{{
                                dept.icon
                                }}</v-icon>
                            <span class="dept-name">{{ dept.name }}</span>
                        </div>
                    </v-col>
                </v-row>
            </v-container>
        </section>

        <!-- Contact -->
        <section id="contact" class="section section-alt">
            <v-container class="py-14">
                <v-row>
                    <v-col cols="12" md="5">
                        <p class="eyebrow">Contact</p>
                        <h2 class="section-title">Visit or reach us</h2>
                        <p class="subhead mt-4">
                            Have a concern about your appointment or queue
                            number? Reach the front desk directly.
                        </p>
                    </v-col>

                    <v-col cols="12" md="7">
                        <div class="contact-row">
                            <v-icon color="secondary" size="22">mdi-map-marker-outline</v-icon>
                            <span>B. Rodriguez St, Cebu City, 6000 Cebu</span>
                        </div>
                        <div class="contact-row">
                            <v-icon color="secondary" size="22">mdi-phone-outline</v-icon>
                            <span>(032) 000-0000</span>
                        </div>
                        <div class="contact-row">
                            <v-icon color="secondary" size="22">mdi-clock-outline</v-icon>
                            <span>Monday–Saturday, 8:00 AM–5:00 PM</span>
                        </div>
                        <div class="contact-row">
                            <v-icon color="secondary" size="22">mdi-email-outline</v-icon>
                            <span>appointments@vsmmc.gov.ph</span>
                        </div>
                    </v-col>
                </v-row>
            </v-container>
        </section>
    </div>
</template>

<script setup lang="ts">
const departments = [
    { name: "Pediatrics", icon: "mdi-baby-face-outline" },
    { name: "Internal medicine", icon: "mdi-stethoscope" },
    { name: "OB-GYNE", icon: "mdi-human-pregnant" },
    { name: "Surgery", icon: "mdi-medical-bag" },
    { name: "ENT", icon: "mdi-ear-hearing" },
    { name: "Dental", icon: "mdi-tooth-outline" },
];

const steps = [
    {
        title: "Select a profile",
        description: "Choose your own profile or a dependent's — kids, parents, anyone under your account.",
    },
    {
        title: "Fill out the details",
        description: "Tell us your complaint, pick the department, and choose an available time slot.",
    },
    {
        title: "Wait for confirmation",
        description: "We'll review your request and text you an online queue number once confirmed.",
    },
    {
        title: "Track your place, live",
        description: "Watch your position update in real time — no need to wait at the counter.",
    },
    {
        title: "Complete your visit",
        description: "Get seen in person or called for your teleconsult — then you're done.",
    }
];

const goToBooking = () => navigateTo("/book");
const goToQueue = () => navigateTo("/queue");
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=Public+Sans:wght@400;500;600&display=swap");

.landing {
    font-family: "Public Sans", sans-serif;
    color: #3a2e26;
}

section[id] {
    scroll-margin-top: 80px;
}

.eyebrow {
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #2f8f7b;
    margin-bottom: 12px;
}

.headline {
    font-family: "Fraunces", serif;
    font-weight: 600;
    font-size: clamp(2.2rem, 4vw, 3.2rem);
    line-height: 1.1;
    color: #3a2e26;
}

.subhead {
    font-size: 1.05rem;
    line-height: 1.6;
    color: #6b5c50;
    max-width: 460px;
}

.cta-primary {
    color: #fbe9e1 !important;
}

.hero {
    background: #fbf8f4;
}

/* Ticket stub */
.ticket-wrap {
    position: relative;
    max-width: 340px;
    margin: 0 auto;
}

.ticket {
    background: #fffdfb;
    border: 1px solid #e8ded3;
    border-radius: 14px;
    padding: 24px 22px 18px;
    box-shadow: 0 12px 30px rgba(93, 75, 65, 0.12);
    font-family: "Public Sans", monospace;
}

.ticket-top {
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    color: #9c8a7c;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    margin-bottom: 14px;
}

.ticket-number {
    font-family: "Fraunces", serif;
    font-weight: 600;
    font-size: 3rem;
    color: #d8582d;
    line-height: 1;
    margin-bottom: 16px;
    font-variant-numeric: tabular-nums;
}

.ticket-row {
    display: flex;
    justify-content: space-between;
    font-size: 13px;
    color: #6b5c50;
    padding: 4px 0;
}

.ticket-strong {
    font-weight: 600;
    color: #3a2e26;
    font-variant-numeric: tabular-nums;
}

.ticket-perforation {
    display: flex;
    justify-content: space-between;
    margin: 16px 0 12px;
}

.dash {
    width: 6px;
    height: 1px;
    background: #d8c9b8;
}

.ticket-footer {
    font-size: 12px;
    color: #9c8a7c;
    text-align: center;
}

.ticket-footer span {
    color: #3a2e26;
    font-weight: 600;
}

.notch {
    position: absolute;
    top: 50%;
    width: 22px;
    height: 22px;
    background: #fbf8f4;
    border-radius: 50%;
    transform: translateY(-50%);
}

.notch-left {
    left: -11px;
}

.notch-right {
    right: -11px;
}

/* Sections */
.section {
    background: #ffffff;
}

.section-alt {
    background: #fbf8f4;
}

.section-title {
    font-family: "Fraunces", serif;
    font-weight: 600;
    font-size: 1.7rem;
    color: #3a2e26;
}

.step {
    padding: 8px 4px;
}

.step-number {
    font-family: "Fraunces", serif;
    font-size: 1.4rem;
    color: #2f8f7b;
    margin-bottom: 8px;
}

.step-title {
    font-size: 1.05rem;
    font-weight: 600;
    margin-bottom: 6px;
    color: #3a2e26;
}

.step-text {
    font-size: 0.92rem;
    color: #6b5c50;
    line-height: 1.55;
}

.dept-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    text-align: center;
    padding: 20px 10px;
    border-radius: 12px;
    background: #ffffff;
    border: 1px solid #e8ded3;
    cursor: pointer;
    transition: border-color 0.15s ease, transform 0.15s ease;
}

.dept-card:hover {
    border-color: #2f8f7b;
    transform: translateY(-2px);
}

.dept-name {
    font-size: 0.85rem;
    font-weight: 500;
    color: #3a2e26;
}

.stat {
    font-family: "Fraunces", serif;
    font-size: 1.8rem;
    font-weight: 600;
    color: #d8582d;
}

.stat-label {
    font-size: 0.85rem;
    color: #6b5c50;
    margin-top: 2px;
}

.contact-row {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 0.95rem;
    color: #3a2e26;
    padding: 10px 0;
    border-bottom: 1px solid #e8ded3;
}

.contact-row:last-child {
    border-bottom: none;
}
</style>