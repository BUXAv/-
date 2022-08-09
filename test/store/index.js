import Vuex from 'vuex'
import Vue from 'vue'
Vue.use(Vuex)

const actions = {}

const mutations = {}

const getters={}

const state = {
	isPlay:false,
	id:'',
	url:''
}

const store = new Vuex.Store({
    actions,
    mutations,
    state,
	getters
})

export default store