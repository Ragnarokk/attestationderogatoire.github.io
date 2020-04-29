var debug = new Vue({
    el: '#attestation-form',
    data () {
        const date = new Date();
        const currentdate = date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2);
        const currenttime = ('0' + date.getHours()).slice(-2) + ':' + ('0' + date.getMinutes()).slice(-2);
        return {
            inputs: {
                name: { 
                    id: 1, name: 'name', text: 'Prénom',             
                    type: 'text', placeholder: 'Jean', pattern: /\w+/
                },
                lastname: {
                    id: 2, name: 'lastname', text: 'Nom',                
                    type: 'text', placeholder: 'Dupont', value: "", pattern: /\w+/
                },
                birthdate: { 
                    id: 3, name: 'birthdate', text: 'Date de Naissance',  
                    type: 'date', value: '2020-01-01', pattern: /[0-9]{4}(-[0-9]{2}){2}/
                },
                birthplace: { 
                    id: 4, name: 'birthplace', text: 'Lieu de Naissance',  
                    type: 'text', placeholder: 'Lyon', value: "", pattern: /\w+/
                },
                address: { 
                    id: 5, name: 'address', text: 'Adresse',            
                    type: 'text', placeholder: '36 quai des Orfèvres', value: "", pattern: /\w+/
                },
                city: { 
                    id: 6, name: 'city', text: 'Ville',              
                    type: 'text', placeholder: 'Paris', value: "", pattern: /\w+/
                },
                zipcode: { 
                    id: 7, name: 'zipcode', text: 'Code Postal',        
                    type: 'text', placeholder: '75001', value: "", pattern: /[0-9]{5}/
                },
                creationdate: {
                    id: 8, name: 'creationdate', text: 'Créé le', type: 'date',
                    value: currentdate, pattern: /[0-9]{4}(-[0-9]{2}){2}/
                },
                creationhour: {
                    id: 9, name: 'creationhour', text: 'A', type: 'time',
                    value: currenttime, pattern: /[0-9]{2}:[0-9]{2}/
                }
            },
            errors: false,
        }
    },
    methods: {
        createPDF: function () {
            this.errors = false;

            for ( key in this.inputs ) {
                if ( this.$refs[key][0].valid === -1 ) {
                    this.$refs[key][0].validate();
                }

                if ( this.$refs[key][0].valid != 1 ) {
                    this.errors = true;
                }
            }

            if ( this.errors === false ) {
                const data = {};
                for ( key in this.inputs ) {
                    data[key] = this.$refs[key][0].value;
                }
                completeAndDownloadForm( data );
            }
        }
    },
    components: {
        'input-group': {
            props: ['inputdata'],
            data: function () {
                return {
                    value: this.inputdata.value,
                    valid: -1,
                }
            },
            template: '<div class="form-group">' +
                    '   <label :for="inputdata.name">{{ inputdata.text }}</label>' +
                    '   <input class="form-control form-control-lg"' +
                                'ref="input"' +
                                ':id="inputdata.name"' +
                                ':type="inputdata.type"' + 
                                ':name="inputdata.name"' + 
                                ':placeholder="inputdata.placeholder"' +
                                'lazy ' +
                                'v-model="value"' +
                                'v-on:blur="validate"' +
                    '></div>',
            methods: {
                validate: function () {
                    const input = this.$refs.input;
                    if ( ( this.value != '') && this.value.match(this.inputdata.pattern) ) {
                        input.classList.add('is-valid');
                        input.classList.remove('is-invalid');
                        this.valid = 1;
                    } else {
                        input.classList.add('is-invalid');
                        input.classList.remove('is-valid');
                        this.valid = 0;
                    }
                },
            }
        }

    }
})