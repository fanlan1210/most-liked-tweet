const params = new URLSearchParams(location.search);

const vm = Vue.createApp({
  data() {
    return {
      isResulted: false,
      me: '',
      liked : {
        username: 'unknown',
        id: 'null',
        img: '#'
      }
    }
  },
  methods: {
    fetchData() {
      fetch(`/user/${this.me}`)
      .then(function(response) {
          if(!response.ok) throw new Error('Cannot fetch data!');
          return response.json();
      })
      .then( (data)=>{
        //this.me = params.get('user');
        this.liked = {
          username: data.name,
          id: data.username,
          img: data.profile_image_url
        }
        this.isResulted = true;
      })
      .catch( (err)=>{
        Swal.fire('錯誤', '資料獲取失敗，可能是輸入的名稱不存在或為私人帳號，或是已達 API 查詢上限，請稍候再試試看。', 'error');
      } );
    }
  }/*,
  beforeMount(){
    this.fetchData();
  }*/
});

vm.mount('#app');
