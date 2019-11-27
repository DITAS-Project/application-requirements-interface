import Vue from 'vue'
import App from './App.vue'
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import BootstrapVue from 'bootstrap-vue/dist/bootstrap-vue.esm';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';

Vue.use(BootstrapVue);

Vue.config.productionTip = false

new Vue({
  el: "#app",
  render: h => h(App),
  data: {

    //This global variable is accessible by children by using:  this.$root.$data.globalObject
    globalObject: {
                    applicationType: '',

                    //Section1_first
                    functionalRequirements: { methodTags: [],
                                              vdcTags: []
                                            },

                    attributes: { dataUtility: {}, security: {}, privacy: {} },

                    goalTrees: { dataUtility: {}, security: {}, privacy: {} },

                    //Section1_second
                    methodsOutput: { methods: [ {  method_id: '', attributes: [  ], methodTags: [  ] } ] },



                    //Section3
                    providedResources:  { infrastructures: [ {  name:'', type:'', extra_properties: { owner:'ApplicationDeveloper', ditas_default:'' },
                                                              provider: { api_endpoint:'', credentials: { username:'', password:'', config: '', registries_secret:''}, api_type:'cloudsigma' },
                                                              resources: [] } ]
                                        },


                    //Section2
                    treeSection: {  applicationType: 'batch',

                                    treeBatchDataUtility: {
                                            label: "Data Utility", isRemoved: false,
                                            children: [
                                              {
                                                label: "High QoS", isRemoved: false,
                                                children: [
                                                  { label: "Service Available", isRemoved: false, properties: [ {name:"Availability", attribute_id:"availability", property_id:"availability", selectedValue:90, possibleValues:['Low', 'Medium', 'High'], mustBeConverted: true, convertedValues:[10, 50, 90], customizabilityType: 'Custom', canChangeCustomizabilityType: true, type:"number", formType:"radio", placeholder:"Enter percentage (range: 0-100)" } ] },
                                                  { label: "AND", connectorId:'2', treeId:'B_DU' },
                                                  { label: "Fast Process", isRemoved: false, properties: [ {name:"Response time", attribute_id:"responseTime", property_id:"responseTime", selectedValue:2, possibleValues:['Low', 'Medium', 'High'], mustBeConverted: true, convertedValues:[1, 3, 5], customizabilityType: 'Custom', canChangeCustomizabilityType: true, type:"number", formType:"radio", placeholder:"Enter a non-negative number (seconds)" } ] },
                                                  { label: "AND", connectorId:'2', treeId:'B_DU' },
                                                  { label: "Scalable Service", isRemoved: false,
                                                    children: [
                                                                { label: "Scale Up Memory", isRemoved: false, properties: [ {name:"RAM Gain", attribute_id:"scaleUpMemory", property_id:"ramGain", selectedValue:130, possibleValues:['Low', 'Medium', 'High'], mustBeConverted: true, convertedValues:[110, 150, 200], customizabilityType: 'Custom', canChangeCustomizabilityType: true, type:"number", formType:"radio", placeholder:"Enter percentage (unlimited range)" },
                                                                                                                            {name:"RAM Limit", attribute_id:"scaleUpMemory", property_id:"ramLimit", selectedValue:90, possibleValues:['Low', 'Medium', 'High'], mustBeConverted: true, convertedValues:[10, 50, 90], customizabilityType: 'Custom', canChangeCustomizabilityType: true, type:"number", formType:"radio", placeholder:"Enter percentage (range: 0-100)" }  ] },
                                                                { label: "Scale Up Space", isRemoved: false, properties: [ {name:"Space Gain", attribute_id:"scaleUpSpace", property_id:"spaceGain", selectedValue:110, possibleValues:['Low', 'Medium', 'High'], mustBeConverted: true, convertedValues:[110, 150, 200], customizabilityType: 'Custom', canChangeCustomizabilityType: true, type:"number", formType:"radio", placeholder:"Enter percentage (unlimited range)" },
                                                                                                                           {name:"Space Limit", attribute_id:"scaleUpSpace", property_id:"spaceLimit", selectedValue:95, possibleValues:['Low', 'Medium', 'High'], mustBeConverted: true, convertedValues:[10, 50, 90], customizabilityType: 'Custom', canChangeCustomizabilityType: true, type:"number", formType:"radio", placeholder:"Enter percentage (range: 0-100)" } ] }
                                                    ]
                                                  }
                                                ]
                                              },
                                              { label: "AND", connectorId:'1', treeId:'B_DU' },
                                              { label: "High Data Quality", isRemoved: false,
                                                children: [
                                                  { label: "Fresh Data", isRemoved: false, properties: [ {name:"Timeliness", attribute_id:"timeliness", property_id:"timeliness", selectedValue:"High", possibleValues:['Low', 'Medium', 'High'], mustBeConverted: true, convertedValues:[10, 50, 90], customizabilityType: 'Default', canChangeCustomizabilityType: true, type:"number", formType:"radio", placeholder:"Enter percentage (range: 0-100)" } ] },
                                                  { label: "AND", connectorId:'3', treeId:'B_DU' },
                                                  { label: "Enough Amount Of Data", isRemoved: false, properties: [ {name:"Volume", attribute_id: "volume", property_id:"volume", selectedValue:1200, possibleValues:['Low', 'Medium', 'High'], mustBeConverted: true, convertedValues:[300, 1200, 2000], customizabilityType: 'Custom', canChangeCustomizabilityType: true, type:"number", formType:"radio", placeholder:"Enter a non-negative number" } ] },
                                                  { label: "AND", connectorId:'3', treeId:'B_DU' },
                                                  { label: "History", isRemoved: false, properties: [ {name:"Seconds Recorded", attribute_id: "secondsRecorded", property_id:"secondsRecorded", selectedValue:7776000, possibleValues:[100000, 1000000, 10000000], mustBeConverted: true, convertedValues:[10, 50, 90], customizabilityType: 'Custom', canChangeCustomizabilityType: true, type:"number", formType:"radio", placeholder:"Enter a non-negative number" } ] },
                                                  { label: "AND", connectorId:'3', treeId:'B_DU' },
                                                  { label: "Accuracy", isRemoved: false, properties: [ {name:"Accuracy", attribute_id: "accuracy", property_id:"accuracy", selectedValue:90, possibleValues:['Low', 'Medium', 'High'], mustBeConverted: true, convertedValues:[10, 50, 90], customizabilityType: 'Custom', canChangeCustomizabilityType: true, type:"number", formType:"radio", placeholder:"Enter percentage (range: 0-100)" } ] },
                                                  { label: "AND", connectorId:'3', treeId:'B_DU' },
                                                  { label: "Process Completeness", isRemoved: false, properties: [ {name:"Completeness", attribute_id: "processCompleteness", property_id:"completeness", selectedValue:80, possibleValues:['Low', 'Medium', 'High'], mustBeConverted: true, convertedValues:[10, 50, 90], customizabilityType: 'Custom', canChangeCustomizabilityType: true, type:"number", formType:"radio", placeholder:"Enter percentage (range: 0-100)" } ] }
                                                ]}
                                            ]
                                          },

                                    treeBatchSecurity: {
                                            label: "Security", isRemoved: false,
                                            children: [
                                               { label: "Secure Data Transport", isRemoved: false, properties: [ {name:"Protocol", attribute_id:"encryption", property_id:"protocol", selectedValue:"TLS", possibleValues:['TLS', 'IPSEC', 'SSL', 'SSH', 'OTR'], customizabilityType: 'Default', canChangeCustomizabilityType: true, type:"text", formType:"radio", placeholder:" "  },
                                                                                                                 {name:"Algorithm", attribute_id:"encryption", property_id:"algorithm", selectedValue:['TLS_AES_256_GCM_SHA384'], possibleValues:['TLS_AES_256_GCM_SHA384', 'TLS_AES_128_GCM_SHA256', 'TLS_AES_128_CCM_8_SHA256', 'TLS_AES_128_CCM_SHA256', 'AES'], customizabilityType: 'Default', canChangeCustomizabilityType: false, type:"text", formType:"checkbox", placeholder:" " },
                                                                                                                 {name:"Key Length", attribute_id:"encryption", property_id:"keyLength", selectedValue:128, possibleValues:[128, 256, 512, 1024, 4096], customizabilityType: 'Default', canChangeCustomizabilityType: true, type:"number", formType:"radio", placeholder:" " }  ] },

                                               { label: "AND", connectorId:'1', treeId:'B_S' },
                                               { label: "Secure Access", isRemoved: false, properties: [ {name:"Required", attribute_id:"accessControl", property_id:"required", selectedValue:"true", possibleValues:['true', 'false'], customizabilityType: 'Default', canChangeCustomizabilityType: false, type:"text", formType:"radio", placeholder:" " },
                                                                                                         {name:"Protocol", attribute_id:"accessControl", property_id:"protocol", selectedValue:"username/password", possibleValues:['username/password', 'token-based', 'none'], customizabilityType: 'Default', canChangeCustomizabilityType: false, type:"text", formType:"radio", placeholder:" " },
                                                                                                         {name:"Credentials", attribute_id:"accessControl", property_id:"credentials", selectedValue:"", possibleValues:[' '], customizabilityType: 'Custom', canChangeCustomizabilityType: false, type:"text", formType:"radio", placeholder:"Enter a domain or a public key..." }   ] },

                                               { label: "AND", connectorId:'1', treeId:'B_S' },
                                               { label: "Tracing and Access Monitoring", isRemoved: false, properties: [ {name:"Level", attribute_id:"tracing", property_id:"level", selectedValue:"datasource", possibleValues:['datasource', 'VDC', 'client', 'none'], customizabilityType: 'Default', canChangeCustomizabilityType: true, type:"text", formType:"radio", placeholder:" " },
                                                                                                                         {name:"Sample Rate", attribute_id:"tracing", property_id:"sampleRate", selectedValue:1, possibleValues:['Low', 'Medium', 'High'], mustBeConverted: true, convertedValues:[10, 50, 90], customizabilityType: 'Custom', canChangeCustomizabilityType: true, type:"number", formType:"radio", placeholder:"Enter percentage (range: 0-100)" },
                                                                                                                         {name:"Instrumentation", attribute_id:"tracing", property_id:"instrumentation", selectedValue:"VDC", possibleValues:['VDC', 'client', 'none'], customizabilityType: 'Default', canChangeCustomizabilityType: true, type:"text", formType:"radio", placeholder:" " }   ] },

                                                  ]
                                                },

                                    treeBatchPrivacy: {
                                            label: "Privacy", isRemoved: false,
                                            children: [
                                                { label: "Purpose Control", isRemoved: false, properties: [ {name:"Available Purpose", attribute_id:"purposeControl_research", property_id:"availablePurpose", selectedValue:[], possibleValues:['research', 'medical research', 'nutritional research', 'government', 'commercial', 'non-commercial'], customizabilityType: 'Default', canChangeCustomizabilityType: false, type:"text", formType:"checkbox", placeholder:""  },
                                                                                                            {name:"Allowed Guarantor", attribute_id:"purposeControl_research", property_id:"allowedGuarantor", selectedValue:"", possibleValues:[''], customizabilityType: 'Custom', canChangeCustomizabilityType: false, type:"text", formType:"radio", placeholder:"Enter a public key or a url to a public key." }     ] },

                                                  ]
                                    },

//-----------STEREAMING-----------STEREAMING-----------STEREAMING-----------STEREAMING-----------STEREAMING-----------STEREAMING-----------STEREAMING-----------STEREAMING-----------STEREAMING-----------STEREAMING-----------STEREAMING-----------STEREAMING-----------

                                    treeStreamingDataUtility: {
                                              label: "Data Utility", isRemoved: false,
                                              children: [
                                                 {
                                                  label: "High QoS", isRemoved: false,
                                                  children: [
                                                      { label: "Service Available", isRemoved: false, properties: [ {name:"Availability", attribute_id:"availability", property_id:"availability", selectedValue:95, possibleValues:['Low', 'Medium', 'High'], mustBeConverted: true, convertedValues:[10, 50, 90], customizabilityType: 'Custom', canChangeCustomizabilityType: true, type:"number", formType:"radio", placeholder:"Enter percentage (range: 0-100)" } ] },
                                                      { label: "AND", connectorId:'2', treeId:'S_DU' },
                                                      { label: "Fast Data Streaming", isRemoved: false, properties: [ {name:"Throughput", attribute_id:"throughput", property_id:"throughput", selectedValue:0.5, possibleValues:['Low', 'Medium', 'High'], mustBeConverted: true, convertedValues:[0.2, 1, 5], customizabilityType: 'Custom', canChangeCustomizabilityType: true, type:"number", formType:"radio", placeholder:"Enter a non-negative number (MB/s)" } ] }
                                                            ]
                                                        },
                                                  { label: "AND", connectorId:'1', treeId:'S_DU' },
                                                  { label: "High Data Quality", isRemoved: false,
                                                    children: [
                                                        { label: "Timeliness", isRemoved: false, properties: [ {name:"Timeliness", attribute_id:"timeliness", property_id:"timeliness", selectedValue:65, possibleValues:['Low', 'Medium', 'High'], mustBeConverted: true, convertedValues:[10, 50, 90], customizabilityType: 'Custom', canChangeCustomizabilityType: true, type:"number", formType:"radio", placeholder:"Enter percentage (range: 0-100)" } ] },
                                                        { label: "AND", connectorId:'3', treeId:'S_DU' },
                                                        { label: "Consistency", isRemoved: false, properties: [ {name:"Precision", attribute_id:"precision", property_id:"precision", selectedValue:0.8, possibleValues:['Low', 'Medium', 'High'], mustBeConverted: true, convertedValues:[0.5, 1, 3], customizabilityType: 'Custom', canChangeCustomizabilityType: true, type:"number", formType:"radio", placeholder:"Enter a non-negative number" },
                                                                                                                {name:"Accuracy", attribute_id:"accuracy", property_id:"accuracy", selectedValue:90, possibleValues:['Low', 'Medium', 'High'], mustBeConverted: true, convertedValues:[10, 50, 90], customizabilityType: 'Custom', canChangeCustomizabilityType: true, type:"number", formType:"radio", placeholder:"Enter percentage (range: 0-100)" } ]}
                                                        ]},
                                              ]
                                        },

                                    treeStreamingSecurity: {
                                            label: "Security", isRemoved: false,
                                            children: [
                                                { label: "Secure Data Transport", isRemoved: false, properties: [ {name:"Protocol", attribute_id:"encryption", property_id:"protocol", selectedValue:"TLS", possibleValues:['TLS', 'IPSEC', 'SSL', 'SSH', 'OTR'], customizabilityType: 'Default', canChangeCustomizabilityType: true, type:"text", formType:"radio", placeholder:" "  },
                                                                                                                  {name:"Algorithm", attribute_id:"encryption", property_id:"algorithm", selectedValue:['TLS_AES_256_GCM_SHA384'], possibleValues:['TLS_AES_256_GCM_SHA384', 'TLS_AES_128_GCM_SHA256', 'TLS_AES_128_CCM_8_SHA256', 'TLS_AES_128_CCM_SHA256', 'AES'], customizabilityType: 'Default', canChangeCustomizabilityType: false, type:"text", formType:"checkbox", placeholder:" " },
                                                                                                                  {name:"Key Length", attribute_id:"encryption", property_id:"keyLength", selectedValue:128, possibleValues:[128, 256, 512, 1024, 4096], customizabilityType: 'Default', canChangeCustomizabilityType: true, type:"number", formType:"radio", placeholder:" " }     ] },

                                                { label: "AND", connectorId:'1', treeId:'S_S' },
                                                { label: "Secure Access", isRemoved: false, properties: [ {name:"Required", attribute_id: "accessControl", property_id:"required", selectedValue:"true", possibleValues:['true', 'false'], customizabilityType: 'Default', canChangeCustomizabilityType: false, type:"text", formType:"radio", placeholder:" " },
                                                                                                          {name:"Protocol", attribute_id: "accessControl", property_id:"protocol", selectedValue:"username/password", possibleValues:['username/password', 'token-based', 'none'], customizabilityType: 'Default', canChangeCustomizabilityType: false, type:"text", formType:"radio", placeholder:" " },
                                                                                                          {name:"Credentials", attribute_id: "accessControl", property_id:"credentials", selectedValue:"", possibleValues:[' '], customizabilityType: 'Custom', canChangeCustomizabilityType: false, type:"text", formType:"radio", placeholder:"Enter a domain or a public key." }   ] },

                                                { label: "AND", connectorId:'1', treeId:'S_S' },
                                                { label: "Tracing and Access Monitoring", isRemoved: false, properties: [ {name:"Level", attribute_id: "tracing", property_id:"level", selectedValue:"datasource", possibleValues:['datasource', 'VDC', 'client', 'none'], customizabilityType: 'Default', canChangeCustomizabilityType: true, type:"text", formType:"radio", placeholder:" " },
                                                                                                                          {name:"Sample Rate", attribute_id: "tracing", property_id:"sampleRate", selectedValue:1, possibleValues:['Low', 'Medium', 'High'], mustBeConverted: true, convertedValues:[10, 50, 90], customizabilityType: 'Custom', canChangeCustomizabilityType: true, type:"number", formType:"radio", placeholder:"Enter percentage (range: 0-100)" },
                                                                                                                          {name:"Instrumentation", attribute_id: "tracing", property_id:"instrumentation", selectedValue:"VDC", possibleValues:['VDC', 'client', 'none'], customizabilityType: 'Default', canChangeCustomizabilityType: true, type:"text", formType:"radio", placeholder:" " }   ] }
                                                    ]
                                                  },

                                    treeStreamingPrivacy: {
                                            label: "Privacy", isRemoved: false,
                                            children: [
                                                { label: "Purpose Control", isRemoved: false, properties: [ {name:"Available Purpose", attribute_id:"purposeControl_research", property_id:"availablePurpose", selectedValue:[], possibleValues:['research', 'medical research', 'nutritional research', 'government', 'commercial', 'non-commercial'], customizabilityType: 'Default', canChangeCustomizabilityType: false, type:"text", formType:"checkbox", placeholder:""  },
                                                                                                            {name:"Allowed Guarantor", attribute_id:"purposeControl_research", property_id:"allowedGuarantor", selectedValue:"", possibleValues:[''], customizabilityType: 'Custom', canChangeCustomizabilityType: false, type:"text", formType:"radio", placeholder:"Enter a public key or a url to a public key." }     ] },

                                                  ]
                                    },

                                   },

                  }

  },
})

//a .$mount('#app')
