<template>
	<block>
		<view class="content">
			<view class="playListItem" v-for="item in musicData" :key="item.id" :id="item.id" @click="ToPlayListDetail($event)" >
				<image :src="item.coverImgUrl"></image>
				<text class="itemName">{{item.name}}</text>
				<text class="playCount">▶ {{item.playCount}}万</text>
			</view>
		</view>
	</block>
</template>

<script>
	import request from '../../utils/request.js'
	export default{
		data(){
			return({
				name:'',
				musicData:[]
			})
		},
		onLoad(option){
			let name=JSON.parse(option.name)
			this.name=name
			this.getData(name)		
		},
		methods:{
			async getData(name){
				if(name==="hot"){
					let data=await request("http://localhost:4000/top/playlist")
					this.musicData=data.playlists.slice(8,data.playlists.length)
					this.musicData.map(item => {
						item.playCount = (item.playCount / 10000).toFixed(1)
					})
				}else{
					let data=await request("http://localhost:4000/top/playlist/highquality")
					this.musicData=data.playlists.slice(8,data.playlists.length)
					this.musicData.map(item => {
						item.playCount = (item.playCount / 10000).toFixed(1)
					})
				}
			},
			ToPlayListDetail(e){
				uni.navigateTo({
					url:'/pages/playListDetail/playListDetail?id='+JSON.stringify(e.currentTarget.id)
				})
			}
		}
	}
</script>

<style>
	.content{
		padding: 10rpx 20rpx;
		display: flex;
		flex-wrap: wrap;
	}
	.playListItem{
		position: relative;
		width:50%;
		height: 390rpx;
		display: flex;
		flex-direction: column;
		font-size: 27rpx;
	}
	.playListItem image{
		width: 340rpx;
		height: 340rpx;
		border-radius: 20rpx;
	}
	.playListItem text{
		max-width: 330rpx;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}
	.playListItem .playCount{
		position: absolute;
		left: 190rpx;
		top:278rpx;
		border-radius: 20rpx;
		color: white;
		width: 150rpx;
		height: 40rpx;
		background-color: rgba(56, 47, 41, 0.6);
		text-align: center;
		line-height: 40rpx;
		font-size: 24rpx;
	}
	.playListItem .itemName{
		margin: 20rpx 0;
	}
</style>