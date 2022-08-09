<template>
	<scroll-view class="scroll" enable-flex=true scroll-x=true>
		<view class="scrollItem" v-for="SongMenu in musicMenu" :id="SongMenu.id" :key="SongMenu.id" @click="ToPlayListDetail($event)" >
			<image :src="SongMenu.coverImgUrl"></image>
			<text class="SongMenuName">{{SongMenu.name}}</text>
			<text class="playCount" >▶ {{SongMenu.playCount}}万</text>
		</view>
	</scroll-view>
</template>

<script>
	export default{
		name:"musicSongMenu",
		data(){
			return{
			}
		},
		props:{
			musicMenu:{
				type:Array
			}
		},
		methods:{
			ToPlayListDetail(e){
				uni.navigateTo({
					url:'/pages/playListDetail/playListDetail?id='+JSON.stringify(e.currentTarget.id)
				})
			}
		}
	}
</script>

<style scoped>
	.scroll{
		height: 350rpx;
		display: flex;
	}
	
	.scrollItem{
		position: relative;
		display: flex;
		flex-direction: column;
		margin-right: 20rpx;
		margin-top: 25rpx;
	}
	.scrollItem image{
		width: 244rpx;
		height: 244rpx;
		border-radius: 20rpx;
	}
	.SongMenuName{
		width: 244rpx;
		height: 80rpx;
		display: -webkit-box;
		-webkit-box-orient: vertical;/* 设置对齐方式 */
		-webkit-line-clamp:2 ;
		overflow: hidden;
		font-size: 28rpx;
		text-overflow: ellipsis;
	}
	.playCount{
		position: absolute;
		font-size: 19rpx;
		color: white;
		width: 130rpx;
		height: 30rpx;
		background-color:#424242;
		line-height: 30rpx;
		text-align: center;
		border-radius: 10rpx;
		right: 0;
		top:214rpx
	}
</style>