<template>
    <div id="tryForm" class="booking-form">
        <img class="hero" src="https://uploads-ssl.webflow.com/6172279814cf5440b9aec966/61f28fccbb3352c540f8c115_Success_Icon.7fa88b2e.svg">
        <div class="text">
            <p class="success-intro">You're all set {{ name }}!</p>

            <p>Your {{ response.duration.split(' ')[0] }} minute FREE CONSULTATION is scheduled for {{ time }} {{ timezone.timezone }} on {{ uxdate }}</p>
            <p>
                A thrivelab Patient Care Coordinator will call you on the number you provided.
            </p>
        </div>

        <a class="btn btn-blue" style="margin-bottom: 10px;" target="_blank" :href="`https://www.google.com/calendar/render?action=TEMPLATE&text=Free Consult&details=Free Consultaion - Thrivelab&dates=${start}/${end}`">
            <img src="https://uploads-ssl.webflow.com/6172279814cf5440b9aec966/6183bd85add1c1207f2b7dcb_icon-arrow-right.svg">
            Add to Google Calendar

        </a>
        <a class="btn btn-blue" rel="noopener noreferrer" :href="ical" target="_blank" download="thrivelab_consultation_schedule.ics">
            <img src="https://uploads-ssl.webflow.com/6172279814cf5440b9aec966/6183bd85add1c1207f2b7dcb_icon-arrow-right.svg">
            Add to Apple or Outlook Calendar

        </a>
    </div>
</template>

<script>
import moment from 'moment';
export default {
    props: {
        time: {
            type: String,
            required: true
        },
        date: {
            type: String,
            required: true
        },
        timezone: {
            type: Object,
            required: true
        },
        name: {
            type: String,
            required: true
        },

        response: {
            type: Object
        }
    },

    computed: {
        start () {
            return moment(new Date(this.response.start_time)).format('YYYYMMDDThhmmss');
        },
        
        end () {
            let duration = parseInt(this.response.duration.split(' ')[0]);
            let plusDuration = moment(new Date(this.response.start_time)).add(duration, 'm');
            return moment(new Date(this.response.start_time)).add(duration, 'm').format('YYYYMMDDThhmmss');
        },

        uxdate () {
            return moment(new Date(this.response.start_time)).format('Do of MMM YYYY')
        },

         ical () {
            let params =
                [
                'BEGIN:VCALENDAR',
                'VERSION:2.0',
                'BEGIN:VEVENT',
                'URL:https://www.thrivelab.com/thrivetogether',
                `DTSTART:${this.start}`,
                `DTEND:${this.end}`,
                'SUMMARY:THRIVELAB: Free Consultation',
                'DESCRIPTION:Free Consult LP',
                'END:VEVENT',
                'END:VCALENDAR'
                ];
            ;

            return `data:text/calendar;charset=utf8,${encodeURI(params.join('\r\n'))}`
        }
    }
}
</script>