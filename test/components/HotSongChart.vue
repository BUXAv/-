<template>
	<view class="content" @click="ToMore">
		<view class="Peaktitle">{{musicList.name}}</view>
		<view class="musicDetail" v-for="(item,value) in musicList.list" :key="item.al.id" >
			<text class="musicName">{{value+1}}. {{item.al.name}}</text>
			<text class="author">- {{item.ar[0].name}}</text>
		</view>
		<image :src="musicList.list[0].al.picUrl"></image>
	</view>
</template>

<script>
	import request from '../utils/request.js'
	export default {
		name:"HotSongChart",
		data() {
			return {
				data:[],
				musicList:{},
			};
		},
		async created(){
			let idx=this.idx*1
			let data=await request(`http://localhost:3000/top/list?idx=${idx}`,)
			let list={
			        name:data.playlist.name,
			        list:data.playlist.tracks.slice(0,3)
			      }
			this.musicList=list
		},
		props:{
			idx:{
				type:String
			}
		},
		methods:{
			ToMore(){
				uni.navigateTo({
					url:'/pages/moreSongs/moreSongs?name='+JSON.stringify(this.musicList.name)
				})
			}
		}
	}
</script>

<style scoped>
	.content{
		position: relative;
		height: 240rpx;
		width: 680rpx;
		background-color:#f2f2f2;
		margin: 30rpx 0;
	}
	image{
		display: block;
		width: 240rpx;
		height: 240rpx;
		position: absolute;
		right: 10rpx;
		top: 0;
	}
	.musicDetail{
		display: flex;
		margin: 8rpx 0;
	}
	.musicDetail text{
		font-size: 26rpx;
		max-width: 196rpx;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.Peaktitle{
		padding-top:20rpx;
		font-size: 36rpx;
		margin-bottom: 20rpx;
	}
	.author{
		
		margin-left: 30rpx;
		color: #797979;
	}
</style>