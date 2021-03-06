<template>
    <form id="tryForm">
        <div class="loader-wrapper " v-if="submitting">
            <img src="https://uploads-ssl.webflow.com/6172279814cf5440b9aec966/61ee7ec5802e1c11dc78e81b_loader.gif">
        </div>
        <div v-if="!success">
            <div class="form-group">
                <label>First Name *</label>
                <input :placeholder="ismobile ? 'First Name' : ''" :class="{ 'error' : error['first_name'] }" type="text" v-model="first_name">
                <p class="error" v-if="error['first_name']">{{ error['first_name'] }}</p>
            </div>
            <div class="form-group">
                <label>Last Name *</label>
                <input :placeholder="ismobile ? 'Last Name' : ''" :class="{ 'error' : error['last_name'] }" type="text" v-model="last_name">
                <p class="error" v-if="error['last_name']">{{ error['last_name'] }}</p>
            </div>
            <div class="form-group">
                <label>Email *</label>
                <input :placeholder="ismobile ? 'Email address' : ''" :class="{ 'error' : error['email'] }" type="email" v-model="email">
                <p class="error" v-if="error['email']">{{ error['email'] }}</p>
            </div>
            <div class="form-group">
                <label>Phone Number *</label>
                <input @keyup="formatPhoneNumber($event)" :class="{ 'error' : error['phone_number'] }" 
                :placeholder="ismobile ? 'Phone Number' : '(123) 321-3213'" type="tel" v-model="phone_number">
                <p class="error" v-if="error['phone_number']">{{ error['phone_number'] }}</p>
            </div>
            <div class="form-group">
                <label>Your Zip Code *</label>
                <input
                :class="{ 'error' : error['zip'] }" @input="debounceZipCode" type="number" maxlength="99999" 
                v-model="zip"
                :placeholder="ismobile ? 'Your Zip Code' : ''"
                >
                <p class="error" v-if="error['zip']">{{ error['zip'] }}</p>
            </div>

            <div class="custom-column min-two-col">
                <div>
                    <div class="form-group">
                        <label>Select Date *</label>
                        <input :class="{ 'error' : error['date'] }" id="datepicker" type="text"
                        :placeholder="ismobile ? 'Date' : ''" class="input-date">
                        <p class="error" v-if="error['date']">{{ error['date'] }}</p>
                    </div>
                </div>

                <div>
                    <div class="form-group">
                        <label>Select Time</label>
                        <select class="input-time" :placeholder="ismobile ? 'Time' : ''" :class="{ 'error' : error['time_selected'] }" :disabled="fetching" v-model="time_selected">
                            <option value="Time">Time</option>
                            <option v-for="(time, key) in reordered_time" :key="key" :value="time">
                                {{ key }}
                            </option>
                        </select>
                        <p class="error" v-if="error['time_selected']">{{ error['time_selected'] }}</p>
                        <p v-if="fetching" class="loader-wrapper-text"><em>
                            <img class="loader" src="https://uploads-ssl.webflow.com/6172279814cf5440b9aec966/61ee7ec5802e1c11dc78e81b_loader.gif">
                            Listing available schedule based on timezone and date
                            </em>
                        </p>
                    </div>
                </div>
            </div>  

            <div class="form-group form-group-check">
                <div>
                    <input type="checkbox" :value="false" v-model="terms" id="terms">
                    <label for="terms">
                        I agree to the <a target="_blank" href="https://www.thrivelab.com/terms">Terms and Conditions</a>, <a target="_blank" href="https://www.thrivelab.com/privacy-policy">Privacy Policy</a> and <a target="_blank" href="/telehealth">Telehealth Consent by thrivelab</a>.
                    </label>
                </div>

                <p style="color: #a94442;" class="error" v-if="error['terms']">{{ error['terms'] }}</p>
            </div>

            <p class="note" style="margin-top: 15px;">
                Please note: email addresses are immediately processed once entered.
            </p> 
            
            
            <button @click="validate" v-if="!submitting" class="btn btn-blue" type="submit">
                <img src="https://uploads-ssl.webflow.com/6172279814cf5440b9aec966/6183bd85add1c1207f2b7dcb_icon-arrow-right.svg">Submit
            </button>
            <button class="btn btn-blue" v-if="submitting">
                <img src="https://uploads-ssl.webflow.com/6172279814cf5440b9aec966/6183bd85add1c1207f2b7dcb_icon-arrow-right.svg">Sending request....
            </button>
            <p class="error" v-if="error['general']">{{ error['general'] }}</p>
        </div>

        

        <div v-if="success">
            <success :name="`${first_name} ${last_name}`"
                :timezone="timezone"
                :date="date"
                :time="pickedStaff.time"
                :response="appointment_response"></success>
        </div>

    </form>
</template>

<script>
import Success from './Success.vue';
import { Datepicker } from 'vanillajs-datepicker';
import { API_SERVICE }  from './../api.service';
import { PHONE_NUMBER_MIXIN }  from './../phone_number.mixin';
import moment, { duration } from 'moment';
import _ from 'lodash';


export default {

    components: {
        Success
    },

    mixins: [ API_SERVICE, PHONE_NUMBER_MIXIN ],

    data () {
        return {
            token: '',
            services: [],
            first_name: '',
            last_name: '',
            email: '',
            phone_number: '',
            terms: false,
            zip: '',
            date: '',
            time_selected: 'Time',
            zip_debounce: '',
            timezone: {},
            error: {},
            list: [],
            token: '',
            fetching: false,
            submitting: false,
            success: false,
            appointment_response: {
                start_time: '',
                duration: '30 mins'
            }
        }
    },

    created () {
        this.getToken();
    },

    mounted () {
        this.initDatepicker();
    },

    watch: {
        list (value) {
            if (!value.length) {
                this.fetching = true;
            }
        }
    },

    methods: {

        validate (event) {
            event.preventDefault();
            

            this.error = {};


            if (this.isValid) {
                this.createAppointment();
            }
        },

        createAppointment() {
            this.submitting = true;
            this.$http.post(`/booking/appointment?accessToken=${this.token}`, this.params)
            .then( response => {
                this.appointment_response = response.data.response.returnvalue;
                localStorage.setItem('response', JSON.stringify(this.appointment_response));
                this.success = true;
                this.submitting = false;

                document.getElementById('consultationTitle').style.display = 'none'
                
            }).catch( error => {
                this.success = false;
                this.submitting = false;
                this.error['general'] = 'There was an error in your request, please reload the page then try again.'
            } );
        },

        initDatepicker () {
            const elem = document.getElementById('datepicker');
            const datepicker = new Datepicker(elem, {
                minDate: new Date(),
                nextArrow: '&#8250;',
                prevArrow: '&#8249;',
                format: 'M d yyyy'
            });

            !this.isMobile && datepicker.setDate(new Date());

            this.date = moment().format('DD-MMM-yyyy');

            elem.addEventListener('changeDate', event => {
                this.date = moment(event.detail.date).format('DD-MMM-yyyy');

                if (this.zip.length < 5) {
                    this.setError('zip', 'Please enter a valid zip code')
                } else {
                    this.fetching = true;
                    this.getList();
                }

                
                
            });
            
        },

        debounceZipCode () {
            if (this.zip.length > 5) this.zip = this.zip.slice(0, 5);
            if (this.zip.length == 5) {
                // this.zip_debounce && clearTimeout(this.zip_debounce)
                // this.zip_debounce = setTimeout(() => {
                    this.getTimezone();
                // }, 1000)
            } else {
                this.setError('zip', 'Please enter a valid US zip code');
            }
        },

        setError (key, value) {
            let error = JSON.parse(JSON.stringify(this.error));
            error[key] = value;
            this.error = error;
        },

        getList () {
            // this.fetching = true;
            this.list = [];
            this.time_selected = [];
            this.setError('time_selected', '');
            this.$http.get(`/booking/availability/list?accessToken=${this.token}&selected_date=${this.date}%2010:00:00&user_timezone=${this.timezone.timezone}&service_id=${this.service.id}`)
            .then( response => {
                let listCount = response.data.length - 1;
                let list = response.data;
                list.splice(listCount, 1);
                this.list = list;
                this.fetching = false;

                
            }).catch( error => {
                this.fetching = false;
                this.setError('time_selected', 'We have encountered an error, please try again later.');
            } );
        },

        getTimezone () {
            this.setError('zip', '');
            this.$http.get(`/timezone?zipcode=${this.zip}`)
                .then ( response => {
                    this.timezone = response.data;
                    this.fetching = true;
                    this.getList();
                }).catch( errorResponse => {
                    if(errorResponse['response']) {
                        errorResponse.response.status == 404 && this.setError('zip', 'No schedule found in your area'); 
                    }
                });
        },
        getToken (callback = () => {}) {
            this.$http.post('/booking/token').then ( response => {
                localStorage.setItem('try_token', response.data.access_token);
                this.token = response.data.access_token;
                callback();
            })
        },

        timeToString (time) {
            let splittedTime = time.split[':'];

            return `${splittedTime[0]}${splittedTime[1]}`;
        },
    },

    computed: {
        
        fetched_time () {
            let time = {}
            
            this.list.forEach ( item => {
                item.new_time.forEach ( new_time => {

                    let hourToInt = parseInt(new_time.split(':')[0]);
                    let minutes = new_time.split(':')[1];
                    let isAfternoon = hourToInt > 11;

                    let afternoonTime = hourToInt == 12 ? hourToInt : hourToInt - 12;

                    let uxtime = isAfternoon ? `${afternoonTime}:${minutes} PM` : `${new_time} AM`;

                    if (!time[uxtime]) {
                        time[uxtime] = [];
                    }

                    time[uxtime].push({
                        id: item.id,
                        time: new_time
                    });
                })
            });

            return time;
        },

        reordered_time () {
            let reordered = {};   

            Object.keys(this.fetched_time).sort().forEach( key => {
                reordered[key] = this.fetched_time[key];
            });

            return reordered;
        },

        parsed_phone_number () {
            return this.phone_number.replace(/\D/g,'');;
        },

        params () {

            let additional_fields = {
                url: localStorage.getItem('free_visit_url'),
                gender: this.service.gender,
                leadsource: 'main FC'
            }

            let customer_details = {
                name: `${this.first_name} ${this.last_name}`,
                email: this.email,
                phone_number: this.parsed_phone_number,
            }


            return {
                from_time: `${this.date} ${this.pickedStaff.time}`,
                service_id: this.service.id,
                staff_id: this.pickedStaff.id,
                timezone: this.timezone.timezone,
                customer_details: JSON.stringify(customer_details),
                additional_fields: JSON.stringify(additional_fields),
                url: `?source=${localStorage.getItem('first_visit_url')}&ref=${encodeURI(document.referrer)}`
            }
        },

        pickedStaff () {

            let selection = !this.time_selected.length ? [{ time: '', id: '' }] : this.time_selected;

            return _.sample(selection);
        },

        service () {
            let service_data = {
                gender: 'Female',
                id: '4079544000000970282'
            }
            
            if (window.location.href.indexOf('men') > -1) {
                service_data.gender = 'Male';
                service_data.id = '4079544000000970272'
            };

            return service_data;
        },

        isValid() {
            let valid = true;

            let fields = ['first_name', 'last_name', 'zip', 'phone_number', 'email', 'date', 'time_selected'];
            
            fields.forEach ( item => {
                if (!this[item].length) {
                    this.setError(item, 'This field is required');
                    valid = false;
                }
            });

            if (!this.terms) {
                valid = false;
                this.setError('terms', 'You must agree with the terms and conditions');
            }

            return valid;
        },

        ismobile () {
            return window.innerWidth < 767;
        }
    }
}
</script>