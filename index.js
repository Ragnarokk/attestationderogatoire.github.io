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
                const img = new Image();
                img.onload = function () {
                    // we create a temporary canvas to draw the informations on the form
                    const canvas = document.createElement('canvas');
                    canvas.width = this.width;
                    canvas.height = this.height;
                    const ctx = canvas.getContext('2d');

                    const qrimage = new VanillaQR({
                        url: 'lolilol',
                        width: 400,
                        height: 400,
                        colorLight: "#FFFFFF",
                        colorDark: "#000000",
                        ecclevel: 1,
                        noBorder: true,
                    }).toImage("png");

                    ctx.drawImage(img, 0, 0);

                    qrimage.onload = function () {
                        ctx.drawImage(qrimage, 100, 100);

                        const pdf = new jsPDF();
                        const imgData = canvas.toDataURL("image/jpeg", 1.0);

                        pdf.addImage(imgData, 'JPEG', 0, 0);
                        pdf.save('attestation.pdf');
                    }
                }
                img.src = 'attestation.jpg';
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
                    if ( this.value != '' && this.value.match(this.inputdata.pattern) ) {
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