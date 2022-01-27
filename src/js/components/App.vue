<template>
    <div>
        <div class="form-group">
            <label>Name</label>
            <input type="text" v-model="name">
        </div>
        <div class="form-group">
            <label>Email</label>
            <input type="email" v-model="email">
        </div>
        <div class="form-group">
            <label>Phone Number</label>
            <input type="tel" v-model="phone_number">
        </div>
        <div class="form-group">
            <label>Your Zip Code</label>
            <input @input="debounceZipCode" type="text" v-model="zip">
            <p v-if="error['zip']">{{ error['zip'] }}</p>
        </div>
        <div class="form-group">
            <label>Select Date</label>
            <input id="datepicker" type="text">
        </div>
        <div class="form-group">
            <label>Select Time</label>
            <select v-model="time">
                <option v-for="time in time_selection" :key="time.id" :value="time">{{ time.time }}</option>
            </select>
        </div>
    </div>
</template>

<script>

import { Datepicker } from 'vanillajs-datepicker';
import { API_SERVICE }  from './../api.service';
import moment from 'moment';
export default {

    mixins: [ API_SERVICE ],

    data () {
        return {
            token: '',
            services: [],
            name: '',
            email: '',
            phone_number: '',
            zip: '',
            date: '',
            time: [],
            time_selection: [],
            zip_debounce: '',
            timezone: {},
            error: {}
        }
    },

    mounted () {
        this.initDatepicker();
    },

    watch: {
        
    },

    methods: {

        initDatepicker () {
            const elem = document.getElementById('datepicker');
            const datepicker = new Datepicker(elem, {
                minDate: new Date(),
                nextArrow: '&#8250;',
                prevArrow: '&#8249;',
                format: 'M dd, yyyy',
                defaultViewDate: new Date()
            });

            datepicker.setDate(new Date());

            elem.addEventListener('changeDate', event => {
                this.date = moment(event.detail.date).format('d-M-yyyy');
                
            }) 
        },

        debounceZipCode () {
            if (this.zip.length > 4 || this.zip.length) {
                this.zip_debounce && clearTimeout(this.zip_debounce)
                this.zip_debounce = setTimeout(() => {
                    this.getTimezone();
                }, 1500)
            } else {
                this.setError('zip', 'Please enter a valid US zip code');
            }
        },

        setError (key, value) {
            let error = JSON.parse(JSON.stringify(this.error));
            
            error[key] = value;

            this.error = error;
        },

        getTimezone () {
            this.setError('zip', '');
            this.$http.get(`/timezone?zipcode=${this.zip}`).then ( response => {
                this.timezone = response.data;
            }).catch( errorResponse => {
                errorResponse.response.status == 404 && this.setError('zip', errorResponse.response.data.status);
            });
        },
        getToken () {
            this.$http.post('/booking/token').then ( response => {
                localStorage.setItem('try_token', response.data.access_token);
            })
        }
    }
}
</script>