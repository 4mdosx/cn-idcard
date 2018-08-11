<template>
  <div id="app">
    <Maker @copy="code => activeCode = code" />
    <Parser :code="activeCode" />
  </div>
</template>

<script>
import Maker from '@/components/Maker'
import Parser from '@/components/Parser'

export default {
  name: 'app',
  data () {
    return {
      activeCode: '',
    }
  },
  methods: {
    mmm () {
      alert(1)
    }
  },
  components: {
    Maker, Parser
  }
}
</script>

<style src="@/assets/main.css" />
