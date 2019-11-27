<template>
  <div class="container">

    <b-row>

        <!--FIRST COLUMN-->
        <b-col>
        <!--A SINGLE CARD FOR ALL THE vdcTags-->
        <b-card border-variant="info" bg-variant="light"
        header-bg-variant="info" header-text-variant="light">
        <!--HEADER OF THE CARD-->
        <h4 slot="header">vdcTags:</h4>
        <!--CREATE A LOOP INSIDE THE CARD, FOR EACH vdcTag IN THE LIST-->
        <div v-for="(vdcTag, index) in globalObject.functionalRequirements.vdcTags">

            <!--INPUT FORM AND REMOVE BUTTON-->
            <b-input-group class="mb-1">
              <b-form-input type="text" placeholder="Enter a tag"
               v-model="globalObject.functionalRequirements.vdcTags[index]"></b-form-input>
              <b-input-group-append>
                <b-button variant="danger" v-on:click="removeVdcTag(index)"
                v-b-tooltip.hover.right="'Remove tag'">x</b-button>
              </b-input-group-append>
            </b-input-group>

        </div>
        <!--BUTTON TO CREATE A NEW TAG-->
        <b-button class="mt-3" variant="success" v-on:click="addVdcTag">Add new vdcTag</b-button>
        </b-card>
        </b-col>



        <!--SECOND COLUMN-->
        <b-col cols="8">
        <!--FOR EACH method IN THE LIST...-->
        <div v-for="(method, index) in globalObject.methodsOutput.methods">
            <!--...CREATE A CARD WITH A HEADER -->
            <b-card class="mb-2" border-variant="info" bg-variant="light"
            header-bg-variant="info" header-text-variant="light">
            <!--HEADER OF THE CARD (WHICH SHOWS THE INDEX OF THE METHOD AND A REMOVE BUTTON)-->
            <h5 slot="header">Method {{index + 1}}
                <b-button size="sm" style="float: right;" variant="danger" v-on:click="removeMethod(index)"
                  v-b-tooltip.hover.top="'Remove method'">x
                </b-button>
            </h5>

            <!--INPUT FORM FOR THE method_id OF THIS METHOD -->
            <b-input-group prepend="Method name:" class="mb-3" >
              <b-form-input type="text"
                v-model="globalObject.methodsOutput.methods[index].method_id">
              </b-form-input>
            </b-input-group>

            <!--FOR EACH ATTRIBUTE OF THIS METHOD... -->
            <div v-for="(attribute, index) in method.attributes">
              <b-input-group prepend="Attribute name:">
                  <!--INPUT FORM FOR THE NAME OF THIS ATTRIBUTE -->
                  <b-form-input type="text"
                     v-model="method.attributes[index]">
                 </b-form-input>
                 <!--BUTTON TO REMOVE THIS ATTRIBUTE -->
                 <b-input-group-append>
                     <b-button variant="danger" v-on:click="removeAttribute(method,index)"
                        v-b-tooltip.hover.right="'Remove attribute'">x
                     </b-button>
                 </b-input-group-append>
              </b-input-group>
            </div>
            <!--BUTTON TO CREATE A NEW ATTRIBUTE FOR THIS METHOD -->
            <b-button class="mt-2 mb-2" variant="success" v-on:click="addAttribute(method)">Add new attribute</b-button>

            <div>
            <!--FOR EACH methodTag OF THIS METHOD... -->
            <div v-for="(methodTag, index) in method.methodTags">
                <b-input-group prepend="Method tag:">
                <!--INPUT FORM AND REMOVE BUTTON-->
                  <b-form-input type="text"
                    v-model="method.methodTags[index]">
                  </b-form-input>
                  <!--BUTTON TO REMOVE THIS methodTag -->
                  <b-input-group-append>
                    <b-button variant="danger" v-on:click="removeMethodTag(method,index)"
                      v-b-tooltip.hover.right="'Remove tag'">x
                    </b-button>
                  </b-input-group-append>
                </b-input-group>
            </div>
            <!--BUTTON TO CREATE A NEW methodTag-->
            <b-button class="mt-2 mb-2" variant="success" v-on:click="addMethodTag(method)">Add new methodTag</b-button>
            </div>

        </b-card>
      </div>

      <!--BUTTON TO CREATE A NEW METHOD-->
      <b-button class="mt-2" variant="success" v-on:click="addMethod">Add new method</b-button>

      </b-col>

    </b-row>

  </div>
</template>





<script>

export default {
  name: 'FirstTab',
  props: {
    globalObject: Object
  },
 methods: {

   addVdcTag: function() {
        this.globalObject.functionalRequirements.vdcTags.push( '' )
       },
   removeVdcTag: function(index) {
        this.globalObject.functionalRequirements.vdcTags.splice(index, 1);
       },

    addMethod: function() {
        this.globalObject.methodsOutput.methods.push( { method_id: '', attributes: [  ], methodTags: [  ] } ); //If it is necessary to have at least one element in the array, simply use [ '' ]
        },
    removeMethod: function(index) {
        this.globalObject.methodsOutput.methods.splice(index, 1);
        },
    addAttribute: function(method) {
        method.attributes.push( '' );
        },
    removeAttribute: function(method, index) {
        method.attributes.splice(index,1);
        },

    addMethodTag: function(method) {
        method.methodTags.push( '' )
        },
     removeMethodTag: function(method, index) {
        method.methodTags.splice(index, 1);
        },

 }
}
</script>
