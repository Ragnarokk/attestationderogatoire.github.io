var debug = new Vue({
    el: '#attestation-form',
    data () {
        const date = new Date();
        const currentdate = date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2);
        const currenttime = ('0' + date.getHours()).slice(-2) + ':' + ('0' + date.getMinutes()).slice(-2);
        const checkset = new Set();
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
                hikingdate: {
                    id: 8, name: 'hikingdate', text: 'Heure de Sortie', type: 'time',
                    value: currenttime, pattern: /[0-9]{2}:[0-9]{2}/
                },
                creationdate: {
                    id: 9, name: 'creationdate', text: 'Créé le', type: 'date',
                    value: currentdate, pattern: /[0-9]{4}(-[0-9]{2}){2}/
                },
                creationhour: {
                    id: 10, name: 'creationhour', text: 'A', type: 'time',
                    value: currenttime, pattern: /[0-9]{2}:[0-9]{2}/
                },
            },
            checkboxes: [
                {
                    id: 11, name: 'travail', 
                    text: "Déplacements entre le domicile et le lieu d’exercice de l’activité " +
                          "professionnelle, lorsqu'ils sont indispensables à l'exercice d’activités " +
                          "ne pouvant être organisées sous forme de télétravail ou déplacements professionnels" +
                          " ne pouvant être différés."
                },{
                    id: 12, name: 'courses',
                    text: "Déplacements pour effectuer des achats de fournitures nécessaires à l’activité professionnelle " +
                          "et des achats de première nécessité dans des établissements dont les activités demeurent autorisées " +
                          "(liste des commerces et établissements qui restent ouverts)."
                },{
                    id: 13, name: 'sante',
                    text: "Consultations et soins ne pouvant être assurés à distance et ne pouvant être " +
                          "différés ; consultations et soins des patients atteints d'une affection de longue durée."
                },{
                    id: 14, name: 'famille',
                    text: "Déplacements pour motif familial impérieux, pour l’assistance aux personnes " +
                    "vulnérables ou la garde d’enfants."
                },{
                    id: 15, name: 'sport',
                    text: "Déplacements brefs, dans la limite d'une heure quotidienne et dans un rayon maximal " +
                          "d'un kilomètre autour du domicile, liés soit à l'activité physique individuelle des " +
                          "personnes, à l'exclusion de toute pratique sportive collective et de toute proximité " +
                          "avec d'autres personnes, soit à la promenade avec les seules personnes regroupées dans " +
                          "un même domicile, soit aux besoins des animaux de compagnie."
                },{
                    id: 16, name: 'judiciaire',
                    text: "Convocation judiciaire ou administrative."
                },{
                    id: 17, name: 'missions',
                    text: "Participation à des missions d’intérêt général sur demande de l’autorité administrative."
                }
            ],
            checkboxesset: checkset,
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
        },
        'checkbox-group': {
            props: ['checkdata',
                    'checkset'],
            template: '<div class="form-check">' +
                      '    <input type="checkbox" class="form-check-input" ' + 
                                  'ref="box"' +
                                  ':id="checkdata.name"' +
                                  ':name="checkdata.name"' + 
                                  ':value="checkdata.name"' +
                                  'v-on:change="update">' +
                      '    <label class="form-check-label" :for="checkdata.name">{{ checkdata.text }}</label>' +
                      '</div>',
            methods: {
                update: function () {
                    if ( this.$refs.box.checked ) {
                        this.checkset.add( this.checkdata.name );
                    } else {
                        this.checkset.delete( this.checkdata.name );
                    }
                }
            }
        }

    }
})