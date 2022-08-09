<template>
	<block>
		<view class="background" :style="{backgroundImage:'url(' + musicData.al.picUrl + ')'}"></view>
		<view class="content">
			<view class="singer">{{musicData.ar[0].name}}</view>
			<text v-if="name" class="iconfont icon-shangyishoushangyige" id="pre" @click="changeMusic($event)" ></text>
			<text v-if="name" class="iconfont icon-xiayigexiayishou" id="next" @click="changeMusic($event)" ></text>
			<view class="image">
				<image :src="musicData.al.picUrl"></image>
				<text  v-if="!isPlay" @click="pause()" class="iconfont icon-bofang"></text>
				<text  v-if="isPlay" @click="pause()" class="iconfont icon-zanting"></text>
			</view>
			<scroll-view scroll-y="true" :scroll-top="34*activeIndex" scroll-with-animation="true" class="lyric">
				<view class="item" v-for="(item,index) in lyric" :style="index===activeIndex?'color: #ffffff;':''"
					:key="index">{{item.text}}</view>
			</scroll-view>
			<view class="ProgressBar">
				<text class="musicStart">{{musicStart}}</text>
				<view class="Bar">
					<view class="totalBar" @click="seek($event)">
						<view class="NowBar" :style="{width:currentBar+ 'rpx'}">
							<view class="audio-circle" @touchstart="moveBar($event)" @touchmove="moveStart($event)"
								@touchend="moveEnd($event)"></view>
						</view>
					</view>
				</view>
				<text class="musicEnd">{{musicEnd}}</text>
			</view>
			<view class="comments">
				<view class="Wonderful-reviews">精彩评论</view>
				<view class="user">
					<image :src="comment[0].user.avatarUrl" ></image>
					<view class="userInfo">
						<text class="userName">{{comment[0].user.nickname}}</text>
						<text class="time">{{comment[0].time}}</text>
					</view>
				</view>
				<view class="comment">{{comment[0].content}}</view>
			</view>
		</view>

	</block>
</template>
<script>
	import Pubsub from 'pubsub-js'
	import request from '../../utils/request.js'
	import moment from 'moment'
	export default {
		data() {
			return ({
				musicData: {},
				lyric: [],
				isPlay: false,
				url: '',
				id: '',
				activeIndex: 0,
				musicStart: '00:00',
				musicEnd: '',
				currentBar: 0,
				firstLeft: 0,
				comment:[],
				name:''
			})
		},
		onLoad(option) {
			let name=option.name
			if(name){
				this.name=name
			}
			let id = JSON.parse(option.musicId)
			this.getMusicDetail(id)
			this.getComment(id)
			this.BackgroundAudioManager = wx.getBackgroundAudioManager()
			if (this.$store.state.isPlay && this.$store.state.id === this.id) {
				this.isPlay = true
			}
			this.BackgroundAudioManager.onPlay(() => {
				this.changePlayState(true)
				this.$store.state.id = id
			})
			this.BackgroundAudioManager.onPause(() => {
				this.changePlayState(false)
			})
			this.BackgroundAudioManager.onStop(() => {
				this.changePlayState(false)
			})
			this.BackgroundAudioManager.onTimeUpdate(() => {
				if (moment(this.musicData.dt).format('mm:ss') !== moment(this.BackgroundAudioManager.duration *
						1000).format('mm:ss')) {
					this.musicStart = '00:00'
				} else {
					let musicStart = moment(this.BackgroundAudioManager.currentTime * 1000).format('mm:ss')
					let currentBar = this.BackgroundAudioManager.currentTime / this.BackgroundAudioManager
						.duration * 360
					this.musicStart = musicStart
					this.currentBar = currentBar
				}
				let index = 0
				for (index; index < this.lyric.length; index++) {
					if (this.musicStart == this.lyric[index].time) {
						this.activeIndex = index
						break
					}
				}
			})
			this.BackgroundAudioManager.onEnded(() => {
				this.$store.state.isPlay = false
				this.isPlay = false
				this.currentBar = 0
				this.activeIndex = 0
			})
		},
		methods: {
			async getMusicDetail(id) {
				let data = await request(`http://localhost:3000/song/detail?ids=${id}`)
				let lyric = await request(`http://localhost:4000/lyric?id=${id}`)
				this.lyric=[]
				this.id = id
				this.musicData = data.songs[0]
				wx.setNavigationBarTitle({
					title: this.musicData.name
				})
				let r = lyric.lrc.lyric
				let arr = r.split(/[\n,]/g)
				arr.map(item => {
					let a = item.substr(1).split("]")
					let arr = []
					if (!a[1] == "") {
						this.lyric.push({
							time: a[0],
							text: a[1]
						})
					}
				})
				this.lyric.map(item => {
					item.time = item.time.substr(0, 5)
				})
				this.musicEnd = moment(this.musicData.dt).format('mm:ss')
			},
			pause() {
				this.$store.state.isPlay = !this.$store.state.isPlay
				this.isPlay = !this.isPlay
				this.getMP3(this.id, this.url)
			},
			async getMP3(musicId, url) {
				if (this.isPlay) {
					if (!url) {
						let musicUrl = await request(`http://localhost:3000/song/url?id=${musicId}`)
						let mp3 = musicUrl.data[0].url
						this.url = mp3
						if(!this.url){
							uni.showModal({
									title: '听我想听',
									content: '抱歉，此歌已失效',
									showCancel: false,
									confirmText: '我知道了'
								})
							}
							this.$store.state.isPlay=false
						}
					
					this.BackgroundAudioManager.src = this.url
					this.BackgroundAudioManager.title = this.musicData.name
				} else {
					this.BackgroundAudioManager.pause()
				}

			},
			changePlayState(isPlay) {
				this.isPlay = isPlay
				this.$store.state.isPlay = isPlay
			},
			moveBar(e) {
				this.firstLeft = e.mp.touches[0].clientX - 97.5
				this.currentBar = this.firstLeft * (360 / 182.5)
			},

			moveStart(e) {
				this.BackgroundAudioManager.onTimeUpdate(() => {
					if (moment(this.musicData.dt).format('mm:ss') !== moment(this.BackgroundAudioManager.duration *
							1000).format('mm:ss')) {
						this.musicStart = '00:00'
					} else {
						let musicStart = moment(this.BackgroundAudioManager.currentTime * 1000).format('mm:ss')
						this.musicStart = musicStart
					}
					let index = this.activeIndex
					for (index; index < this.lyric.length; index++) {
						if (this.musicStart == this.lyric[index].time) {
							this.activeIndex = index
							break
						}
					}
				})

				if (this.currentBar < 360) {
					this.currentBar = 360
					this.currentBar = (e.mp.touches[0].clientX - 97.5) * (360 / 200)
				}
				if (this.currentBar <= 0) {
					this.currentBar = 0
				}

			},

			moveEnd(e) {
				if (this.currentBar <= 0) {
					this.currentBar = 0
				}
				if (this.currentBar >= 360) {
					this.currentBar = 360
				}
				this.BackgroundAudioManager.seek((this.currentBar / 360 * this.musicData.dt / 1000).toFixed(2) * 1)
				this.BackgroundAudioManager.onTimeUpdate(() => {
					if (moment(this.musicData.dt).format('mm:ss') !== moment(this.BackgroundAudioManager.duration *
							1000).format('mm:ss')) {
						this.musicStart = '00:00'
					} else {
						let musicStart = moment(this.BackgroundAudioManager.currentTime * 1000).format('mm:ss')
						let currentBar = this.BackgroundAudioManager.currentTime / this.BackgroundAudioManager
							.duration * 360
						this.musicStart = musicStart
						this.currentBar = currentBar
					}
					let index = 0
					for (index; index < this.lyric.length; index++) {
						if (this.musicStart == this.lyric[index].time) {
							this.activeIndex = index
							break
						}
					}
				})
			},
			seek(event) {
				this.firstLeft = event.mp.touches[0].clientX - 97.5
				this.currentBar = this.firstLeft * (360 / 182.5)
				this.BackgroundAudioManager.seek((this.currentBar / 360 * this.musicData.dt / 1000).toFixed(2) * 1)
			},
			async getComment(id){
				let comment=await request(`http://localhost:4000/comment/music?id=${id}`)
				this.comment=comment.comments
				this.comment.map(item=>{
					item.time=moment(item.time).format("YYYY-MM-MM hh:mm:ss")
				})
			},
			changeMusic(e){
				let type=e.currentTarget.id
				this.BackgroundAudioManager.stop()
				Pubsub.subscribeOnce("MusicId",(msg,musicId)=>{
					this.isPlay=true
				    this.getMusicDetail(musicId)
					this.url=""
				    this.getMP3(musicId)
					this.getComment(musicId)
				})
				Pubsub.publish("switchMusic",type)
			}
		},
		watch: {
			isPlay(newValue) {
				this.$store.state.isPlay = newValue
			}
		}
	}
</script>

<style>
	.background {
		height: 1300rpx;
		filter: blur(25px) brightness(40%) grayscale(50%);
		width: 100%;
		transform: scale(1.3);
		background: no-repeat;
		background-size: 100% 100%;
	}

	.content {
		width: 100%;
		position: absolute;
		left: 0;
		top: 0;
	}

	.singer {
		margin: 20rpx 0;
		color: white;
		text-align: center;
	}

	.image {
		position: relative;
		width: 100%;
		height: 500rpx;
	}

	.image image {
		position: absolute;
		width: 460rpx;
		height: 460rpx;
		left: 0;
		right: 0;
		border-radius: 20rpx;
		margin: 20rpx auto;
	}

	.image .iconfont {
		position: absolute;
		width: 80rpx;
		height: 80rpx;
		font-size: 80rpx;
		color: white;
		text-align: center;
		line-height: 80rpx;
		left: 0;
		right: 0;
		bottom: 0;
		top: 0;
		margin: auto auto;
	}

	.lyric {
		margin-top: 30rpx;
		text-align: center;
		height: 200rpx;
		color: #999796;
		font-size: 36rpx;
	}

	.lyric .item {
		margin-bottom: 20rpx;
	}

	.ProgressBar {
		margin-top: 40rpx;
		position: relative;
		justify-content: center;
		bottom: 0;
		display: flex;
	}

	.ProgressBar text {
		height: 80rpx;
		color: white;
		font-size: 30rpx;
		text-align: center;
		line-height: 80rpx;
	}

	.ProgressBar .Bar {
		position: relative;
		width: 400rpx;
		height: 80rpx;
	}

	.totalBar {
		width: 360rpx;
		height: 4rpx;
		background-color: white;
		position: absolute;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
		margin: auto;
	}

	.NowBar {
		height: 4rpx;
		background-color: #48cea3;
		position: absolute;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
		margin: auto 0;
		z-index: 1;
	}

	.audio-circle {
		width: 12rpx;
		height: 12rpx;
		border-radius: 50%;
		background-color: #48cea3;
		position: absolute;
		right: -6rpx;
		top: -4rpx
	}

	.comments {
		margin-top: 60rpx;
		position: absolute;
		left: 40rpx;
		color: white;
	}
	.comments .Wonderful-reviews{
		font-size: 38rpx;
		font-weight: 1000;
		color: white;
	}
	.user{
		margin: 20rpx 0;
		display: flex;
		
	}
	.user image{
		width: 60rpx;
		height: 60rpx;
		margin-right: 10rpx;
		border-radius: 50%;
	}
	.user .userInfo{
		display: flex;
		height: 60rpx;
		flex-direction: column;
	}
	.userInfo .userName{
		font-size:30rpx ;
		height: 30rpx;
		line-height: 30rpx;
	}
	.userInfo .time{
		font-size: 20rpx;
		line-height: 30rpx;
		height: 30rpx;
	}
	.comment{
		margin-left: 30rpx;
		font-size: 28rpx;
		padding: 0 30rpx;
	}
	.icon-shangyishoushangyige{
		position: absolute;
		left: 20rpx;
		font-size: 80rpx;
		color: white;
		top: 300rpx;
		z-index: 10;
	}
	.icon-xiayigexiayishou{
		position: absolute;
		right: 20rpx;
		font-size: 80rpx;
		color: white;
		top: 300rpx;
		z-index: 10;
	}
</style>
