export const PHONE_NUMBER_MIXIN = {
    methods: {

        characterIsAllowed (event) {
            event = (event) ? event : window.event;
            var charCode = (event.which) ? event.which : event.keyCode;
            if (charCode > 31 && (charCode < 48 || charCode > 57)) {
                return false;
            }
            return true;
        },

        formatPhoneNumber (event) {

            // if (!this.phoneNumber) return value;
                let value = this.phone_number.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');

                this.phone_number = value;
        
                const phoneNumber = value.replace(/[^\d]/g, "");
                const phoneNumberLength = phoneNumber.length;
            
                if (phoneNumberLength < 4) return phoneNumber;
            
                if (phoneNumberLength < 7) {
                    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
                }
            
                this.phone_number = `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(
                    3,
                    6
                )}-${phoneNumber.slice(6, 10)}`;

            

            
        },

        enforceFormat (event) {
            if(!this.isNumericInput(event) && !this.isModifierKey(event)){
                event.preventDefault();
            }
        },
    
        formatToPhone (event) {
            if(this.isModifierKey(event)) {return;}
    
            const input = event.target.value.replace(/\D/g,'').substring(0,10); // First ten digits of input only
            const areaCode = input.substring(0,3);
            const middle = input.substring(3,6);
            const last = input.substring(6,10);
    
            if(input.length > 6){event.target.value = `(${areaCode}) ${middle} - ${last}`;}
            else if(input.length > 3){event.target.value = `(${areaCode}) ${middle}`;}
            else if(input.length > 0){event.target.value = `(${areaCode}`;}
        },
    
        isModifierKey (event) {
            const key = event.keyCode;
            return (event.shiftKey === true || key === 35 || key === 36) || // Allow Shift, Home, End
                (key === 8 || key === 9 || key === 13 || key === 46) || // Allow Backspace, Tab, Enter, Delete
                (key > 36 && key < 41) || // Allow left, up, right, down
                (
                    // Allow Ctrl/Command + A,C,V,X,Z
                    (event.ctrlKey === true || event.metaKey === true) &&
                    (key === 65 || key === 67 || key === 86 || key === 88 || key === 90)
                )
        },
    
        isNumericInput (event) {
            const key = event.keyCode;
            return ((key >= 48 && key <= 57) || // Allow number line
                (key >= 96 && key <= 105) // Allow number pad
            );
        }
    }

}