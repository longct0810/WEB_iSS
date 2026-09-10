(function(){
  'use strict';
  const preview=document.body.dataset.preview==='true';
  const store=preview?window.EnmsMock.createStore():null;
  window.EnmsApi={
    preview,
    async request(resource,params={},method='GET') {
      if(preview) return {data:store.request(method,resource,params),meta:{source:'mock',version:'1.0.0'}};
      const token=localStorage.getItem('hes_login_token');
      if(!token){location.replace('/login');throw new Error('Vui lòng đăng nhập');}
      const response=await fetch('/api/enms/v1/'+resource+(method==='GET'?'?'+new URLSearchParams(params):''),{method,headers:{Authorization:'Bearer '+token,'Content-Type':'application/json'},...(method!=='GET'?{body:JSON.stringify(params)}:{})});
      if(response.status===401){location.replace('/login');throw new Error('Phiên đăng nhập đã hết hạn');}
      const result=await response.json();
      if(!response.ok) throw new Error(result.message||'Không thể kết nối API');
      return result;
    }
  };
})();
