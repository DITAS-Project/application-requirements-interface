<!-- WARNING: there's a bug on the browser extension for vue (vue-devtools for Chrome).
The value of local variables of a component might not update automatically inside the console.
In order to check the actual value of such a variable, simply select another component,
and then go back to this one. Now the value should be refreshed. -->

<template>
  <div>

    <!-- THIS CAN BE USED TO SHOW ALL THE RECEIVED BLUEPRINTS (ALL FIELDS)
    <pre> {{ receivedBlueprints }} </pre>
    -->

    <!--
    <pre> {{ DEresponse }} </pre>
    -->

    <div v-for="item in this.receivedBlueprints">
      <b-container>
        <b-card class="mb-1" border-variant="info" >
          <div> <font color="red">Name:</font>  {{ item.blueprint.INTERNAL_STRUCTURE.Overview.name }} </div>
          <div> <font color="blue">Description:</font> {{ item.blueprint.INTERNAL_STRUCTURE.Overview.description }} </div>
          <div> <font color="green"> Method score:</font> {{ item.score }} </div>
          <div> <font color="blue"> Feedback:</font> {{ item.userRating }} </div>
          <div v-for="method in item.methodNames"> <font color="black"> Method name:</font> {{ method }} </div>

          <b-button class="mt-1 mb-2" variant="success" v-on:click="requestDeployment(item)">Deploy</b-button>
          &nbsp;
          <!-- THIS BUTTON WAS ONLY ADDED FOR DEBUGGING PURPOSES -->
          <b-button class="mt-1 mb-2" variant="success" v-on:click="downloadIntermediateBp(item)">Download intermediate blueprint</b-button>

          <b-list-group v-for="infrastructure in item.blueprint.COOKBOOK_APPENDIX.Resources.infrastructures">
            <b-list-group-item variant="info" button>
                      <font color="black"> Infrastructure name:
                      </font> {{ infrastructure.name }}
                      <b-row>&nbsp;&nbsp;Ditas default:&nbsp;
                      <!--DOCS: By default, <b-form-checkbox> value will be true when checked and false when unchecked.
                      You can customize the checked and unchecked values by specifying the value and unchecked-value
                      properties, respectively.
                      NB: I'm using custom values here, because I need true/false as strings, not as booleans. -->
                      <b-form-checkbox
                      v-model="infrastructure.extra_properties.ditas_default"
                      value="true"
                      unchecked-value="false">
                      </b-form-checkbox>
                      </b-row>
            </b-list-group-item>
          </b-list-group>

        </b-card>
      </b-container>
    </div>

    <!--This is the popup that is shown if the user tried to request a deployment
    where multiple infrastructures were selected as default (which is not allowed).
    The boolean in "v-model" is used to decide when the popup should be displayed. -->
    <b-modal v-model="showErrorPopup" title="Error!" cancel-disabled>
         Make sure you select one and only one infrastructure as default. Then try to deploy again.
    </b-modal>

    <!--This is the popup that is shown when the user starts a deployment.-->
    <b-modal v-model="showDeploymentPopup" title="Deployment info" cancel-disabled>
      <!--If no response has been received from the DE yet, a spinner is displayed.-->
      <b-button v-if="DEresponse==null" variant="success" disabled >
        <b-spinner small label="Spinning" ></b-spinner>
        Starting deployment...
      </b-button>
      <!--Else, the response from the DE is displayed.-->
      <pre v-else> {{ DEresponse }} </pre>
    </b-modal>


    <b-button class="mt-2 mb-2" variant="success" v-on:click="generateJSON()">1) Generate app_reqs JSON</b-button>
    <br>
    <b-button class="mt-2 mb-2" variant="success" v-on:click="call_RE()">2) Send app_reqs to RE</b-button>
    <br>

    <pre> {{this.finalJSON}} </pre>

  </div>
</template>



<script>

import axios from 'axios';
import download from 'downloadjs';

export default {
  name: 'FourthTab',

  data() {
    return {
      showErrorPopup: false,
      showDeploymentPopup: false,
      receivedBlueprints: null,
      DEresponse: null,
      finalJSON: {},

      blueprint_attribs_batch_DU: [
                                  {
                                      "id": "availability",
                                      "description":"Availability",
                                      "type":"Availability",
                                      "properties":
                                      {
                                          "availability":
                                          {
                                              "unit": "percentage",
                                              "minimum":90
                                          }
                                      }
                                  },
                                  {
                                      "id": "responseTime",
                                      "description": "ResponseTime",
                                      "type": "ResponseTime",
                                      "properties": {
                                          "responseTime": {
                                              "maximum": 2,
                                              "unit": "second"
                                          }
                                      }
                                  },
                                  {
                                      "id": "timeliness",
                                      "description": "Timeliness",
                                      "type": "Timeliness",
                                      "properties":
                                      {
                                          "timeliness":
                                          {
                                              "minimum":"High",
                                              "unit": "percentage"
                                          }
                                      }
                                  },
                                  {
                                      "id": "volume",
                                      "description": "number of tuples",
                                      "type": "Volume",
                                      "properties": {
                                          "volume": {
                                              "minimum": "1200",
                                              "unit": "tuple"
                                          }
                                      }
                                  },
                                  {
                                      "id":"secondsRecorded",
                                      "description":"number of seconds recorded",
                                      "type":"SecondsRecorded",
                                      "properties":{
                                         "secondsRecorded":{
                                            "value":"7776000",
                                            "unit":"second"
                                         }
                                      }
                                   },
                                   {
                                      "id":"scaleUpMemory",
                                      "description":"scale-up memory",
                                      "type":"Scale-up",
                                      "properties":{
                                         "ramGain":{
                                            "unit":"percentage",
                                            "value":130
                                         },
                                         "ramLimit":{
                                            "unit":"percentage",
                                            "value":90
                                         }
                                      }
                                   },
                                   {
                                      "id":"scaleUpSpace",
                                      "description":"scale-up space",
                                      "type":"Scale-up",
                                      "properties":{
                                         "spaceGain":{
                                            "unit":"percentage",
                                            "value":110
                                         },
                                         "spaceLimit":{
                                            "unit":"percentage",
                                            "value":95
                                         }
                                      }
                                   },
                                   {
                                      "id":"accuracy",
                                      "description":"Accuracy",
                                      "type":"Accuracy",
                                      "properties":{
                                         "accuracy":{
                                            "minimum":90,
                                            "unit":"percentage"
                                         }
                                      }
                                   },
                                   {
                                      "id":"processCompleteness",
                                      "description":"Process completeness",
                                      "type":"Process completeness",
                                      "properties":{
                                         "completeness":{
                                            "minimum":80,
                                            "unit":"percentage"
                                         }
                                      }
                                   }
                              ],

      blueprint_attribs_batch_S: [
                                {
                                    "id": "encryption",
                                    "description": "Encryption",
                                    "type": "TransportEncryption",
                                    "properties": {
                                        "protocol": {
                                            "unit": "enum",
                                            "value": "TLS"
                                        },
                                        "algorithm": {
                                            "unit": "list",
                                            "value": ["TLS_AES_256_GCM_SHA384", "TLS_AES_128_GCM_SHA256", "TLS_AES_128_CCM_8_SHA256", "TLS_AES_128_CCM_SHA256"]
                                        },
                                        "keyLength": {
                                            "unit": "number",
                                            "value": 128
                                        }
                                    }
                                },
                                {
                                            "id":"accessControl",
                                            "description":"Protocol",
                                            "type":"Protocol",
                                            "properties":{
                                               "required":{
                                                  "value":"true"
                                               },
                                               "protocol":{
                                                  "unit":"enum",
                                                  "value":"username/password"
                                               },
                                               "credentials":{
                                                  "unit":"list",
                                                  "convertToArray":"true",
                                                  "value":[
                                                     "researcher_id"
                                                  ]
                                               }
                                            }
                                         },
                                         {
                                            "id":"tracing",
                                            "description":"Tracing",
                                            "type":"Tracing",
                                            "properties":{
                                               "level":{
                                                  "unit":"enum",
                                                  "value":"datasource"
                                               },
                                               "sampleRate":{
                                                  "unit":"percentage",
                                                  "value":1
                                               },
                                               "instrumentation":{
                                                  "unit":"enum",
                                                  "value":"VDC"
                                               }
                                            }
                                         }
                            ],

      blueprint_attribs_batch_P: [
         {
            "id":"purposeControl_research",
            "description":"PurposeControl research",
            "type":"PurposeControl",
            "properties":{
               "availablePurpose":{
                  "unit":"list",
                  "value":[
                     "research",
                     "medical research",
                     "nutritional research"
                  ]
               },
               "allowedGuarantor":{
                  "unit":"list",
                  "convertToArray":"true",
                  "value":[
                     "d63d0e21fdc05f618d55ef306c54af82"
                  ]
               }
            }
         }
      ],

      blueprint_attribs_streaming_DU: [
                                        {
                                            "id": "availability",
                                            "description":"Availability",
                                            "type":"Availability",
                                            "properties":
                                            {
                                                "availability":
                                                {
                                                    "unit": "percentage",
                                                    "minimum":95
                                                }
                                            }
                                        },
                                        {
                                            "id": "throughput",
                                            "description": "throughput",
                                            "type": "throughput",
                                            "properties":
                                            {
                                                "throughput":
                                                {
                                                    "minimum":0.5,
                                                    "unit": "MB/s"
                                                }
                                            }
                                        },
                                        {
                                            "id": "timeliness",
                                            "description": "Timeliness",
                                            "type": "Timeliness",
                                            "properties":
                                            {
                                                "timeliness":
                                                {
                                                    "minimum":"mid/high",
                                                    "unit": "percentage"
                                                }
                                            }
                                        },
                                        {
                                            "id": "precision",
                                            "description": "Precision",
                                            "type": "Precision",
                                            "properties":
                                            {
                                                "precision":
                                                {
                                                    "maximum":0.8,
                                                    "unit": "none"
                                                }
                                            }
                                        },
                                        {
                                            "id": "accuracy",
                                            "description": "Accuracy",
                                            "type": "Accuracy",
                                            "properties":
                                            {
                                                "accuracy":
                                                {
                                                    "minimum":90,
                                                    "unit": "percentage"
                                                }
                                            }
                                        }
                                    ],

      blueprint_attribs_streaming_S: [
                                    {
                                        "id": "encryption",
                                        "description": "Encryption",
                                        "type": "TransportEncryption",
                                        "properties": {
                                            "protocol": {
                                                "unit": "enum",
                                                "value": "TLS"
                                            },
                                            "algorithm": {
                                                "unit": "list",
                                                "value": ["TLS_AES_256_GCM_SHA384", "TLS_AES_128_GCM_SHA256", "TLS_AES_128_CCM_8_SHA256", "TLS_AES_128_CCM_SHA256"]
                                            },
                                            "keyLength": {
                                                "unit": "number",
                                                "value": 128
                                            }
                                        }
                                    },
                                    {
                                               "id":"accessControl",
                                               "description":"Protocol",
                                               "type":"Protocol",
                                               "properties":{
                                                  "required":{
                                                     "value":"true"
                                                  },
                                                  "protocol":{
                                                     "unit":"enum",
                                                     "value":"username/password"
                                                  },
                                                  "credentials":{
                                                     "unit":"list",
                                                     "convertToArray":"true",
                                                     "value":[
                                                        "researcher_id"
                                                     ]
                                                  }
                                               }
                                            },
                                            {
                                               "id":"tracing",
                                               "description":"Tracing",
                                               "type":"Tracing",
                                               "properties":{
                                                  "level":{
                                                     "unit":"enum",
                                                     "value":"datasource"
                                                  },
                                                  "sampleRate":{
                                                     "unit":"percentage",
                                                     "value":1
                                                  },
                                                  "instrumentation":{
                                                     "unit":"enum",
                                                     "value":"VDC"
                                                  }
                                               }
                                            }
                                ],

      blueprint_attribs_streaming_P: [
         {
            "id":"purposeControl_research",
            "description":"PurposeControl research",
            "type":"PurposeControl",
            "properties":{
               "availablePurpose":{
                  "unit":"list",
                  "value":[
                     "research",
                     "medical research",
                     "nutritional research"
                  ]
               },
               "allowedGuarantor":{
                  "unit":"list",
                  "convertToArray":"true",
                  "value":[
                     "d63d0e21fdc05f618d55ef306c54af82"
                  ]
               }
            }
         }
      ],

      blueprint_tree_batch_DU: {
                                 "description":"Requirements achieved",
                                 "type":"AND",
                                 "connectorId":'1',
                                 "children":[
                                    {
                                       "description":"High QoS",
                                       "type":"AND",
                                       "connectorId":'2',
                                       "leaves":[
                                          {
                                             "id":"serviceAvailable",
                                             "description":"Service Available",
                                             "weight":1,
                                             "attributes":[
                                                "availability"
                                             ]
                                          },
                                          {
                                             "id":"fastProcess",
                                             "description":"Fast Process",
                                             "weight":1,
                                             "attributes":[
                                                "responseTime"
                                             ]
                                          },
                                          {
                                             "id":"serviceScalable",
                                             "description":"Scalable Service",
                                             "weight":1,
                                             "attributes":[
                                                "scaleUpMemory",
                                                "scaleUpSpace"
                                             ]
                                          }
                                       ]
                                    },
                                    {
                                       "description":"High Data Quality",
                                       "type":"AND",
                                       "connectorId":'3',
                                       "leaves":[
                                          {
                                             "id":"freshData",
                                             "description":"Fresh Data",
                                             "weight":1,
                                             "attributes":[
                                                "timeliness"
                                             ]
                                          },
                                          {
                                             "id":"EnoughData",
                                             "description":"Enough Amount Of Data",
                                             "weight":1,
                                             "attributes":[
                                                "volume"
                                             ]
                                          },
                                          {
                                             "id":"History",
                                             "description":"History",
                                             "weight":1,
                                             "attributes":[
                                                "secondsRecorded"
                                             ]
                                          },
                                          {
                                             "id":"accuracy",
                                             "description":"Accuracy",
                                             "weight":1,
                                             "attributes":[
                                                "accuracy"
                                             ]
                                          },
                                          {
                                             "id":"completeness",
                                             "description":"Process Completeness",
                                             "weight":1,
                                             "attributes":[
                                                "processCompleteness"
                                             ]
                                          }
                                       ]
                                    }
                                 ]
                              },

      blueprint_tree_batch_S: {
                          			"type": "AND",
                                "description": "High security",
                          			"leaves": [
                                           {
                            					       "id": "TrasportEncryption",
                            					       "description": "Secure Data Transport",
                            					       "weight": 1,
                            					       "attributes": [
                            						             "encryption"
                            					                     ]
                          				          },
                                    				{
                                    					"id": "AccessControl",
                                    					"description": "Secure Access",
                                    					"weight": 1,
                                    					"attributes": [
                                    						      "accessControl"
                                    					               ]
                                    				},
                                            {
                                               "id":"TracingAccess",
                                               "description":"Tracing and Access Monitoring",
                                               "weight":1,
                                               "attributes":[
                                                  "tracing"
                                               ]
                                            }
                          			           ]
                          		},

      blueprint_tree_batch_P: {
                                "description": "High Privacy",
                                "leaves": [
                                           {
                                             "id": "purposeControl",
                                             "description": "Purpose Control",
                                             "weight": 1,
                                             "attributes": [
                                                     "purposeControl_research"
                                                           ]
                                            }
                                           ]
                              },

      blueprint_tree_streaming_DU: {
                                    "description": "Requirements achieved",
                              			"type": "AND",
                                    "connectorId":'1',
                              			"children": [
                                                  {
                                                  "description": "High QoS",
                                        					"type": "AND",
                                                  "connectorId":'2',
                                                  "leaves": [
                                                             {
                                            									"id": "serviceAvailable",
                                            									"description": "Service Available",
                                            									"weight": 1,
                                            									"attributes": [
                                            										          "availability"
                                            									               ]
                                        								     },
                                        								     {
                                            									"id": "FastDataStreaming",
                                            									"description": "Fast Data Streaming",
                                            									"weight": 1,
                                            									"attributes": [
                                            										          "throughput"
                                            									              ]
                                        								     }
                                        						      	]
                                        				 },
                                        				{
                                                  "description": "High Data Quality",
                                        					"type": "AND",
                                                  "connectorId":'3',
                                        					"leaves": [
                                        						          {
                                                  							"id": "timeliness",
                                                  							"description": "Timeliness",
                                                  							"weight": 1,
                                                  							"attributes": [
                                                  								        "timeliness"
                                                  							               ]
                                        						          },
                                        						          {
                                                  							"id": "consistency",
                                                  							"description": "Consistency",
                                                  							"weight": 1,
                                                  							"attributes": [
                                                  								        "precision", "accuracy"
                                                  							               ]
                                                						}
                                        					         ]
                                        				  }
                              			           ]
      },

      blueprint_tree_streaming_S: {
                              			"type": "AND",
                                    "description": "High security",
                              			"leaves": [
                                               {
                                      					"id": "TrasportEncryption",
                                      					"description": "Secure Data Transport",
                                      					"weight": 1,
                                      					"attributes": [
                                          						  "encryption"
                                      					              ]
                                      				},
                                      				{
                                      					"id": "AccessControl",
                                      					"description": "Secure Access",
                                      					"weight": 1,
                                      					"attributes": [
                                      						      "accessControl"
                                      					              ]
                                      				},
                                              {
                                                 "id":"TracingAccess",
                                                 "description":"Tracing and Access Monitoring",
                                                 "weight":1,
                                                 "attributes":[
                                                    "tracing"
                                                 ]
                                              }
                              			         ]
		                              },

      blueprint_tree_streaming_P: {
                                    "description": "High Privacy",
                                    "leaves": [
                                               {
                                                 "id": "purposeControl",
                                                 "description": "Purpose Control",
                                                 "weight": 1,
                                                 "attributes": [
                                                         "purposeControl_research"
                                                               ]
                                                }
                                               ]
                              },
    }
  },

  methods: {


      downloadIntermediateBp: function(selectedBlueprint){
        //This function is only used for debugging purposes.

        // As requested, I'm hardcoding "spart-edge-infrastructure" and "spart-fog-infrastructure", only for "batch" applications.
        if(this.finalJSON.applicationType=="batch") {
        selectedBlueprint.blueprint.INTERNAL_STRUCTURE.DAL_Images["influxdb-dal-local"].cluster_original_ips["spart-edge-infrastructure"] = "192.168.30.32";
        selectedBlueprint.blueprint.INTERNAL_STRUCTURE.DAL_Images["influxdb-dal-local"].cluster_original_ips["spart-fog-infrastructure"] = "192.168.30.32";
      }

        //As requested, I'm explicitely deleting attributes "password" and "username" in case of "kubernetes" infrastructures (otherwise, they'd cause problems).
        let infrastructures = selectedBlueprint.blueprint.COOKBOOK_APPENDIX.Resources.infrastructures;
        for(var k=0; k < infrastructures.length; k++){
          if(infrastructures[k].provider.api_type=="kubernetes"){
              if( infrastructures[k].provider.credentials.hasOwnProperty('password') ){
                delete infrastructures[k].provider.credentials.password;
              }
              if( infrastructures[k].provider.credentials.hasOwnProperty('username') ){
                delete infrastructures[k].provider.credentials.username;
              }
          }
        }

        download(JSON.stringify(selectedBlueprint.blueprint), "concrete-bp.json", "application/json");
      },

      requestDeployment: function(selectedBlueprint) {
        var infrastructures = selectedBlueprint.blueprint.COOKBOOK_APPENDIX.Resources.infrastructures;
        var blueprintObject = selectedBlueprint.blueprint;
        var numFound = 0;
        for (var k=0; k < infrastructures.length; k++){
          if (infrastructures[k].extra_properties.ditas_default == "true"){
            numFound++;
          }
        }
        //If there is more than one infrastructure that has been selected as default, then show a warning popup.
        if (numFound!=1){
            this.showErrorPopup = true;
        }
        else{


          // As requested, I'm hardcoding "spart-edge-infrastructure" and "spart-fog-infrastructure", only for "batch" applications.
          if(this.finalJSON.applicationType=="batch") {
            selectedBlueprint.blueprint.INTERNAL_STRUCTURE.DAL_Images["influxdb-dal-local"].cluster_original_ips["spart-edge-infrastructure"] = "192.168.30.32";
            selectedBlueprint.blueprint.INTERNAL_STRUCTURE.DAL_Images["influxdb-dal-local"].cluster_original_ips["spart-fog-infrastructure"] = "192.168.30.32";
          }

          //As requested, I'm explicitely deleting attributes "password" and "username" in case of "kubernetes" infrastructures (otherwise, they'd cause problems).
          let infrastructures = selectedBlueprint.blueprint.COOKBOOK_APPENDIX.Resources.infrastructures;
          for(var k=0; k < infrastructures.length; k++){
            if(infrastructures[k].provider.api_type=="kubernetes"){
                if( infrastructures[k].provider.credentials.hasOwnProperty('password') ){
                  delete infrastructures[k].provider.credentials.password;
                }
                if( infrastructures[k].provider.credentials.hasOwnProperty('username') ){
                  delete infrastructures[k].provider.credentials.username;
                }
            }
          }

          this.displayDeploymentPopup();

          console.log("Performing post call to Deployment engine.");

          // THIS IS THE CALL TO THE DEPLOYMENT ENGINE ( IT IS PASSING blueprintObject, THE ONE RECEIVED FROM THE RE)
          // NB: make sure that "blueprintObject" contains the right credentials of the cloudsigma account.
          axios
               .post('http://153.92.30.56:50012/blueprint',
                blueprintObject,
                {headers: {'Content-Type': 'application/json'}})
               .then(response => (this.DEresponse = response))
               .catch(function (error) {
                      console.log(error);
                    });
        }

      },

      call_RE: function() {
        /* This is the call to the Resolution Engine. */

        axios
             .post('/searchBlueprintByReq',
              this.finalJSON,
              {headers: {'Content-Type': 'application/json'}})
             .then(response => (this.receivedBlueprints = response.data))
             .catch(function (error) {
                    console.log(error);
                  });


      },

      displayDeploymentPopup: function(){
        this.showDeploymentPopup = true;

      },

      generateJSON: function() {
          //finalJSON is a different object!!! It's not a simple reference to "this.$root.$data.globalObject".
          this.finalJSON = JSON.parse(JSON.stringify( this.$root.$data.globalObject )); //This trick is used to clone the global object and create a new independent object (it's NOT passed by reference).
          //this.copyCredentialsFile(); --> Not necessary anymore, because we're not using credential files anymore.
          this.getApplicationType();
          this.populateSingleMethodTagArray();
          this.eliminateDuplicatesOfMethodTagArray();
          this.removeMethodTagArrays();
          if (!this.finalJSON.applicationType){
              //If the user has not selected an applicationType, then return (otherwise the rest of the code will generate errors).
              console.log("Please, select an application type and try again.");
              return;
          }
          else if (this.finalJSON.applicationType == 'streaming' || this.finalJSON.applicationType == 'batch'){
              this.prepareToPropagateRemoved();
              // What should happen if all the children of a node are removed? Should the parent be removed, too?
              this.generateBlueprintTree_DataUtility();
              this.generateBlueprintTree_Security();
              this.generateBlueprintTree_Privacy();
              this.generateBlueprintAttributes_DataUtility();
              this.generateBlueprintAttributes_Security();
              this.generateBlueprintAttributes_Privacy();
          }
          this.removeMyTrees();
      },

      copyCredentialsFile() {
          var arrayLength = this.$root.$data.globalObject.providedResources.infrastructures.length;
          for (var k = 0; k < arrayLength; k++) { //For each infrastructure...
              var credentialsFile = this.$root.$data.globalObject.providedResources.infrastructures[k].provider.credentials.config;
              if(credentialsFile){
                  // Transform string "credentialsFile" into a proper object.
                  this.finalJSON.providedResources.infrastructures[k].provider.credentials.config = JSON.parse(credentialsFile);
              }
          }
          //console.log("Michele: remember to test that the 'credentialsFile' of each infrastructure is properly copied and sent!!!");
      },

      getApplicationType() {
          this.finalJSON.applicationType = this.finalJSON.treeSection.applicationType;
          delete this.finalJSON.treeSection.applicationType; //Delete the value of this attribute, because it is already stored in another attribute.
      },

      populateSingleMethodTagArray: function() {
          /* So far, each "method" has its own "MethodTags" array.
          Now, this function copies all the arrays into a single array.
          The name of the single array that is populated this way is: finalJSON.functionalRequirements.methodTags */
          var arrayLength = this.finalJSON.methodsOutput.methods.length;
          for (var i = 0; i < arrayLength; i++) {
              var nestedArray =  this.finalJSON.methodsOutput.methods[i].methodTags;
              var nestedLength = this.finalJSON.methodsOutput.methods[i].methodTags.length;
              for (var k = 0; k < nestedLength; k++ ) {
                this.finalJSON.functionalRequirements.methodTags.push(nestedArray[k]);
              }
          }
      },

      eliminateDuplicatesOfMethodTagArray: function(){
        /* Now that all the methodTags have been inserted into a single array,
           this function removes all the duplicates from it.  */
        var methodTagArray = this.finalJSON.functionalRequirements.methodTags;
        var alreadyFound = [];
        var filteredArray = methodTagArray.filter(function(element) {
            //If this element was not found already, add it to the "alreadyFound" array now, and then return true.
            if (alreadyFound.indexOf(element) == -1) {
                alreadyFound.push(element);
                return true; // "true" means the condition was satisfied -> the element must NOT be filtered
                }
                return false; // "false" means the condition was not satisfied -> the element must be filtered
        });
        this.finalJSON.functionalRequirements.methodTags = filteredArray;
      },

      removeMethodTagArrays: function() {
          /* This function removes the "methodTags" array from each "method" object (in order
          to comply with the required schema of "methods", as each "method" should only
          have two attributes, i.e., "method_id" and "attributes"). */
          var arrayLength = this.finalJSON.methodsOutput.methods.length;
          for (var i = 0; i < arrayLength; i++) {
              delete this.finalJSON.methodsOutput.methods[i].methodTags;
          }

      },

      removeMyTrees: function() {
          //This function removes my 4 trees I generated from the interface,
          //because they use a different encoding from the blueprint.
          delete this.finalJSON.treeSection;
      },

      prepareToPropagateRemoved: function() {

          /* To increase readability, the trees that I generated from the interface are stored in variables with shorter names (DU_Nodes, S_Nodes) by reference. */
          if (this.finalJSON.applicationType == 'streaming') {
              var DU_Nodes = this.finalJSON.treeSection.treeStreamingDataUtility; //my tree, that I generated from the interface
              var S_Nodes = this.finalJSON.treeSection.treeStreamingSecurity; //my tree, that I generated from the interface
              var P_Nodes = this.finalJSON.treeSection.treeStreamingPrivacy; //my tree, that I generated from the interface
          }
          else if (this.finalJSON.applicationType == 'batch') {
              var DU_Nodes = this.finalJSON.treeSection.treeBatchDataUtility; //my tree, that I generated from the interface
              var S_Nodes = this.finalJSON.treeSection.treeBatchSecurity; //my tree, that I generated from the interface
              var P_Nodes = this.finalJSON.treeSection.treeBatchPrivacy; //my tree, that I generated from the interface
          }

          //Recursively propagate the "isRemoved" flag from the tree root to all the other nodes of the tree.
          this.propagateRemoved(DU_Nodes.isRemoved, DU_Nodes.children);
          this.propagateRemoved(S_Nodes.isRemoved, S_Nodes.children);
          this.propagateRemoved(P_Nodes.isRemoved, P_Nodes.children);
      },

      propagateRemoved: function(isParentRemoved, children) {
      //This recursive function propagates the "isRemoved" flag from one node of the tree to its children.
          for(var k=0; k < children.length; k++){
            if(isParentRemoved==true && children[k].label!="AND" && children[k].label!="OR" ){
               children[k].isRemoved = isParentRemoved;
            }
            if(children[k].children){
                this.propagateRemoved(children[k].isRemoved, children[k].children);
            }
          }
      },

      generateBlueprintTree_DataUtility: function(){
        /* First phase: set some variables */
        if (this.finalJSON.applicationType == 'streaming'){
            var myTree_DU = this.finalJSON.treeSection.treeStreamingDataUtility; //my tree, that I generated from the interface
            this.finalJSON.goalTrees.dataUtility = JSON.parse(JSON.stringify(this.blueprint_tree_streaming_DU)); //This creates a new object (not passed by reference!)
        }
        else if (this.finalJSON.applicationType == 'batch'){
            var myTree_DU = this.finalJSON.treeSection.treeBatchDataUtility; //my tree, that I generated from the interface
            this.finalJSON.goalTrees.dataUtility = JSON.parse(JSON.stringify(this.blueprint_tree_batch_DU)); //This creates a new object (not passed by reference!)
        }

        var bTree_DU = this.finalJSON.goalTrees.dataUtility; //This is where I'll store the tree in the format of the blueprint

        /* Second phase: remove nodes from the blueprint tree and update connectors (AND/OR). */
        if(myTree_DU.isRemoved){ //If the root node is removed, set the whole object to an empty object (so as to remove everything inside)
           //this.finalJSON.goalTrees.dataUtility = {};
           delete this.finalJSON.goalTrees.dataUtility;
           return;
        }
        else {
          for (var k=0; k < myTree_DU.children.length; k++ ){ //Traverse my tree...
              if (myTree_DU.children[k].isRemoved == true) { //If this node is removed...
                  //console.log("1removed: " + myTree_DU.children[k].isRemoved + " label: " + myTree_DU.children[k].label);
                  this.searchAndRemove_DU_node(bTree_DU, myTree_DU.children[k].label); //Search for the node in the blueprint tree, and remove the node from the blueprint tree.
              }
              else if (myTree_DU.children[k].connectorId){ //If this node is a connector (AND/OR), because it has a connectorId...
                  this.searchAndReplace_DU_connector(bTree_DU, myTree_DU.children[k]);  //Search for the connector node in the blueprint tree, and update its value (either AND or OR).
              }
              if(myTree_DU.children[k].children){ //Moreover, if this node has children...
                for (var j=0; j < myTree_DU.children[k].children.length; j++ ){ //Traverse the children in my tree...
                  if (myTree_DU.children[k].children[j].isRemoved == true) { //If this node is removed...
                      //console.log("2removed: " + myTree_DU.children[k].children[j].isRemoved + " label: " + myTree_DU.children[k].children[j].label);
                      this.searchAndRemove_DU_node(bTree_DU, myTree_DU.children[k].children[j].label); //Search for the node in the blueprint tree, and remove the node from the blueprint tree.
                  }
                  else if (myTree_DU.children[k].children[j].connectorId){ //If this node is a connector (AND/OR), because it has a connectorId...
                      this.searchAndReplace_DU_connector(bTree_DU, myTree_DU.children[k].children[j]);  //Search for the connector node in the blueprint tree, and update its value (either AND or OR).
                  }
                }
              }
          }
        }


      },

      searchAndRemove_DU_node: function(blueprintTree, nodeName) {
        //Search for a specific node in the blueprint tree, and then remove that node.

        //console.log("Search and remove: " + nodeName );

        for (var k=0; k < blueprintTree.children.length; k++ ){
          //console.log("lf: " + nodeName + " found: " + blueprintTree.children[k].description);
          if (blueprintTree.children[k].description == nodeName){
            blueprintTree.children.splice(k,1);
            return;
          }
          if (blueprintTree.children[k].leaves) {
            for (var w=0; w < blueprintTree.children[k].leaves.length; w++ ){
              //console.log("lf: " + nodeName + " found: " + blueprintTree.children[k].leaves[w].description);
              if (blueprintTree.children[k].leaves[w].description == nodeName){
                blueprintTree.children[k].leaves.splice(w,1);
                return;
              }
            }
          }
        }

      },

      searchAndReplace_DU_connector: function(blueprintTree, connectorNode) {
        //Search for a specific connector in the blueprint tree, and then update its value (either AND or OR).
        var id = connectorNode.connectorId;
        var label = connectorNode.label;

        if (id == '1'){
            blueprintTree.type = label;
            delete blueprintTree.connectorId;
            return;
        }

        for (var k=0; k < blueprintTree.children.length; k++ ){
          //console.log("lf: " + nodeName + " found: " + blueprintTree.children[k].description);
          if (blueprintTree.children[k].connectorId == id){
            blueprintTree.children[k].type = label;
            delete blueprintTree.children[k].connectorId;
            return;
          }
        }


      },

      generateBlueprintTree_Security: function(){
        /* First phase: set some variables */
        if (this.finalJSON.applicationType == 'streaming'){
            var myTree_S = this.finalJSON.treeSection.treeStreamingSecurity; //my tree, that I generated from the interface
            this.finalJSON.goalTrees.security = JSON.parse(JSON.stringify(this.blueprint_tree_streaming_S)); //This creates a new object (not passed by reference!)
        }
        else if (this.finalJSON.applicationType == 'batch'){
            var myTree_S = this.finalJSON.treeSection.treeBatchSecurity; //my tree, that I generated from the interface
            this.finalJSON.goalTrees.security = JSON.parse(JSON.stringify(this.blueprint_tree_batch_S)); //This creates a new object (not passed by reference!)
        }

        var bTree_S = this.finalJSON.goalTrees.security; //This is where I'll store the tree in the format of the blueprint

        /* Second phase: remove nodes from the blueprint tree and update connectors (AND/OR). */
        if(myTree_S.isRemoved){ //If the root node is removed, set the whole object to an empty object (so as to remove everything inside)
           //this.finalJSON.goalTrees.security = {};
           delete this.finalJSON.goalTrees.security;
           return;
        }
        else {
          for (var k=0; k < myTree_S.children.length; k++ ){ //Traverse my tree...
              if (myTree_S.children[k].isRemoved == true) { //If this node is removed...
                  //console.log("1removed: " + myTree_S.children[k].isRemoved + " label: " + myTree_S.children[k].label);
                  this.searchAndRemove_S_node(bTree_S, myTree_S.children[k].label); //Search for the node in the blueprint tree, and remove the node from the blueprint tree.
              }
              else if (myTree_S.children[k].connectorId){ //If this node is a connector (AND/OR), because it has a connectorId...
                  this.searchAndReplace_S_connector(bTree_S, myTree_S.children[k].label);  //Search for the connector node in the blueprint tree, and update its value (either AND or OR).
              }
          }
        }


      },

      searchAndRemove_S_node: function(blueprintTree, nodeName) {
        //Search for a specific node in the blueprint tree, and then remove that node.

        //console.log("Search and remove: " + nodeName );

        for (var k=0; k < blueprintTree.leaves.length; k++ ){
          //console.log("lf: " + nodeName + " found: " + blueprintTree.leaves[k].description);
          if (blueprintTree.leaves[k].description == nodeName){
            blueprintTree.leaves.splice(k,1);
            return;
          }
        }

      },

      searchAndReplace_S_connector: function(blueprintTree, connectorLabel) {
        /*The security blueprint tree only has one connector node (AND/OR).
          This function replaces its value (AND or OR) with the one stored in my security tree. */
        blueprintTree.type = connectorLabel;
      },

      generateBlueprintTree_Privacy: function(){
        if (this.finalJSON.applicationType == 'streaming'){
            var myTree_P = this.finalJSON.treeSection.treeStreamingPrivacy; //my tree, that I generated from the interface
            this.finalJSON.goalTrees.privacy = JSON.parse(JSON.stringify(this.blueprint_tree_streaming_P)); //This creates a new object (not passed by reference!)
        }
        else if (this.finalJSON.applicationType == 'batch'){
            var myTree_P = this.finalJSON.treeSection.treeBatchPrivacy; //my tree, that I generated from the interface
            this.finalJSON.goalTrees.privacy = JSON.parse(JSON.stringify(this.blueprint_tree_batch_P)); //This creates a new object (not passed by reference!)
        }

        var bTree_P = this.finalJSON.goalTrees.privacy; //This is where I'll store the tree in the format of the blueprint

        if(myTree_P.isRemoved){ //If the root node is removed, set the whole object to an empty object (so as to remove everything inside)
           //this.finalJSON.goalTrees.privacy = {};
           delete this.finalJSON.goalTrees.privacy;
           return;
        }
        else {
          for (var k=0; k < myTree_P.children.length; k++ ){ //Traverse my tree...
              if (myTree_P.children[k].isRemoved == true) { //If this node is removed...
                  //console.log("1removed: " + myTree_P.children[k].isRemoved + " label: " + myTree_P.children[k].label);
                  this.searchAndRemove_P_node(bTree_P, myTree_P.children[k].label); //Search for the node in the blueprint tree, and remove the node from the blueprint tree.
              }
          }
        }


      },

      searchAndRemove_P_node: function(blueprintTree, nodeName) {
        //Search for a specific node in the blueprint tree, and then remove that node.

        //console.log("Search and remove: " + nodeName );

        for (var k=0; k < blueprintTree.leaves.length; k++ ){
          //console.log("lf: " + nodeName + " found: " + blueprintTree.leaves[k].description);
          if (blueprintTree.leaves[k].description == nodeName){
            blueprintTree.leaves.splice(k,1);
            return;
          }
        }

      },

      generateBlueprintAttributes_DataUtility: function() {
        if (this.finalJSON.applicationType == 'streaming') {
            var myTree_DU = this.finalJSON.treeSection.treeStreamingDataUtility; //my tree, that I generated from the interface
            this.finalJSON.attributes.dataUtility = JSON.parse(JSON.stringify(this.blueprint_attribs_streaming_DU)); //This creates a new object (not passed by reference!)
        }
        else if (this.finalJSON.applicationType == 'batch') {
            var myTree_DU = this.finalJSON.treeSection.treeBatchDataUtility; //my tree, that I generated from the interface
            this.finalJSON.attributes.dataUtility = JSON.parse(JSON.stringify(this.blueprint_attribs_batch_DU)); //This creates a new object (not passed by reference!)
        }

        var bAttributes_DU = this.finalJSON.attributes.dataUtility; //This is where I'll store the attributes in the format of the blueprint

        //Traverse my tree...
        for (var a=0; a < myTree_DU.children.length; a++ ){  //NB: FIRST LVL OF DEPTH IN THE TREE
            if(myTree_DU.children[a].children){ //If this node has some children...
              for (var b=0; b < myTree_DU.children[a].children.length; b++ ){  //NB: SECOND LVL OF DEPTH IN THE TREE
                if (myTree_DU.children[a].children[b].properties ) { //If this node has some properties...
                    for (var c=0; c < myTree_DU.children[a].children[b].properties.length; c++){ //Here, we're traversing the properties of the children at the 2nd lvl of depth in the tree.
                        var property = myTree_DU.children[a].children[b].properties[c];
                        var mustBeRemoved = myTree_DU.children[a].children[b].isRemoved;
                        //console.log("Remove: "+ mustBeRemoved + ", attrib_id : " + property.attribute_id + ", property_id :" + property.property_id + ", value: " + property.selectedValue);
                        //Search for this property in the blueprint attributes. Remove it from there if "mustBeRemoved" is true, otherwise update its value.
                        this.searchAndUpdate_attrib(bAttributes_DU, mustBeRemoved, property);
                    }
                }
                if (myTree_DU.children[a].children[b].children) {
                    for (var d=0; d < myTree_DU.children[a].children[b].children.length; d++){  //NB: THIRD LVL OF DEPTH IN THE TREE
                        if (myTree_DU.children[a].children[b].children[d].properties ){ //If this node has some properties...
                          for (var e=0; e < myTree_DU.children[a].children[b].children[d].properties.length; e++){ //Here, we're traversing the properties of the children at the 3rd lvl of depth in the tree.
                               var property = myTree_DU.children[a].children[b].children[d].properties[e];
                               var mustBeRemoved = myTree_DU.children[a].children[b].children[d].isRemoved;
                               //console.log("Remove: "+ mustBeRemoved +", attrib_id : " + property.attribute_id + ", property_id :" + property.property_id + ", value: " + property.selectedValue );
                               //Search for this property in the blueprint attributes. Remove it from there if "mustBeRemoved" is true, otherwise update its value.
                               this.searchAndUpdate_attrib(bAttributes_DU, mustBeRemoved, property);
                          }
                        }
                    }
                }
              }
            }
        }


      },

      generateBlueprintAttributes_Security: function() {
        if (this.finalJSON.applicationType == 'streaming') {
            var myTree_S = this.finalJSON.treeSection.treeStreamingSecurity; //my tree, that I generated from the interface
            this.finalJSON.attributes.security = JSON.parse(JSON.stringify(this.blueprint_attribs_streaming_S)); //This creates a new object (not passed by reference!)
        }
        else if (this.finalJSON.applicationType == 'batch') {
            var myTree_S = this.finalJSON.treeSection.treeBatchSecurity; //my tree, that I generated from the interface
            this.finalJSON.attributes.security = JSON.parse(JSON.stringify(this.blueprint_attribs_batch_S)); //This creates a new object (not passed by reference!)
        }

        var bAttributes_S = this.finalJSON.attributes.security; //This is where I'll store the attributes in the format of the blueprint

        //Traverse my tree...
        for (var a=0; a < myTree_S.children.length; a++ ){  //NB: FIRST LVL OF DEPTH IN THE TREE
            if(myTree_S.children[a].properties){ //If this node has some properties...
                    for (var c=0; c < myTree_S.children[a].properties.length; c++){ //Here, we're traversing the properties of the children at the 1st lvl of depth in the tree.
                        var property = myTree_S.children[a].properties[c];
                        var mustBeRemoved = myTree_S.children[a].isRemoved;
                        //console.log("Remove: "+ mustBeRemoved + ", attrib_id : " + property.attribute_id + ", property_id :" + property.property_id + ", value: " + property.selectedValue);
                        //Search for this property in the blueprint attributes. Remove it from there if "mustBeRemoved" is true, otherwise update its value.
                        this.searchAndUpdate_attrib(bAttributes_S, mustBeRemoved, property);
                    }

            }
        }


      },

      generateBlueprintAttributes_Privacy: function (){
        if (this.finalJSON.applicationType == 'streaming') {
            var myTree_P = this.finalJSON.treeSection.treeStreamingPrivacy; //my tree, that I generated from the interface
            this.finalJSON.attributes.privacy = JSON.parse(JSON.stringify(this.blueprint_attribs_streaming_P)); //This creates a new object (not passed by reference!)
        }
        else if (this.finalJSON.applicationType == 'batch') {
            var myTree_P = this.finalJSON.treeSection.treeBatchPrivacy; //my tree, that I generated from the interface
            this.finalJSON.attributes.privacy = JSON.parse(JSON.stringify(this.blueprint_attribs_batch_P)); //This creates a new object (not passed by reference!)
        }

        var bAttributes_P = this.finalJSON.attributes.privacy; //This is where I'll store the attributes in the format of the blueprint

        //Traverse my tree...
        for (var a=0; a < myTree_P.children.length; a++ ){  //NB: FIRST LVL OF DEPTH IN THE TREE
            if(myTree_P.children[a].properties){ //If this node has some properties...
                    for (var c=0; c < myTree_P.children[a].properties.length; c++){ //Here, we're traversing the properties of the children at the 1st lvl of depth in the tree.
                        var property = myTree_P.children[a].properties[c];
                        var mustBeRemoved = myTree_P.children[a].isRemoved;
                        //console.log("Remove: "+ mustBeRemoved + ", attrib_id : " + property.attribute_id + ", property_id :" + property.property_id + ", value: " + property.selectedValue);
                        //Search for this property in the blueprint attributes. Remove it from there if "mustBeRemoved" is true, otherwise update its value.
                        this.searchAndUpdate_attrib(bAttributes_P, mustBeRemoved, property);
                    }

            }
        }
      },

      searchAndUpdate_attrib: function (bAttributes, mustBeRemoved, property){
        var attribId = property.attribute_id;
        var property_id = property.property_id;
        var attribValue = property.selectedValue;
        /*This function looks for an attribute (identified by "attribId") among all the blueprint attributes.
        When it finds the attribute: if the attribute must be removed, then it removes it;
        otherwise, when it finds the attribute, it replaces the value of its property instead. */
        for (var k=0; k < bAttributes.length; k++){//Cycle through all the attributes in the blueprint attributes...
            if (bAttributes[k].id == attribId && mustBeRemoved == true){ //If you find the attribute and it must be removed...
              bAttributes.splice(k,1); //...then remove it.
              return;
            }
            else if (bAttributes[k].id == attribId && mustBeRemoved == false){ //Otherwise, if you find the attribute and it doesn't need to be removed...
              for (var prop in bAttributes[k].properties){ //...cycle through all the properties of this attribute...
                  if (prop == property_id) { //...when you find the property whose value needs to be updated...
                    if (property.mustBeConverted == true && (attribValue=='Low' || attribValue=='Medium' || attribValue=='High') ){ //...if necessary, convert its value from Default to Custom (i.e., from Low/Medium/High to an integer)...
                      attribValue = this.convertDefaultValue(attribValue, property.convertedValues);
                    }
                    //...then update the value in the blueprint (NB: the new value can be stored in one of the following fields: minimum, maximum, or value)
                    if (bAttributes[k].properties[prop].minimum) bAttributes[k].properties[prop].minimum = attribValue; //minimum
                    else if (bAttributes[k].properties[prop].maximum) bAttributes[k].properties[prop].maximum = attribValue; //maximum
                    else if (bAttributes[k].properties[prop].value) {                                                        //value
                                                                    if (bAttributes[k].properties[prop].convertToArray){ //This "if" is a temporary fix. It's better to re-implement it. It's currently used to store a string inside an array (that has exactly one string) for Sebastian (necessary for attributes: credentials and allowedGuarantor).
                                                                      bAttributes[k].properties[prop].value[0] = attribValue;
                                                                      delete bAttributes[k].properties[prop].convertToArray;
                                                                    }
                                                                    else
                                                                      bAttributes[k].properties[prop].value = attribValue;
                                                                  }
                    return;
                  }
              }
            }
        }


      },

      convertDefaultValue: function (currentDefaultValue, convertedValues){
        if(currentDefaultValue == 'Low')
          return convertedValues[0];
        else if(currentDefaultValue == 'Medium')
          return convertedValues[1];
        else if(currentDefaultValue == 'High')
          return convertedValues[2];

      }


  }
}
</script>
