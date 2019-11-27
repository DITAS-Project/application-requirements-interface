<template>
  <div class="pl-3 pr-3">

    <!--EACH NODE OF THE TREE HAS ITS OWN CARD. THE BACKGROUND COLOUR AND THE TEXT ALIGNMENT
    DEPEND ON WHETHER THE NODE IS A CONNECTOR (I.E., "AND"/"OR") OR NOT. -->
    <b-card border-variant="info" :align="getAlignment" :bg-variant="getColour" >

    <!--ONLY SHOW A BULLET IF THIS NODE IS NOT A CONNECTOR -->
    <span v-if="!isConnector"> &bull; </span>

    <!--SHOW THE LABEL OF THE NODE. IF THE NODE HAS BEEN REMOVED, CROSS OUT THE TEXT AND DISPLAY A "removed" BADGE -->
    <span :style="isConnector ? 'font-weight: bold;' : '' ">
      <font :color="getTextColour" :style="node.isRemoved ? 'text-decoration: line-through;' : '' ">
         {{ node.label }}
      </font>
      <b-badge v-show=node.isRemoved variant=danger>
         removed
      </b-badge>
      <b-dropdown v-show="isConnector" size="sm" variant="info" lazy>
        <b-dropdown-item-button @click="changeConnectorTo('AND')">AND</b-dropdown-item-button>
        <b-dropdown-item-button @click="changeConnectorTo('OR')">OR</b-dropdown-item-button>
      </b-dropdown>
    </span>

    <!--SHOW A BUTTON TO INSPECT THE CHILDREN OF THIS NODE -->
    <b-button size="sm" v-if="hasChildren && !node.isRemoved" @click="inspectNode"
      :variant=" isOpen ? 'outline-success' : 'success'" class="mb-1">
      {{ isOpen ? 'Collapse' : 'Inspect' }}
    </b-button>


    <!--SHOW A BUTTON TO REMOVE/ADD THIS NODE -->
    <!--The :key attribute is used as a trick to re-render this button, otherwise its tooltip
    would not immediately update, and it would only do so when the next "hover" event occurs. -->
    <b-button size="sm" @click="removeNode(); forceRerender();" style="float: right;"  class="mb-1"
    v-if="!isConnector"
    :key="componentKey"
    v-b-tooltip.hover.right :title="node.isRemoved ? 'Add requirement' : 'Remove requirement'"
    :variant="node.isRemoved ? 'success' : 'danger' ">
      {{ node.isRemoved ? '+' : 'x' }}
    </b-button>


    <!--IF THIS NODE IS A LEAF, SHOW A BUTTON TO INSPECT ITS PROPERTIES -->
    <span v-if="!hasChildren && !isConnector && !node.isRemoved" >
        <b-button @click="inspectAttributes" class="mb-1"
         v-b-toggle.collapse-1 size="sm" :variant="attributesAreOpen ? 'outline-info' : 'info' ">
            {{ attributesAreOpen ? 'Hide' : 'Customize' }}
        </b-button>
        <!--FOR EACH PROPERTY OF THIS NODE... -->
        <div v-for="property in node.properties" v-show="attributesAreOpen">
          <!--...SHOW THE PROPERTY AS AN ITEM OF A LIST.
          EACH ITEM DISPLAYS THE NAME OF THE PROPERTY AND A RADIO INPUT FORM-->
          <div align="left" style="width: 70%;" >
             <b-list-group-item  class="ml-2 " variant="info" >
                <span >{{property.name}}:</span>
                  <!--TOGGLE BUTTON TO DECIDE WHETHER TO USE THE DEFAULT VALUES OR TO SPECIFY CUSTOM ONES-->
                  <!--NB: The button is only shown if "canChangeCustomizabilityType" is true.  -->
                  <b-form-radio-group
                          style="float: right;"
                          v-model="property.customizabilityType"
                          v-if="property.canChangeCustomizabilityType"
                          :options="['Default', 'Custom']"
                          buttons
                          button-variant="outline-info"
                          size="sm">
                  </b-form-radio-group>
                  <!--IF THE USER WANTS TO USE DEFAULT VALUES AND IF formType IS "radio" -> THEN DISPLAY THEM IN A RADIO FORM  -->
                  <b-form-radio-group
                  v-if="property.customizabilityType === 'Default' && property.formType === 'radio'"
                  stacked
                  v-model="property.selectedValue"
                  :options="property.possibleValues">
                  </b-form-radio-group>
                  <!--IF THE USER WANTS TO USE DEFAULT VALUES AND IF formType IS "checkbox" -> THEN DISPLAY THEM IN A CHECKBOX FORM  -->
                  <b-form-checkbox-group
                    v-else-if="property.customizabilityType === 'Default' && property.formType === 'checkbox'"
                    stacked
                    v-model="property.selectedValue"
                    :options="property.possibleValues">
                  </b-form-checkbox-group>
                  <!--OTHERWISE, IF THE USER WANTS TO USE CUSTOM VALUES, AND THE INPUT VALUE IS AN INTEGER -> THEN DISPLAY THE FORM FOR INTEGERS (USING v-model.number)  -->
                  <div v-else-if="property.customizabilityType === 'Custom' && property.type == 'number' ">
                    <!--NB: We're not checking for constraints on the input! (e.g., positive integers, etc) -->
                    <b-form-input class="mt-3" :type="property.type" :placeholder="property.placeholder"
                     v-model.number="property.selectedValue"></b-form-input>
                  </div>
                  <!--OTHERWISE, IF THE USER WANTS TO USE CUSTOM VALUES, AND THE INPUT VALUE IS NOT AN INTEGER -> THEN DISPLAY THE FORM (USING v-model)  -->
                  <div v-else-if="property.customizabilityType === 'Custom' && property.type != 'number' ">
                    <!--NB: We're not checking for constraints on the input! (e.g., positive integers, etc) -->
                    <b-form-input class="mt-3" :type="property.type" :placeholder="property.placeholder"
                     v-model="property.selectedValue"></b-form-input>
                  </div>

            </b-list-group-item>
          </div>

        </div>
    </span>


    <!--THIS COMPONENT CALLS ITSELF RECURSIVELY (PASSING ITS CHILDREN NODES HERE),
     IN ORDER TO TRAVERSE THE TREE RECURSIVELY.-->
    <div v-show="isOpen && !node.isRemoved" v-if="hasChildren">
      <node v-for="child in node.children" :node="child"></node>
    </div>

  </b-card>
  </div>
</template>


<!-- Difference between v-if and v-show: v-if ensures that event listeners and child components
 inside the conditional block are properly destroyed and re-created during toggles.
 So prefer v-show if you need to toggle something very often,
 and prefer v-if if the condition is unlikely to change at runtime.
-->



<script>
export default {
  name: "node",
  props: {
    node: Object
  },
  data() {
    return {
      isOpen: false,
      isConnector: this.node.label=='AND' || this.node.label=='OR' ? true : false,
      attributesAreOpen: false,
      componentKey: false, //This attribute is only used as a trick to re-render a tooltip component.

    }
  },
  computed: {
    hasChildren: function () {
      return this.node.children && this.node.children.length
    },
    getColour: function () {
      if(this.isConnector){
        return 'info';
      }
      return 'light';
    },
    getAlignment: function () {
      if(this.isConnector){
        return 'center';
      }
      return 'left';
    },
    getTextColour: function () {
      if(this.isConnector){
        return 'white';
      }
      return '#2c3e50';
    },

  },
  methods: {
    inspectNode: function () {
      if (this.hasChildren) {
        this.isOpen = !this.isOpen
      }
    },
    removeNode: function () {
      this.node.isRemoved = !this.node.isRemoved
    },
    inspectAttributes: function () {
      this.attributesAreOpen = !this.attributesAreOpen
    },
    forceRerender() {
      //This function is only used as a trick to re-render a tooltip component.
      this.componentKey = !this.componentKey;
    },
    changeConnectorTo(newConnector) {
      /*When the user changes a connector from OR to AND (or from AND to OR) on the interface,
        this function changes the value of that connector and the value of all the connectors
        with the same connectorId (because those connectors must either be all ORs or all ANDs). */

      if(newConnector != this.node.label){ //Only apply the changes if the new value of the connector is different from its current value.

        //If the connector belongs to the Batch Data Utility tree...
        if(this.node.treeId=='B_DU'){
          var tree = this.$root.$data.globalObject.treeSection.treeBatchDataUtility; //Batch Data Utility tree
          for (var k=0; k < tree.children.length; k++){ //Traverse the children in the first level of the tree.
            if (tree.children[k].connectorId && tree.children[k].connectorId == this.node.connectorId){
              tree.children[k].label=newConnector;
            }
            if (tree.children[k].children) {
              for (var s=0; s < tree.children[k].children.length; s++){ //Traverse the children in the second level of the tree.
                if (tree.children[k].children[s].connectorId && tree.children[k].children[s].connectorId == this.node.connectorId){
                  tree.children[k].children[s].label=newConnector;
                }
              }
            }
          }
        }
        //If the connector belongs to the Batch Security tree...
        else if(this.node.treeId=='B_S'){
          var tree = this.$root.$data.globalObject.treeSection.treeBatchSecurity; //Batch Security tree...
          for (var k=0; k < tree.children.length; k++){ //Traverse the children in the first level of the tree.
            if (tree.children[k].connectorId){
              tree.children[k].label=newConnector;
            }
          }
        }
        //If the connector belongs to the Streaming Data Utility tree...
        else if(this.node.treeId=='S_DU'){
          var tree = this.$root.$data.globalObject.treeSection.treeStreamingDataUtility; //Streaming Data Utility
          for (var k=0; k < tree.children.length; k++){ //Traverse the children in the first level of the tree.
            if (tree.children[k].connectorId && tree.children[k].connectorId == this.node.connectorId){
              tree.children[k].label=newConnector;
            }
            if (tree.children[k].children) {
              for (var s=0; s < tree.children[k].children.length; s++){ //Traverse the children in the second level of the tree.
                if (tree.children[k].children[s].connectorId && tree.children[k].children[s].connectorId == this.node.connectorId){
                  tree.children[k].children[s].label=newConnector;
                }
              }
            }
          }
        }
        //If the connector belongs to the Streaming Security tree...
        else if(this.node.treeId=='S_S'){
          var tree = this.$root.$data.globalObject.treeSection.treeStreamingSecurity; //Streaming Security
          for (var k=0; k < tree.children.length; k++){ //Traverse the children in the first level of the tree.
            if (tree.children[k].connectorId){
              tree.children[k].label=newConnector;
            }
          }
        }

      }
    }

  }
}
</script>
