<template>
	<block>
		<view class="header">
			<input @click="ToSearch" class="search-input" type="text" placeholder="搜索">
			<text class='iconfont icon-sousuo'> </text>
		</view>
		
		<view class="songRecommon">
			<view class="Recommontitle">
				<text class="title">歌曲推荐</text>
				<text class="more" @click="ToMore">更多></text>
			</view>
			<view class="RecommonItem" v-for="item in RecommonList" :id="item.id" :key="item.id" @click="ToMusicDeatail($event)" >
				<image :src="item.album.picUrl"></image>
				<view class="musicMeassage">
					<text class="musicName">{{item.name}}</text>
					<text class="musicAuthor">{{item.album.artists[0].name}}</text>
				</view>
				<text class="more">></text>
			</view>
		</view>
		<view class="hotBar">
			<view class="hotTitle" >
				<text class="title">热门歌单</text>
				<text class="more" id="hot" @click="ToMoreMenu($event)" > 更多> </text>
			</view>
			<musicSongMenu :musicMenu=hotSongMenu></musicSongMenu>
		</view>
		<view class="exquisiteBar">
			<view class="exquisiteTitle">
				<text class="title">精品歌单</text>
				<text class="more" id="exquisite" @click="ToMoreMenu($event)" > 更多> </text>
			</view>
			<musicSongMenu :musicMenu=highqualitySongMenu></musicSongMenu>
		</view>
		<view class="PeakList">
			<view class="title">巅峰榜</view>
			<HotSongChart idx=0></HotSongChart>
			<HotSongChart idx=1></HotSongChart>
			<HotSongChart idx=2></HotSongChart>
		</view>
	</block>
		

</template>

<script>
	import request from '../../utils/request.js'
	import musicSongMenu from '../../components/musicSongMenu.vue'
	import HotSongChart from '../../components/HotSongChart.vue'
	export default {
		data() {
			return {
				RecommonList: [],
				hotSongMenu: [],
				highqualitySongMenu: [],
			}
		},
		beforeCreate(){
			if (!uni.getStorageSync("cookie")) {
				uni.showToast({
					title:'请先登录',
					icon:'none'
				})
				setTimeout(()=>{
					uni.redirectTo({
						url:'/pages/login/login'
					})
				},300)
			}
		},
		async created() {
			
			let musicList = await request("http://localhost:3000/recommend/songs")
			this.RecommonList = musicList.recommend.slice(0,5)

			let hotSongMenu = await request("http://localhost:4000/top/playlist?limit=8")
			this.hotSongMenu = hotSongMenu.playlists
			this.hotSongMenu.map(item => {
				item.playCount = (item.playCount / 10000).toFixed(1)	
			})
			let highqualitySongMenu = await request("http://localhost:4000/top/playlist/highquality?limit=8")
			this.highqualitySongMenu = highqualitySongMenu.playlists
			this.highqualitySongMenu.map(item => {
				item.playCount = (item.playCount / 10000).toFixed(1)
			})
		},
		components: {
			'musicSongMenu': musicSongMenu,
			'HotSongChart': HotSongChart
		},
		methods:{
			ToSearch(){
				uni.navigateTo({
					url:'/pages/search/search',
				})
			},
			ToMore(){
				uni.navigateTo({
					url:'/pages/moreSongs/moreSongs?name='+JSON.stringify("歌曲推荐")
				})
			},
			ToMoreMenu(e){
				uni.navigateTo({
					url:'/pages/morePlaylists/morePlaylists?name='+JSON.stringify(e.currentTarget.id)
				})
			},
			ToMusicDeatail(e){
				uni.navigateTo({
					url:'/pages/musicDetail/musicDetail?musicId='+JSON.stringify(e.currentTarget.id)
				})
			}
		}

	}
</script>

<style>
	
	.header {
		margin: 30rpx;
		position: relative;
		display: flex;
		text-align: center;
	}

	.header .search-input {
		flex: 1;
		margin: 0 10rpx;
		background-color: #ffffff;
		border-radius: 20rpx;
		height: 50rpx;
	}

	.icon-sousuo {
		position: absolute;
		width: 30rpx;
		height: 50rpx;
		top: 0;
		right: 120rpx;
		font-size: 30rpx;
		line-height: 50rpx;
		bottom: 0;
		left: 0rpx;
		margin: 0 auto;
	}

	.songRecommon {
		margin-top: 40rpx;
		padding: 0 36rpx;
	}

	.title {
		font-size: 36rpx;
		font-weight: 1000;
	}

	.more {
		font-size: 26rpx;
		float: right;
		color: #8a8a8a;
	}

	.RecommonItem {
		display: flex;
		margin: 20rpx 0;
		align-items: center;
	}

	.RecommonItem image {
		width: 136rpx;
		height: 136rpx;
		border-radius: 16rpx;
	}

	.RecommonItem .musicMeassage {
		display: flex;
		width: 500rpx;
		flex-direction: column;
		margin-left: 24rpx;

	}

	.musicMeassage .musicName {
		font-size: 34rpx;
		height: 34rpx;
		line-height: 34rpx;
		max-width: 400rpx;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.musicMeassage .musicAuthor {
		margin-top: 13rpx;
		font-size: 26rpx;
		line-height: 26rpx;
		height: 26rpx;
		color: #8a8a8a
	}

	.hotBar {
		margin-top: 40rpx;
		padding: 0 36rpx;
	}

	.exquisiteBar {
		margin-top: 40rpx;
		padding: 0 36rpx;
	}

	.PeakList {
		margin-top: 40rpx;
		padding: 0 36rpx;
	}
</style>
