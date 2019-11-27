<template>
  <div>

    <b-container style="width: 60%;">

        <!-- THIS IS A RADIO INPUT FORM -->
        <b-row class="ml-3 mb-3">Select an application type:&nbsp;
          <b-form-radio-group
          v-model="globalObjectSection2.applicationType"
          :options="['batch', 'streaming']">
          </b-form-radio-group>
        </b-row>


        <!-- THIS HEADING IS SHOWN IF AN APPLICATION TYPE HAS BEEN SELECTED -->
        <h3 v-if="globalObjectSection2.applicationType">Suggested requirements:</h3>

        <!-- DEPENDING ON THE SELECTED applicationType, THE APPROPRIATE DataUtility TREE
        (EITHER STREAMING OR BATCH) IS PASSED TO THIS COMPONENT.
        THE ROOT OF THE TREE IS PASSED HERE, AND THEN THE WHOLE TREE IS TRAVERSED RECURSIVELY.-->
        <TreeNode
        class="mb-3"
        v-if="globalObjectSection2.applicationType"
        :node="globalObjectSection2.applicationType=='batch' ? globalObjectSection2.treeBatchDataUtility : globalObjectSection2.treeStreamingDataUtility ">
        </TreeNode>

        <!-- DEPENDING ON THE SELECTED applicationType, THE APPROPRIATE Security TREE (STREAMING
        OR BATCH) IS PASSED TO THIS COMPONENT.
        THE ROOT OF THE TREE IS PASSED HERE, AND THEN THE WHOLE TREE IS TRAVERSED RECURSIVELY.-->
        <TreeNode
        class="mb-3"
        v-if="globalObjectSection2.applicationType"
        :node="globalObjectSection2.applicationType=='batch' ? globalObjectSection2.treeBatchSecurity : globalObjectSection2.treeStreamingSecurity ">
        </TreeNode>

        <!-- DEPENDING ON THE SELECTED applicationType, THE APPROPRIATE Privacy TREE (STREAMING
        OR BATCH) IS PASSED TO THIS COMPONENT.
        THE ROOT OF THE TREE IS PASSED HERE, AND THEN THE WHOLE TREE IS TRAVERSED RECURSIVELY.-->
        <TreeNode
        class="mb-3"
        v-if="globalObjectSection2.applicationType"
        :node="globalObjectSection2.applicationType=='batch' ? globalObjectSection2.treeBatchPrivacy : globalObjectSection2.treeStreamingPrivacy ">
        </TreeNode>

        <!-- THIS IS HOW TO PASS A SPECIFIC TREE WITHOUT ANY CONDITIONS:
         <TreeNode :node="treeBatchDataUtility"></TreeNode>
                                                                      -->

    </b-container>

  </div>
</template>




<script>
import TreeNode from "./TreeNode"

export default {
  components: {
    TreeNode
  },

  props: {
    globalObjectSection2: Object
  },

  data() {
    return {
      applicationType: '',

        }
      }

}
</script>
