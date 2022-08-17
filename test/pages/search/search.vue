<template>
	<view>
		<view class="searchInput">
			<text class="iconfont icon-sousuo"></text>
			<input type="text" placeholder-class="placeholder" @input="getValue(value)" @click="clickEvent" v-model="value" placeholder="搜索 音乐/视频/歌手/歌单/电台">
			<text class="X" v-if="isClick" @click="clearSearch">×</text>
			<text class="cancel" v-if="isClick" @click="clearSearch" >取消</text>
		</view>
		<view class="SearchContext" v-if="value.length">
			<view class="keywords">搜索“{{value}}”</view>
			<view class="searchItem" v-for="SearchData in searchList" :key="SearchData.id">
				<text class="iconfont icon-sousuo"></text>
				<text class="musicName">{{SearchData.name}}</text>
			</view>
		</view>
		<view class="hotSearch" v-if="!isClick">
			<view class="title">热门搜索</view>
			<view class="content">
				<view class="label" v-for="(item,index) in hot" :key="item.id" >
					<text :class="'N'+index">{{item.first}}</text>
				</view>
			</view>
			
		</view>
	</view>

</template>

<script>
	import request from '../../utils/request.js'
	export default {
		data() {
			return {
				hot:[],
				value:'',
				searchList:[],
				isClick:false
			}
		},
		async created(){
			let hot=await request("http://localhost:4000/search/hot")
			this.hot=hot.result.hots
		},
		methods:{
			clickEvent(){
				this.isClick=true
			},
			clearSearch(){
				this.isClick=false
				this.searchList=[]
				this.value=''
			},
			async getKeyword(value){
				let keyword=await request(`http://localhost:4000/search?keywords=${value}`)
				console.log(keyword)
				this.searchList=keyword.result.songs.slice(0,10)
			},
			getValue(value){
				clearTimeout(this.timer)
				if(!value){
					this.searchList=[]
				}else{
					this.timer=setTimeout(()=>{
						this.getKeyword(value)
					},500)
				}			
				
			}		
		}
	}
</script>

<style>
	.searchInput{
		margin: 20rpx;
		position: relative;
		display: flex;
		padding: 0 30rpx;
	}
	.searchInput input{
		flex: 1;
		background-color: #ffffff;
		padding: 0 50rpx;
		border-radius: 40rpx;
		height: 70rpx;
		line-height: 70rpx;
		font-size: 30rpx;
	}
	
	.placeholder{
		color: #b3b3b3;
	}
	 .searchInput .icon-sousuo{
		position: absolute;
		left: 36rpx;
		font-size: 36rpx;
		height: 70rpx;
		line-height: 70rpx;
		top:0;
		bottom: 0;
		margin: auto 0;
		color: #b3b3b3;
	}
	.title{
		margin-left: 40rpx;
		margin-top: 50rpx;
		font-size: 40rpx;
		font-weight: 1000;
	}
	.content{
		display: flex;
		flex-wrap: wrap;
		margin-left: 50rpx;
	}
	.label{
		padding: 0 20rpx;
		height: 60rpx;
		font-size: 30rpx;
		border-radius: 30rpx;
		line-height: 60rpx;
		background-color: #ffffff;
		margin-right: 20rpx;
		margin-top: 20rpx;
	}
	.N0{
		color: #22d59c;
	}
	.X{
		color: #cfcfcf;
		position: absolute;
		right: 100rpx;
		width: 60rpx;
		top: 0;
		bottom: 0;
		margin: auto 0;
		height: 70rpx;
		line-height: 70rpx;
		font-size: 46rpx;
		z-index: 10;
	}
	.cancel{
		height: 70rpx;
		line-height: 70rpx;
		padding-left: 10rpx;
	}
	.SearchContext{
		margin-top: 40rpx;
		margin-left: 30rpx;
	}
	.keywords{
		color: #22d59c;
		font-size: 40rpx;
		font-weight: 1000;
	}
	.searchItem{
		margin-top: 50rpx;
		display: flex;
	}
	.searchItem .iconfont{
		margin-right: 30rpx;
		height: 50rpx;
		line-height: 50rpx;
	}
	.searchItem .musicName{
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		max-width: 600rpx;
		height: 50rpx;
		line-height: 50rpx;
	}
</style>
