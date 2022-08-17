<template>
	<block>
		<view class="title">{{name}}</view>
		<view class="content">
			<view class="musicItem" @click="addClass($event)" :id="item.id" :style="xid==item.id?'color: #22d59c;':''"
				v-for="(item,index) in musicData" :key="item.id" >
				<view class="index">{{index+1}}</view>
				<view class="musicDetail">
					<text class="musicName">{{item.name}}</text>
					<text :class="'author'+ item.id"
						:style="xid==item.id?'color: #22d59c;font-size: 24rpx;':'font-size: 24rpx;color: #8a8a8a;'">{{item.ar?item.ar[0].name:item.artists[0].name}}</text>
				</view>
				<image :src="item.al?item.al.picUrl:item.album.picUrl"></image>
			</view>
		</view>
	</block>
</template>

<script>
	import Pubsub from 'pubsub-js'
	import request from '../../utils/request.js'
	export default {
		data() {
			return ({
				name: '',
				musicData: [],
				xid: '',
				index: 0
			})
		},
		onLoad(option) {
			this.name = JSON.parse(option.name)
			this.getMoreData()
			Pubsub.subscribe("switchMusic", (msg, type) => {
				let musicData=this.musicData
				let index=this.index
				if (type === "pre") {
					if (index == 0) {
						index = musicData.length - 1
					} else {
						index -= 1
					}
				} else {
					if (index == musicData.length - 1) {
						index = 0
					} else {
						index += 1
					}
				}
				this.index=index
				let musicId = musicData[index].id
				this.xid=this.musicData[index].id
				Pubsub.publish("MusicId", musicId)
			})
		},
		methods: {
			async getMoreData() {
				if (this.name === '歌曲推荐') {
					let data = await request("http://localhost:3000/recommend/songs")
					this.musicData = data.recommend
				} else if (this.name === "新歌榜") {
					let data = await request("http://localhost:3000/top/list?idx=0")
					this.musicData = data.playlist.tracks
				} else if (this.name === "热歌榜") {
					let data = await request("http://localhost:3000/top/list?idx=1")
					this.musicData = data.playlist.tracks
				} else if (this.name === "原创榜") {
					let data = await request("http://localhost:3000/top/list?idx=2")
					this.musicData = data.playlist.tracks
				}
				this.xid = this.musicData[0].id
			},
			addClass(e) {
				this.xid = e.currentTarget.id
				uni.navigateTo({
					url:'/pages/musicDetail/musicDetail?name="列表"&musicId='+JSON.stringify(e.currentTarget.id)
				})
			},
		}
	}
</script>

<style>
	.title {
		font-size: 40rpx;
		margin: 20rpx 30rpx;
		font-weight: 1000;
	}

	.musicItem {
		position: relative;
		margin: 40rpx 30rpx;
		display: flex;
		height: 100rpx;
	}

	.index {
		height: 80rpx;
		line-height: 80rpx;
		margin-right: 40rpx;
	}

	.musicDetail {
		display: flex;
		flex-direction: column;
		height: 100rpx;
	}

	.musicDetail text {
		height: 38rpx;
		line-height: 35rpx;
		margin-bottom: 10rpx;
		max-width: 450rpx;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}

	image {
		width: 90rpx;
		height: 90rpx;
		position: absolute;
		right: 20rpx;
		border-radius: 10rpx;
	}
</style>
