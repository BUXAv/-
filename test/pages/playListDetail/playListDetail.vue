<template>
	<block>
		<view class="header">
			<image class="background" :src="data.coverImgUrl"></image>
			<view class="titleCover">
				<image class="cover" :src="data.coverImgUrl"></image>
				<view class="introduction">
					<text class="ListName">{{data.name}}</text>
					<view class="authorDetail">
						<image class="authorPic" :src="data.creator.avatarUrl"></image>
						<text class="author">{{data.creator.nickname}}</text>
					</view>
					<view class="showDetail" @click="showDetail">
						<text class="description">简介：{{data.description}}</text>
						<text class="more">></text>
					</view>
				</view>
			</view>
			<view class="like">
				<view>
					<text class="heart iconfont icon-dianzan"></text>
					<text>{{data.subscribedCount}}</text>
				</view>
				<button open-type="share">
					<text class="heart iconfont icon-fenxiang"></text>
					<text>{{data.shareCount}}</text>
				</button>
			</view>
		</view>
		<view class="content">
			<view class="musicItem" @click="addClass($event,item.id)" :id="item.name"
				:style="xid==item.name?'color: #22d59c;':''" v-for="(item,index) in musicData" :key="item.name">
				<view class="index">{{index+1}}</view>
				<view class="musicDetail">
					<text class="musicName">{{item.al.name}}</text>
					<text :class="'author'+ item.name"
						:style="xid==item.name?'color: #22d59c;font-size: 24rpx;':'font-size: 24rpx;color: #8a8a8a;'">{{item.ar[0].name}}</text>
				</view>
				<image :src="item.al.picUrl"></image>
			</view>
		</view>
	</block>
</template>

<script>
	import request from '../../utils/request.js'
	import Pubsub from 'pubsub-js'
	export default {
		data() {
			return ({
				data: {},
				musicData: [],
				xid: '',
				index:0
			})
		},
		onLoad(option) {
			let id = JSON.parse(option.id)
			this.getData(id)
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
				this.xid=this.musicData[index].name
				Pubsub.publish("MusicId", musicId)
			})
			console.log(2)
		},
		methods: {
			async getData(id) {
				let data = await request(`http://localhost:4000/playlist/detail?id=${id}`)
				this.data = data.playlist
				this.musicData = data.playlist.tracks
				this.xid = data.playlist.tracks[0].name
			},
			showDetail() {
				uni.showModal({
					title: '简介',
					content: this.data.description,
					showCancel: false,
					confirmText: '我知道了'
				})
			},
			addClass(e,id) {
				this.xid = e.currentTarget.id
				uni.navigateTo({
					url:'/pages/musicDetail/musicDetail?name="列表"&musicId='+JSON.stringify(id)
				})
			}

		},
		onShareAppMessage(res) {
			if (res.from === 'button') {
				return {
					title: '听我想听',
					path: '/pages/playListDetail/playListDetail',
				}
			}
		}
	}
</script>

<style>
	.header {
		height: 460rpx;
		overflow: hidden;
	}

	.header .background {
		position: relative;
		width: 100%;
		height: 800rpx;
		opacity: 0.75;
		filter: brightness(0.4)
	}

	.titleCover {
		position: absolute;
		z-index: 10;
		top: 100rpx;
		left: 70rpx;
		height: 250rpx;
		width: 600rpx;
		display: flex;
	}

	.titleCover .cover {
		border-radius: 20rpx;
		width: 240rpx;
		height: 240rpx;
	}

	.introduction {
		position: relative;
		display: flex;
		flex-direction: column;
		width: 400rpx;
		color: #ffffff;
		padding-left: 30rpx;
	}

	.introduction .ListName {
		font-size: 34rpx;
		width: 360rpx;
		height: 90rpx;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		/* 设置对齐方式 */
		-webkit-line-clamp: 2;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.introduction .authorPic {
		height: 50rpx;
		width: 50rpx;
		border-radius: 50%;
	}

	.introduction text {
		margin-bottom: 20rpx;
	}

	.authorDetail {
		display: flex;
		align-items: center;
		margin-bottom: 20rpx;
		font-size: 26rpx;
		height: 60rpx;
	}

	.introduction .author {
		height: 50rpx;
		line-height: 50rpx;
		margin-bottom: 0;
		margin-left: 10rpx;
	}

	.showDetail {
		display: flex;
	}

	.showDetail .description {
		max-width: 320rpx;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		height: 40rpx;
		font-size: 26rpx;
	}

	.like {
		display: flex;
		position: absolute;
		z-index: 10;
		top: 380rpx;
		left: 100rpx;
		color: #ffffff;
	}

	.like view {
		margin-right: 270rpx;
	}

	.like text {
		margin-right: 10rpx;
	}

	button {
		background-color: transparent;
		padding: 0;
		color: #ffffff;
		border: none;
		line-height: inherit;
		margin: 0;
		width: auto;
		border-radius: none;
		font-size: 30rpx;
	}

	button::after {
		border: none;
		padding: 0;
		margin: 0;
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

	.musicItem image {
		width: 90rpx;
		height: 90rpx;
		position: absolute;
		right: 20rpx;
		border-radius: 10rpx;
	}

	.more {
		color: #ffffff;
		font-size: 26rpx;
	}
</style>
