export default(url,data={},method='GET')=>{
	return new Promise((resolve,reject)=>{
		uni.request({
			url,
			data,
			method,
			header:{
			        cookie:uni.getStorageSync('cookie')?uni.getStorageSync('cookie').filter(item=>item.indexOf('MUSIC_U')!==-1)[0]:''
			      },
			success(res){
				resolve(res.data)
			},
			fail(err){
				reject(err)
			}
		})
	})
}