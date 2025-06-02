<template>
    <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6">
        <div class="mx-auto max-w-full">
            <div class="shadow-xl border-0 bg-white mb-8 rounded-lg">
                <div class="bg-gradient-to-r from-gray-800 to-black text-white rounded-t-lg p-8 md:p-12 text-center">
                    <div class="w-20 h-20 bg-white/10 rounded-lg flex items-center justify-center mx-auto mb-6">
                        <svg class="w-10 h-10" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                            <path d="M3 21v-2a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v2" />
                            <circle cx="12" cy="7" r="4" />
                        </svg>
                    </div>
                    <h1 class="text-4xl md:text-5xl font-bold mb-4">About HITMDT</h1>
                    <p class="text-gray-300 text-2xl md:text-xl max-w-3xl mx-auto leading-relaxed">
                        Bringing you an exceptional shopping experience with quality products and dedicated service.
                        We've been
                        transforming Vietnamese homes with premium furniture for over a decade.
                    </p>
                    <div class="flex flex-wrap justify-center gap-4 mt-6">
                        <span
                            class="bg-white/10 text-xl text-white border-white/20 px-4 py-2 rounded inline-flex items-center justify-center mr-3">
                            <StarIcon size="8" color="white" class="mr-2" />
                            Trusted by 50,000+ Customers
                        </span>
                        <span
                            class="bg-white/10 text-xl text-white border-white/20 px-4 py-2 rounded inline-flex items-center justify-center">
                            <DeliveryIcon size="8" color="white" class="mr-2" />
                            Nationwide Delivery
                        </span>
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div v-for="stat in stats" :key="stat.label" class="shadow-xl border-0 bg-white text-center rounded-lg">
                    <div class="p-6">
                        <div
                            class="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center mx-auto mb-4">
                            <component :is="stat.icon" class="w-8 h-8 text-gray-600" />
                        </div>
                        <div class="text-3xl font-bold text-gray-900 mb-2">{{ stat.value }}</div>
                        <div class="text-xl font-semibold text-gray-800 mb-1">{{ stat.label }}</div>
                        <div class="text-xl text-gray-600">{{ stat.description }}</div>
                    </div>
                </div>
            </div>

            <div class="shadow-xl border-0 bg-white mb-8 rounded-lg text-xl">
                <div class="flex flex-wrap border-b border-gray-200">
                    <button v-for="tab in tabs" :key="tab.id" @click="activeTab = tab.id"
                        :class="['flex-1 min-w-[200px] py-4 px-6 text-center font-medium transition-colors flex items-center justify-center gap-2 text-2xl',
                            activeTab === tab.id ? 'border-b-2 border-gray-800 text-gray-800 bg-gray-50' : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50']">
                        <component :is="tab.icon" size="8" />
                        {{ tab.label }}
                    </button>
                </div>
            </div>

            <div v-if="activeTab === 'story'" class="space-y-8">
                <div class="shadow-xl border-0 bg-white rounded-lg">
                    <div class="bg-gray-50 border-b border-gray-200 rounded-t-lg p-6">
                        <h2 class="text-3xl font-bold text-gray-800">Our Journey</h2>
                        <p class="text-xl text-gray-600">From humble beginnings to market leadership</p>
                    </div>
                    <div class="p-8 text-xl">
                        <div>
                            <h3 class="text-3xl font-semibold text-gray-900 mb-4">The HITMDT Story</h3>
                            <p class="text-gray-700 leading-relaxed mb-4">
                                Founded in 2014, HITMDT began as a small furniture workshop in Da Nang with a simple
                                mission: to
                                create beautiful, functional furniture that enhances Vietnamese homes. Our founders,
                                passionate
                                about craftsmanship and design, started with just a handful of skilled artisans and
                                a commitment
                                to quality.
                            </p>
                            <p class="text-gray-700 leading-relaxed mb-4">
                                Over the years, we've grown from a local workshop to a nationwide furniture
                                retailer, but our core
                                values remain unchanged. We believe that furniture is more than just functional
                                items – they're
                                the foundation of comfortable, beautiful living spaces where families create
                                memories.
                            </p>
                            <p class="text-gray-700 leading-relaxed">
                                Today, HITMDT serves over 50,000 satisfied customers across Vietnam, offering
                                everything from
                                modern minimalist designs to traditional Vietnamese furniture, all crafted with the
                                same attention
                                to detail that defined our early days.
                            </p>
                        </div>
                    </div>
                </div>
                <!-- Timeline -->
                <div class="shadow-xl border-0 bg-white rounded-lg">
                    <div class="bg-gray-50 border-b border-gray-200 rounded-t-lg p-6">
                        <h2 class="text-3xl font-bold text-gray-800">Our Timeline</h2>
                        <p class="text-xl text-gray-600">Key milestones in our journey</p>
                    </div>
                    <div class="p-8 space-y-8">
                        <div v-for="(item, index) in timeline" :key="index" class="flex gap-6">
                            <div class="flex flex-col items-center">
                                <div
                                    class="w-12 h-12 bg-gradient-to-br from-gray-800 to-gray-900 rounded-full flex items-center justify-center text-white font-bold">
                                    {{ item.year.slice(-2) }}
                                </div>
                                <div v-if="index < timeline.length - 1" class="w-0.5 h-16 bg-gray-300 mt-4" />
                            </div>
                            <div class="flex-1 pb-8">
                                <div class="text-3xl flex items-center gap-3 mb-2">
                                    <span class="text-xl font-bold text-gray-900">{{ item.year }}</span>
                                    <span
                                        class="text-gray-600 border border-gray-300 rounded px-2 py-0.5 text-xs">Milestone</span>
                                </div>
                                <h4 class="text-3xl font-semibold text-gray-800 mb-2">{{ item.title }}</h4>
                                <p class="text-gray-600 text-xl">{{ item.description }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div v-else-if="activeTab === 'values'" class="space-y-8">
                <div class="shadow-xl border-0 bg-white rounded-lg">
                    <div class="bg-gray-50 border-b border-gray-200 rounded-t-lg p-6">
                        <h2 class="text-3xl font-bold text-gray-800">Our Core Values</h2>
                        <p class="text-lg text-gray-600">The principles that guide everything we do</p>
                    </div>
                    <div class="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div v-for="(value, index) in values" :key="index" class="flex gap-4">
                            <div
                                class="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                                <component :is="value.icon" size="8" />
                            </div>
                            <div>
                                <h3 class="text-xl font-semibold text-gray-900 mb-2">{{ value.title }}</h3>
                                <p class="text-gray-600 leading-relaxed text-xl">{{ value.description }}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div class="shadow-xl border-0 bg-white rounded-lg">
                        <div class="bg-gradient-to-r from-gray-700 to-gray-900 text-white rounded-t-lg p-6">
                            <h3 class="text-xl font-bold flex items-center gap-2">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2"
                                    viewBox="0 0 24 24">
                                    <circle cx="12" cy="12" r="10" />
                                    <path d="M2 12h20" />
                                    <path
                                        d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10A15.3 15.3 0 0 1 12 2z" />
                                </svg>
                                Our Mission
                            </h3>
                        </div>
                        <div class="p-6">
                            <p class="text-gray-700 leading-relaxed text-xl">
                                To provide exceptional furniture solutions that enhance the quality of life for
                                Vietnamese families,
                                combining traditional craftsmanship with modern design and sustainable practices.
                            </p>
                        </div>
                    </div>
                    <div class="shadow-xl border-0 bg-white rounded-lg">
                        <div class="text-2xl bg-gradient-to-r from-gray-600 to-gray-800 text-white rounded-t-lg p-6">
                            <h3 class="text-xl font-bold flex items-center gap-2">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2"
                                    viewBox="0 0 24 24">
                                    <circle cx="12" cy="12" r="10" />
                                    <path d="M2 12h20" />
                                    <path
                                        d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10A15.3 15.3 0 0 1 12 2z" />
                                </svg>
                                Our Vision
                            </h3>
                        </div>
                        <div class="p-6">
                            <p class="text-gray-700 leading-relaxed text-xl">
                                To become Southeast Asia's most trusted furniture brand, known for innovation,
                                sustainability, and
                                creating beautiful living spaces that bring families together.
                            </p>
                        </div>
                    </div>
                </div>
                <div class="shadow-xl border-0 bg-white rounded-lg">
                    <div class="bg-gray-50 border-b border-gray-200 rounded-t-lg p-6">
                        <h2 class="text-3xl font-bold text-gray-800">Certifications & Standards</h2>
                        <p class="text-lg text-gray-600">Our commitment to quality and sustainability</p>
                    </div>
                    <div class="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div v-for="(cert, index) in certifications" :key="index"
                            class="text-center p-4 border border-gray-200 rounded-lg">
                            <svg class="w-9 h-9 text-green-600 mx-auto mb-3" fill="none" stroke="currentColor"
                                stroke-width="2" viewBox="0 0 24 24">
                                <circle cx="12" cy="12" r="10" />
                                <path d="M9 12l2 2l4-4" />
                            </svg>
                            <h4 class="font-semibold text-xl text-gray-900 mb-1">{{ cert.name }}</h4>
                            <p class="text-lg text-gray-600">{{ cert.description }}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div v-else-if="activeTab === 'achievements'" class="space-y-8">
                <div class="shadow-xl border-0 bg-white rounded-lg">
                    <div class="bg-gray-50 border-b border-gray-200 rounded-t-lg p-6">
                        <h2 class="text-3xl font-bold text-gray-800">Awards & Recognition</h2>
                        <p class="text-xl text-gray-600">Industry recognition for our excellence</p>
                    </div>
                    <div class="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div v-for="(award, index) in awards" :key="index"
                            class="border border-gray-200 rounded-lg p-6 text-center">
                            <svg class="w-9 h-9 text-yellow-600 mx-auto mb-4" fill="none" stroke="currentColor"
                                stroke-width="2" viewBox="0 0 24 24">
                                <circle cx="12" cy="12" r="10" />
                                <path d="M9 12l2 2l4-4" />
                            </svg>
                            <span class="mb-3 inline-block border border-gray-300 rounded px-2 py-0.5 text-base">{{
                                award.year }}</span>
                            <h3 class="font-semibold text-2xl text-gray-900 mb-2">{{ award.title }}</h3>
                            <p class="text-xl text-gray-600 font-medium mb-2">{{ award.organization }}</p>
                            <p class="text-lg text-gray-500">{{ award.description }}</p>
                        </div>
                    </div>
                </div>
                <div class="shadow-xl border-0 bg-white rounded-lg">
                    <div class="bg-gray-50 border-b border-gray-200 rounded-t-lg p-6">
                        <h2 class="text-3xl font-bold text-gray-800">Social Responsibility</h2>
                        <p class="text-xl text-gray-600">Our commitment to community and environment</p>
                    </div>
                    <div class="p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div>
                            <h3 class="text-xl font-semibold text-gray-900 mb-4">Community Initiatives</h3>
                            <ul class="space-y-4">
                                <li class="flex gap-3">
                                    <svg class="w-5 h-5 text-red-500 mt-0.5" fill="none" stroke="currentColor"
                                        stroke-width="2" viewBox="0 0 24 24">
                                        <path
                                            d="M12 21C12 21 7 16.5 7 12.5C7 9.5 9.5 7 12 7C14.5 7 17 9.5 17 12.5C17 16.5 12 21 12 21Z" />
                                    </svg>
                                    <div>
                                        <p class="font-medium text-xl text-gray-900">Education Support Program</p>
                                        <p class="text-lg text-gray-600">Providing furniture for schools in rural
                                            areas
                                            across Vietnam</p>
                                    </div>
                                </li>
                                <li class="flex gap-3">
                                    <svg class="w-5 h-5 text-blue-500 mt-0.5" fill="none" stroke="currentColor"
                                        stroke-width="2" viewBox="0 0 24 24">
                                        <circle cx="12" cy="12" r="10" />
                                        <path d="M8 12l2 2l4-4" />
                                    </svg>
                                    <div>
                                        <p class="font-medium text-xl text-gray-900">Artisan Training</p>
                                        <p class="text-lg text-gray-600">Training local craftsmen in traditional and
                                            modern furniture making</p>
                                    </div>
                                </li>
                                <li class="flex gap-3">
                                    <svg class="w-5 h-5 text-green-500 mt-0.5" fill="none" stroke="currentColor"
                                        stroke-width="2" viewBox="0 0 24 24">
                                        <rect x="3" y="11" width="18" height="10" rx="2" />
                                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                    </svg>
                                    <div>
                                        <p class="font-medium text-xl text-gray-900">Disaster Relief</p>
                                        <p class="text-lg text-gray-600">Emergency furniture donations for families
                                            affected by natural disasters</p>
                                    </div>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h3 class="text-xl font-semibold text-gray-900 mb-4">Environmental Commitment</h3>
                            <ul class="space-y-4">
                                <li class="flex gap-3">
                                    <svg class="w-5 h-5 text-green-500 mt-0.5" fill="none" stroke="currentColor"
                                        stroke-width="2" viewBox="0 0 24 24">
                                        <circle cx="12" cy="12" r="10" />
                                        <path d="M2 12h20" />
                                        <path
                                            d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10A15.3 15.3 0 0 1 12 2z" />
                                    </svg>
                                    <div>
                                        <p class="font-medium text-xl text-gray-900">Sustainable Materials</p>
                                        <p class="text-lg text-gray-600">Using only FSC-certified wood and
                                            eco-friendly
                                            materials</p>
                                    </div>
                                </li>
                                <li class="flex gap-3">
                                    <svg class="w-5 h-5 text-blue-500 mt-0.5" fill="none" stroke="currentColor"
                                        stroke-width="2" viewBox="0 0 24 24">
                                        <path d="M3 12h18" />
                                        <path d="M12 3v18" />
                                    </svg>
                                    <div>
                                        <p class="font-medium text-xl text-gray-900">Carbon Neutral Delivery</p>
                                        <p class="text-lg text-gray-600">Offsetting delivery emissions through
                                            reforestation projects</p>
                                    </div>
                                </li>
                                <li class="flex gap-3">
                                    <svg class="w-5 h-5 text-purple-500 mt-0.5" fill="none" stroke="currentColor"
                                        stroke-width="2" viewBox="0 0 24 24">
                                        <path d="M5 13l4 4L19 7" />
                                    </svg>
                                    <div>
                                        <p class="font-medium text-xl text-gray-900">Waste Reduction</p>
                                        <p class="text-lg text-gray-600">Zero-waste manufacturing and furniture
                                            recycling programs</p>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <FooterOrganism />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import StarIcon from '@/components/icons/StarIcon.vue'
import TruckIcon from '@/components/icons/TruckIcon.vue'
import AwardIcon from '@/components/icons/AwardIcon.vue'
import HeartIcon from '@/components/icons/HeartIcon.vue'
import BuildingIcon from '@/components/icons/BuildingIcon.vue'
import ShieldIcon from '@/components/icons/ShieldIcon.vue'
import HeadphonesIcon from '@/components/icons/HeadphonesIcon.vue'
import TrendingUpIcon from '@/components/icons/TrendingUpIcon.vue'
import DeliveryIcon from '@/components/icons/DeliveryIcon.vue'
import FooterOrganism from '@/components/footer/FooterOrganism.vue'

const stats = [
    { icon: StarIcon, label: "Happy Customers", value: "50,000+", description: "Satisfied customers nationwide" },
    { icon: AwardIcon, label: "Years of Experience", value: "10+", description: "Serving quality furniture" },
    { icon: BuildingIcon, label: "Showrooms", value: "15", description: "Across major cities" },
    { icon: TrendingUpIcon, label: "Products Sold", value: "200,000+", description: "Quality furniture pieces" },
]

const values = [
    {
        icon: HeartIcon,
        title: "Customer First",
        description:
            "We prioritize customer satisfaction above all else, ensuring every interaction exceeds expectations.",
    },
    {
        icon: ShieldIcon,
        title: "Quality Assurance",
        description: "Every product undergoes rigorous quality checks to ensure durability and craftsmanship.",
    },
    {
        icon: TruckIcon,
        title: "Reliable Delivery",
        description: "Fast, secure, and professional delivery service to your doorstep nationwide.",
    },
    {
        icon: HeadphonesIcon,
        title: "24/7 Support",
        description: "Our dedicated support team is always ready to assist you with any questions or concerns.",
    },
]

const timeline = [
    {
        year: "2014",
        title: "Company Founded",
        description: "HITMDT was established with a vision to provide quality furniture for Vietnamese homes.",
    },
    {
        year: "2016",
        title: "First Showroom",
        description: "Opened our flagship showroom in Ho Chi Minh City, showcasing our premium furniture collection.",
    },
    {
        year: "2018",
        title: "Online Platform Launch",
        description: "Launched our e-commerce platform, making quality furniture accessible nationwide.",
    },
    {
        year: "2020",
        title: "Expansion",
        description: "Expanded to 10 showrooms across major cities and introduced home design consultation services.",
    },
    {
        year: "2023",
        title: "Innovation",
        description: "Introduced smart furniture solutions and sustainable manufacturing practices.",
    },
    {
        year: "2025",
        title: "Market Leader",
        description: "Became one of Vietnam's leading furniture retailers with 50,000+ satisfied customers.",
    },
]

const certifications = [
    { name: "ISO 9001:2015", description: "Quality Management System" },
    { name: "FSC Certified", description: "Sustainable Forest Management" },
    { name: "Vietnam Green Label", description: "Environmental Certification" },
    { name: "CE Marking", description: "European Conformity Standards" },
]

const awards = [
    {
        year: "2024",
        title: "Best Furniture Retailer",
        organization: "Vietnam Retail Awards",
        description: "Recognized for outstanding customer service and product quality",
    },
    {
        year: "2023",
        title: "Sustainable Business Award",
        organization: "Green Business Council",
        description: "For our commitment to environmental responsibility",
    },
    {
        year: "2022",
        title: "Innovation in Design",
        organization: "Vietnam Design Association",
        description: "For our modern Vietnamese furniture collection",
    },
    {
        year: "2021",
        title: "Customer Choice Award",
        organization: "Consumer Review Platform",
        description: "Based on customer satisfaction ratings",
    },
    {
        year: "2020",
        title: "Digital Excellence",
        organization: "E-commerce Vietnam",
        description: "For our outstanding online shopping experience",
    },
    {
        year: "2019",
        title: "Quality Assurance",
        organization: "Vietnam Quality Mark",
        description: "For maintaining highest quality standards",
    },
]

const tabs = [
    { id: "story", label: "Our Story", icon: BuildingIcon },
    { id: "values", label: "Our Values", icon: HeartIcon },
    { id: "achievements", label: "Achievements", icon: AwardIcon },
]

const activeTab = ref('story')
</script>