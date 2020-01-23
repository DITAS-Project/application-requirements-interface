<template>
  <div>

    <!-- A LIST OF INFRASTRUCTURES -->
    <b-list-group>
      <div v-for="infrastructure in globalObjectSection3.infrastructures">
        <b-list-group-item class="mb-1" variant="info" button>

          <b-button class="mb-3" size="sm" variant="outline-danger" style="float: right;"
           v-on:click="removeInfrastructure(infrastructure)">Remove infrastructure</b-button>

          <h4>Infrastructure #{{globalObjectSection3.infrastructures.indexOf(infrastructure) + 1 }}</h4>

          <!-- FORM OF THIS INFRASTRUCTURE -->
          <b-container>

            <b-row class="mb-2">
                <b-col>
                  <b-input-group prepend="Name:">
                  <b-form-input type="text" v-model="infrastructure.name"
                  placeholder="Name of the infrastructure" ></b-form-input>
                  </b-input-group>
                </b-col>

                <b-col>
                  <b-input-group prepend="API endpoint:">
                  <b-form-input type="url" v-model="infrastructure.provider.api_endpoint"
                  placeholder="Url of the API endpoint" ></b-form-input>
                  </b-input-group>
                </b-col>
            </b-row>

            <b-row class="mb-2">
                <b-col>
                  <b-row>&nbsp;&nbsp;Type of API:&nbsp;<b-form-radio-group
                  v-model="infrastructure.provider.api_type"
                  :options="['cloudsigma', 'kubernetes']">
                  </b-form-radio-group>
                  </b-row>
                </b-col>

                <b-col>
                  <b-row>&nbsp;&nbsp;Type of infrastructure:&nbsp;<b-form-radio-group
                  v-model="infrastructure.type"
                  :options="['cloud', 'edge', 'fog']">
                  </b-form-radio-group>
                  </b-row>
                </b-col>
            </b-row>

            <b-row class="mb-2" v-if="infrastructure.provider.api_type == 'kubernetes'">

              <!-- THIS IS THE OLD TEXTAREA THAT WAS USED TO INPUT A CREDENTIALS FILE
              <span class="mt-1" style="display:inline-block; margin-left:10px;" >
                Credentials file:
              </span>
              <span style="display:inline-block; margin-left:10px;  width:400px; " >
                <b-form-textarea
                      v-model="infrastructure.provider.credentials.config"
                      placeholder="Paste the contents of the credentials file here..."
                      rows="3"
                      max-rows="5"
                    ></b-form-textarea>
              </span>
              -->

              <b-col>
                  <b-input-group prepend="Secret id:">
                  <b-form-input type="text" v-model="infrastructure.provider.secret_id"
                  placeholder="Id of the secret" ></b-form-input>
                  </b-input-group>
              </b-col>
              <b-col>
                  <b-input-group prepend="Registries secret:">
                  <b-form-input type="text" v-model="infrastructure.provider.credentials.registries_secret"
                  placeholder="Name of the registries secret" ></b-form-input>
                  </b-input-group>
              </b-col>
            </b-row>

            <b-row class="mb-2" v-if="infrastructure.provider.api_type == 'cloudsigma'">
                <b-col cols="1">
                  <span>Credentials:</span>
                </b-col>

                <b-col>
                    <b-input-group prepend="Username:">
                    <b-form-input type="text"
                    v-model="infrastructure.provider.credentials.username"></b-form-input>
                    </b-input-group>
                </b-col>

                <b-col>
                    <b-input-group prepend="Password:">
                    <b-form-input type="text"
                    v-model="infrastructure.provider.credentials.password"></b-form-input>
                    </b-input-group>
              </b-col>
            </b-row>

            <b-row>&nbsp;&nbsp;Owner:&nbsp;<b-form-radio-group
            v-model="infrastructure.extra_properties.owner"
            :options="['ApplicationDeveloper']">
            </b-form-radio-group>
            </b-row>

            <b-row>
              <b-col cols="6">
                <b-input-group prepend="Port range:">
                <b-form-input type="text"
                placeholder="Write a port range in this format: xxxxx-yyyyy"
                v-model="infrastructure.extra_properties.available_ports_range"></b-form-input>
                </b-input-group>
              </b-col>
            </b-row>


            <b-row v-if="infrastructure.provider.api_type == 'cloudsigma'"
              >&nbsp;&nbsp;Kubeadm preinstalled image:&nbsp;<b-form-radio-group
            v-model="infrastructure.extra_properties.kubeadm_preinstalled_image"
            :options="['true', 'false']">
            </b-form-radio-group>
            </b-row>

          </b-container>
          <!-- END OF THE FORM FOR THE INFRASTRUCTURE -->




           <!--- LIST OF MACHINES OF THIS INFRASTRUCTURE --->
           <div v-for="machine in infrastructure.resources">

             <!--- THIS IS THE CARD THAT ENCAPSULATES EACH MACHINE --->
             <b-card border-variant="info" bg-variant="light"
             header-bg-variant="info" header-text-variant="light"
             class="ml-5 mr-5 mb-3" >
             <!--- THIS IS THE HEADER OF EACH CARD: A STRING + A REMOVE BUTTON --->
             <h4 slot="header" class="mb-0">Machine #{{infrastructure.resources.indexOf(machine) + 1 }}
               <b-button squared size="sm" style="float: right;" variant="danger"
               v-on:click="removeMachine(infrastructure, machine)" v-b-tooltip.hover title="Remove machine">x</b-button>
             </h4>

               <!--- FIRST ROW --->
               <b-row class="my-0" >
                   <!--- FIRST COLUMN --->
                   <b-col>
                       <b-input-group prepend="Name:">
                       <b-form-input type="text" v-model="machine.name"
                       placeholder="Suffix for the hostname" ></b-form-input>
                       </b-input-group>
                   </b-col>
                   <!--- SECOND COLUMN --->
                   <b-col>
                       <b-input-group prepend="Cpu:" append="MHz">
                       <b-form-input type="number" v-model.number="machine.cpu"
                       placeholder="Clock speed (in MHz)" min="1" ></b-form-input>
                       </b-input-group>
                   </b-col>
                   <!--- THIRD COLUMN --->
                   <b-col >
                       <b-input-group prepend="Ip:">
                       <b-form-input type="text" v-model="machine.ip"
                       placeholder="IP to assign this VM" ></b-form-input>
                       </b-input-group>
                   </b-col>
               </b-row>

               <!--- SECOND ROW --->
               <b-row class="my-1" >
                   <!--- FIRST COLUMN --->
                   <b-col >
                       <b-input-group prepend="Boot disk:" append="Mb">
                       <b-form-input type="number" v-model.number="machine.disk"
                       placeholder="Size (in Mb)" min="1" ></b-form-input>
                       </b-input-group>
                   </b-col>
                   <!--- SECOND COLUMN --->
                   <b-col>
                       <b-input-group prepend="Cores:">
                       <b-form-input type="number" v-model.number="machine.cores"
                       placeholder="Number of cores" min="1" ></b-form-input>
                       </b-input-group>
                   </b-col>
                   <!--- THIRD COLUMN --->
                   <b-col>
                       <b-row>&nbsp;&nbsp;Role:&nbsp;<b-form-radio-group
                       v-model="machine.role"
                       :options="['master', 'slave']">
                       </b-form-radio-group>
                       </b-row>
                   </b-col>
               </b-row>

               <!--- THIRD ROW --->
               <b-row class="my-1" >
                   <!--- FIRST COLUMN --->
                   <b-col>
                       <b-input-group prepend="Image_ID:">
                       <b-form-input type="text" v-model="machine.image_id"
                       placeholder="Boot image ID to use" ></b-form-input>
                       </b-input-group>
                   </b-col>
                   <!--- SECOND COLUMN --->
                   <b-col>
                       <b-input-group prepend="Ram:" append="Mb">
                       <b-form-input type="number" v-model.number="machine.ram"
                       placeholder="Size (in Mb)" min="1" ></b-form-input>
                       </b-input-group>
                   </b-col>
                   <b-col>
                     <!--- THIRD COLUMN --->
                     <!--- EMPTY FOR EQUAL SPACING --->
                   </b-col>
               </b-row>

               <!--- FOURTH ROW --->
               <!-- This form radio is only shown for machines that have field "extra_properties".
               In turn, machines are only created with this field if their infrastructure has api_type equal to "cloudsigma".
               Check function "addMachine" to see how machines are created. -->
               <b-row mb="1" v-if="machine.extra_properties">&nbsp;&nbsp;Cloudsigma boot drive type:&nbsp;<b-form-radio-group
               v-model="machine.extra_properties.cloudsigma_boot_drive_type"
               :options="['custom', 'library']">
               </b-form-radio-group>
               </b-row>


               <!-- LIST OF DRIVES FOR THIS MACHINE (NESTED FOR-LOOP) -->
               <div v-for="drive in machine.drives">

                 <!--- THIS IS THE CARD THAT ENCAPSULATES EACH DRIVE --->
                 <b-card border-variant="info" bg-variant="light" class="mr-4 mb-2">

                 <!--- ONE SINGLE ROW PER DRIVE --->
                 <b-row class="my-1" >
                   <!--- FIRST COLUMN --->
                   <b-col sm="2">
                       <!--This button is used to remove the drive. -->
                       <b-button squared variant="danger"
                       v-on:click="removeDrive(machine,drive)"
                       v-b-tooltip.hover
                       title="Remove drive"
                       >x</b-button>
                       <b-button disabled squared variant="info"> Drive #{{machine.drives.indexOf(drive) + 1 }} </b-button>
                   </b-col>
                   <!--- SECOND COLUMN --->
                   <b-col>
                       <b-input-group prepend="Name:">
                       <b-form-input type="text" v-model="drive.name"
                       placeholder="Drive name" ></b-form-input>
                       </b-input-group>
                   </b-col>
                   <!--- THIRD COLUMN --->
                   <b-col>
                       <b-input-group prepend="Size:" append="Mb">
                       <b-form-input type="number" v-model.number="drive.size"
                       placeholder="Drive size" min="1" ></b-form-input>
                       </b-input-group>
                   </b-col>
                   <!--- FOURTH COLUMN --->
                   <b-col>
                       <!--- ONE SINGLE ROW FOR THE RADIO FORM --->
                       <b-row>&nbsp;Type:&nbsp;<b-form-radio-group
                       v-model="drive.type"
                       :options="['HDD', 'SSD']">
                       </b-form-radio-group>
                       </b-row>
                   </b-col>
                 </b-row>
                 </b-card> <!--- END OF THE CARD THAT ENCAPSULATES A DRIVE --->

               </div>

               <!--- THE BUTTON USED TO ADD A NEW DRIVE TO THIS MACHINE --->
               <div align="left">
               <b-button variant="success" v-on:click="addDrive(machine)">Add new drive</b-button>
               </div>

             </b-card> <!--- END OF THE CARD THAT ENCAPSULATES A MACHINE --->
           </div>

           <!--- THE BUTTON USED TO ADD A NEW MACHINE --->
           <br>
           <b-button variant="success" v-on:click="addMachine(infrastructure)">Add new machine</b-button>


        </b-list-group-item>
      </div>
    </b-list-group>
    <b-button class="mt-3" variant="success" v-on:click="addInfrastructure()">Add new infrastructure</b-button>



  </div>
</template>




<script>

export default {
  name: 'ThirdTab',
  props: {
    globalObjectSection3: Object
  },

 methods: {
     addMachine: function(infrastructure) {
        // The following array [resources] can contain multiple objects [machines]. Each object [machine] must
        // contain an array [drives], and that array must immediately contain one object [drive] on creation,
        // whose attributes are name, size and type. That's because each machine must have at least one drive.

        // It's not necessary to declare all the properties of the object that is pushed into the array here.
        // The only property that must be explicitely declared here is the array property.
        // Otherwise it would not be possible to use the ".push" function on it later, as it would not be
        // recognised as an array.
        // Moreover, if an attribute can be empty, it's possible to declare it here like so: name:''

        //If the infrastructure has "api type"=="cloudsigma", the new created machine has these additional fields: extra_properties.cloudsigma_boot_drive_type
        if (infrastructure.provider.api_type=="cloudsigma") {
          infrastructure.resources.push( { drives: [ { name:'', size:'', type:''} ], extra_properties: { cloudsigma_boot_drive_type:' '} } )
        }
        //Otherwise, the new machine is created without the extra_properties.cloudsigma_boot_drive_type fields.
        else if (infrastructure.provider.api_type=="kubernetes") {
          infrastructure.resources.push( { drives: [ { name:'', size:'', type:''} ] } )
        }
     },
     removeMachine: function(infrastructure, machine) {
        var index = infrastructure.resources.indexOf(machine);
        infrastructure.resources.splice(index, 1);
         },
     addDrive: function(machine) {
        machine.drives.push( {} )
         },
     removeDrive: function(machine,drive) {
        var index = machine.drives.indexOf(drive);
        machine.drives.splice(index, 1);
         },
     addInfrastructure: function() {
        this.globalObjectSection3.infrastructures.push( {  name:'', type:'', extra_properties: { owner:'ApplicationDeveloper', ditas_default:'', available_ports_range:'' }, provider: {secret_id:'', api_type:'cloudsigma', credentials: { username:'', password:'', config: '', registries_secret:''}}, resources: [] } )
         },
     removeInfrastructure: function(infrastructure) {
        var index = this.globalObjectSection3.infrastructures.indexOf(infrastructure);
        this.globalObjectSection3.infrastructures.splice(index, 1);
         },
 }
}
</script>
