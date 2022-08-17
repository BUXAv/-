import Vuex from 'vuex'
import Vue from 'vue'
Vue.use(Vuex)

const actions = {}

const mutations = {
	changeIsPlay(state){
		state.isPlay=!state.isPlay
	},
	HandleIsPlay(state,isPlay){
		state.isPlay=isPlay
	},
	getId(state,id){
		state.id=id
	},
	getUrl(state,url){
		state.url=url
	}
}

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