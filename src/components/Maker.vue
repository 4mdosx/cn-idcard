<template>
  <div class="idCode-maker">
    <mu-paper class="form-container" :z-depth="1">
      <mu-form :model="form" class="mu-demo-form" label-width="100">
        <mu-row gutter>
          <mu-col span="12" lg="4" sm="6">
            <mu-select label="-- 省 --" v-model="form.prov" full-width filterable>
              <mu-option v-for="prov in provOpt" :key="prov.value" :label="prov.label" :value="prov.value">
                {{prov.label}}
              </mu-option>
            </mu-select>
          </mu-col>
          <mu-col span="12" lg="4" sm="6">
            <mu-select label="-- 市 --" v-model="form.city" full-width filterable>
              <mu-option v-for="prov in cityOpt" :key="prov.value" :label="prov.label" :value="prov.value">
                {{prov.label}}
              </mu-option>
            </mu-select>
          </mu-col>
          <mu-col span="12" lg="4" sm="6">
            <mu-select label="-- 区/县 --" v-model="form.district" full-width filterable>
              <mu-option v-for="prov in districtOpt" :key="prov.value" :label="prov.label" :value="prov.value">
                {{prov.label}}
              </mu-option>
            </mu-select>
          </mu-col>
        </mu-row>
        <mu-row>
          <mu-col span="12" lg="6">
            <mu-date-input 
              icon="today" 
              landscape 
              v-model="form.birthdate"
              label="出生日期" 
              type="date" label-float full-width
            >
            </mu-date-input>
          </mu-col>
          <mu-col span="12" lg="6">
            <label for="" class="text-left">性别</label>
            <mu-flex
              class="select-control-row"
              :fill="true"
              style="height: 50px; padding-left: 30px"
              justify-content="start"
              align-items="center"
            >
              <mu-radio :value="1" v-model="form.gender" label="男" style="margin-right: 15px"></mu-radio>
              <mu-radio :value="0" v-model="form.gender" label="女"></mu-radio>
            </mu-flex>
          </mu-col>
        </mu-row>
        <mu-row>
          <mu-col span="12" lg="2">
            <label for="">生成数量</label>
          </mu-col>
          <mu-col span="12" lg="8">
            <mu-slider class="demo-slider" :min="1" :max="20" :step="1" v-model="form.amount"></mu-slider>
          </mu-col>
          <mu-col span="12" lg="2" style="text-align: center">
            <p class="amount-show">{{form.amount}}</p>
          </mu-col>
        </mu-row>
        <mu-flex justify-content="end">
          <mu-button color="secondary" class="mgr-10" disabled>保存为 <span class="normal-case">Schema</span></mu-button>
          <mu-button color="primary" @click="make">生成器，启动 ！</mu-button>
        </mu-flex>
      </mu-form>
    </mu-paper>
    <mu-paper :z-depth="1" style="margin-top: 15px" v-if="store.length || result.length">
      <mu-list @change="copy">
        <mu-list-item button v-for="idCode in store" :key="idCode" :value="idCode">
          <mu-list-item-title>{{idCode}}</mu-list-item-title>
          <mu-list-item-action>
            <mu-button @click="pin(idCode)">
              <mu-icon value="inbox" :class="{active: store.includes(idCode)}" />
            </mu-button>
          </mu-list-item-action>
        </mu-list-item>
        <mu-list-item button :ripple="false" v-for="idCode in result" :key="idCode" :value="idCode">
          <mu-list-item-title>{{idCode}}</mu-list-item-title>
          <mu-list-item-action>
            <mu-button @click="pin(idCode)">
              <mu-icon value="inbox" :class="{active: store.includes(idCode)}" />
            </mu-button>
          </mu-list-item-action>
        </mu-list-item>
      </mu-list>
    </mu-paper>
  </div>
</template>

<script>
import Toast from 'muse-ui-toast'
import region from '@/assets/region'
import idCodeUtils from '@/assets/idCodeUtils'

function mapToArr (map) {
  if (!map) return []
  return Object.entries(map).map(([key, val]) => ({label: val, value: key}))
}

function padZero (val, length = 2) {
  return String(val).padStart(length, '0')
}

function cnDateFormat (dateStr) {
  const date = new Date(dateStr)
  return `${date.getFullYear()}-${padZero(date.getMonth() + 1)}-${padZero(date.getDate())}`;
}

export default {
  data () {
    return {
      provOpt: mapToArr(region.prov),
      form: {
        prov: '110000',
        city: '110100',
        district: '110101',
        birthdate: '1980-01-01',
        gender: 1,
        amount: 5
      },
      store: [],
      result: []
    }
  },
  computed: {
    cityOpt () {
      return mapToArr(region[this.form.prov])
    },
    districtOpt () {
      return mapToArr(region[this.form.city])
    }
  },
  methods: {
    copy (idCode) {
      navigator.clipboard.writeText(idCode)
      .then(() => {
        Toast.info(`已复制 ${idCode} 到剪切板`)
      })
      .catch(err => {
        // This can happen if the user denies clipboard permissions:
        // 如果用户没有授权，则抛出异常
        alert('复制异常:' + err.message)
      })
      this.$emit('copy', idCode)
    },
    pin (idCode) {
      if (this.store.includes(idCode)) {
        this.result.push(idCode)
        this.store = this.store.filter(code => code !== idCode)
      } else {
        this.store.push(idCode)
        this.result = this.result.filter(code => code !== idCode)
      }
      window.localStorage.setItem('store', JSON.stringify(this.store))
    },
    make () {
      const opt = {
        ...this.form,
        regionCode: this.form.district,
        birthdate: cnDateFormat(this.form.birthdate)
      }
      this.result = idCodeUtils.generate(opt)
    }
  },
  mounted () {
    let stored = []
    try {
      stored = JSON.parse(window.localStorage.getItem('store')) || []
    } catch (error) {
      console.warn(error)
      window.localStorage.clear()
    }
    this.store = stored
  }
}
</script>

<style scoped>
.idCode-maker{
  width: 700px;
  margin: 0 auto;
}
.form-container{
  padding: 15px;
}
.amount-show{
  margin: 0;
}
.form-container .col{
  text-align: left;
}
.active{
  color: #ff4081;
}
</style>
