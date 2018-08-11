<template>
  <div class="parser">
    <mu-paper>
      <mu-text-field v-model="input" label="身份证验证" />
    </mu-paper>
    <mu-card class="pd-15 result">
      <mu-card-title title="解析结果"></mu-card-title>
      <mu-card-text>
        {{result.prov}}
        {{result.city}}
        {{result.district}}
        {{result.gender}}
        <br>
        {{result.birthdate}}
      </mu-card-text>
    </mu-card>
  </div>
</template>

<script>
import idCodeUtils from '@/assets/idCodeUtils'

export default {
  data () {
    return { 
      input: '',
      result: {}
    }
  },
  props: ['code'],
  watch: {
    code (code) {
      this.input = code
    },
    input (val) {
      if (val.length === 18) {
        this.result = idCodeUtils.parse(val) || {}
      } else {
        this.result = {}
      }
    }
  }
}
</script>

<style scoped>
.parser{
  width: 330px;
  position: fixed;
  right: 0;
  top: 0;
}
.result{
  text-align: left;
}
</style>
