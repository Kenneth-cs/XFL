import{d as j,r as i,a as F,o as $,c as I,b as p,e as t,w as o,f as d,g as k,h as s,u as D,i as x,j as m,F as E,k as J,l as X,t as L,m as Y,_ as z}from"./index-DckvbOKW.js";const A={class:"login-container"},G={class:"login-card"},K=`
  <h3 style="text-align: center; font-weight: bold;">婚恋服务机构员工保密协议</h3>
  <p><strong>甲方（用人单位）：</strong>________________________________ （以下简称"门店"）</p>
  <p><strong>乙方（劳动者）：</strong>__________________</p>
  
  <h4>一、保密信息的定义及范围</h4>
  <p>本协议所称"保密信息"，是指乙方在为甲方工作期间，因履行工作职责或因甲方业务需要而知悉的所有与甲方客户相关的信息及甲方的商业秘密。具体范围包括但不限于：</p>
  <ul>
    <li>客户个人基础信息：客户的姓名、性别、年龄、身份证号码、联系方式、家庭住址、婚姻状况、家庭成员信息、职业信息、收入状况、教育背景等；</li>
    <li>客户婚恋服务相关信息：客户的婚恋需求、服务合同内容、服务进程记录、与客户的沟通记录、为客户匹配的婚恋对象信息等；</li>
    <li>甲方的商业秘密：包括但不限于门店的客户资源库、服务流程、收费标准、营销方案、管理制度、财务信息等；</li>
  </ul>
  
  <h4>二、保密义务</h4>
  <p>乙方承诺，在为甲方工作期间及与甲方终止劳动关系后，严格履行以下保密义务：</p>
  <ul>
    <li>不得擅自收集、记录、复制、存储、携带保密信息离开甲方工作场所，除非经甲方书面授权并用于履行工作职责；</li>
    <li>不得向任何第三方泄露、披露、传播保密信息；</li>
    <li>不得利用保密信息为自己或第三方谋取利益；</li>
    <li>不得倒卖、有偿转让或变相转让保密信息；</li>
  </ul>
  
  <h4>三、保密期限</h4>
  <p>本协议约定的保密期限为自乙方知悉保密信息之日起至该保密信息完全公开且无保密必要之日止，<strong>最低保密年限不低于5年</strong>。即使乙方与甲方解除或终止劳动关系，本保密义务仍然有效。</p>
  
  <h4>四、同行竞业限制</h4>
  <p>乙方承诺，在其与甲方存在劳动关系期间以及与甲方解除或终止劳动关系后<strong>2年内</strong>，不得在与甲方经营同类业务、存在竞争关系的单位任职、兼职。</p>
  
  <h4>五、违约责任</h4>
  <p>若乙方违反本保密协议，乙方需无条件直接支付给甲方违约金<strong>人民币50万元</strong>；若违约金不足以弥补甲方实际损失，乙方还应赔偿甲方的差额部分损失。</p>
  
  <h4>六、法律责任</h4>
  <p>若乙方违反本协议约定的义务，涉嫌违法犯罪的，甲方有权向司法机关报案，追究乙方的刑事责任。</p>
  
  <p style="margin-top: 20px; color: #666;">本协议自双方签字或盖章之日起生效。</p>
`,P=j({__name:"LoginView",setup(Q){const S=D(),g=i(!1),f=i(!1),c=i(!1),h=i(!1),w=i(!1),b=i([]),_=F({username:"",password:""}),a=F({username:"",password:"",name:"",idCard:"",phone:"",storeId:"",role:"matchmaker",agreeToTerms:!1}),V=async n=>{var e,u;g.value=!0;try{const l=await k.post("/auth/login/sys",n);console.log("登录响应数据:",l),localStorage.setItem("admin_token",l.accessToken),localStorage.setItem("admin_user",JSON.stringify(l.user)),s.success("登录成功"),S.push("/")}catch(l){console.error("登录错误:",l),s.error(((u=(e=l.response)==null?void 0:e.data)==null?void 0:u.message)||"登录失败")}finally{g.value=!1}},B=n=>{console.log("Failed:",n)},y=async()=>{if(!(b.value.length>0)){w.value=!0;try{const n=await k.get("/stores",{params:{status:1}});b.value=(n.data||n||[]).filter(e=>e.status===1)}catch(n){console.error("加载门店列表失败:",n),s.error("加载门店列表失败")}finally{w.value=!1}}},M=()=>{Object.assign(a,{username:"",password:"",name:"",idCard:"",phone:"",storeId:"",role:"matchmaker",agreeToTerms:!1}),f.value=!0,y()},N=()=>{h.value=!0};$(()=>{y()});const H=async()=>{var n,e;if(!a.username||a.username.length<3||a.username.length>20){s.error("用户名长度为 3-20 个字符");return}if(!a.password||a.password.length<6||a.password.length>20){s.error("密码长度为 6-20 个字符");return}if(!a.name||a.name.length<2||a.name.length>20){s.error("姓名长度为 2-20 个字符");return}if(!a.idCard||!/^[1-9]\d{5}(18|19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}[\dXx]$/.test(a.idCard)){s.error("身份证号格式不正确");return}if(!a.phone||!/^1[3-9]\d{9}$/.test(a.phone)){s.error("手机号格式不正确");return}if(!a.storeId){s.error("请选择所属门店");return}if(!a.role){s.error("请选择申请角色");return}if(!a.agreeToTerms){s.error("请阅读并同意用户协议");return}c.value=!0;try{await k.post("/users/register/sys",a),s.success("注册申请已提交，请等待审核"),f.value=!1}catch(u){s.error(((e=(n=u.response)==null?void 0:n.data)==null?void 0:e.message)||"注册失败")}finally{c.value=!1}};return(n,e)=>{const u=d("a-input"),l=d("a-form-item"),T=d("a-input-password"),O=d("a-button"),U=d("a-form"),v=d("a-select-option"),C=d("a-select"),R=d("a-checkbox"),q=d("a-modal");return x(),I("div",A,[p("div",G,[e[13]||(e[13]=p("h2",{class:"title"},"幸福力婚恋系统 · 后台管理",-1)),t(U,{model:_,name:"basic",onFinish:V,onFinishFailed:B,autocomplete:"off",layout:"vertical"},{default:o(()=>[t(l,{label:"账号",name:"username",rules:[{required:!0,message:"请输入账号!"}]},{default:o(()=>[t(u,{value:_.username,"onUpdate:value":e[0]||(e[0]=r=>_.username=r)},null,8,["value"])]),_:1}),t(l,{label:"密码",name:"password",rules:[{required:!0,message:"请输入密码!"}]},{default:o(()=>[t(T,{value:_.password,"onUpdate:value":e[1]||(e[1]=r=>_.password=r)},null,8,["value"])]),_:1}),t(l,null,{default:o(()=>[t(O,{type:"primary","html-type":"submit",block:"",loading:g.value},{default:o(()=>[...e[12]||(e[12]=[m("登录",-1)])]),_:1},8,["loading"])]),_:1}),p("div",{class:"actions"},[p("a",{onClick:M},"注册新账号")])]),_:1},8,["model"])]),t(q,{open:f.value,"onUpdate:open":e[10]||(e[10]=r=>f.value=r),title:"后台人员注册",onOk:H,confirmLoading:c.value,width:"600px"},{default:o(()=>[t(U,{layout:"vertical"},{default:o(()=>[t(l,{label:"用户名 (登录账号)",required:!0},{default:o(()=>[t(u,{value:a.username,"onUpdate:value":e[2]||(e[2]=r=>a.username=r),placeholder:"3-20个字符"},null,8,["value"])]),_:1}),t(l,{label:"密码",required:!0},{default:o(()=>[t(T,{value:a.password,"onUpdate:value":e[3]||(e[3]=r=>a.password=r),placeholder:"6-20个字符"},null,8,["value"])]),_:1}),t(l,{label:"真实姓名",required:!0},{default:o(()=>[t(u,{value:a.name,"onUpdate:value":e[4]||(e[4]=r=>a.name=r),placeholder:"请输入真实姓名"},null,8,["value"])]),_:1}),t(l,{label:"身份证号",required:!0},{default:o(()=>[t(u,{value:a.idCard,"onUpdate:value":e[5]||(e[5]=r=>a.idCard=r),placeholder:"请输入18位身份证号"},null,8,["value"])]),_:1}),t(l,{label:"手机号",required:!0},{default:o(()=>[t(u,{value:a.phone,"onUpdate:value":e[6]||(e[6]=r=>a.phone=r),placeholder:"请输入11位手机号"},null,8,["value"])]),_:1}),t(l,{label:"所属门店",required:!0},{default:o(()=>[t(C,{value:a.storeId,"onUpdate:value":e[7]||(e[7]=r=>a.storeId=r),placeholder:"请选择所属门店",loading:w.value,onFocus:y},{default:o(()=>[(x(!0),I(E,null,J(b.value,r=>(x(),X(v,{key:r.id,value:r.id},{default:o(()=>[m(L(r.name)+" ("+L(r.id)+") ",1)]),_:2},1032,["value"]))),128))]),_:1},8,["value","loading"])]),_:1}),t(l,{label:"申请角色",required:!0},{default:o(()=>[t(C,{value:a.role,"onUpdate:value":e[8]||(e[8]=r=>a.role=r),placeholder:"请选择申请角色"},{default:o(()=>[t(v,{value:"matchmaker"},{default:o(()=>[...e[14]||(e[14]=[m("普通红娘",-1)])]),_:1}),t(v,{value:"manager"},{default:o(()=>[...e[15]||(e[15]=[m("门店负责人",-1)])]),_:1}),t(v,{value:"admin"},{default:o(()=>[...e[16]||(e[16]=[m("门店老板",-1)])]),_:1})]),_:1},8,["value"])]),_:1}),t(l,null,{default:o(()=>[t(R,{checked:a.agreeToTerms,"onUpdate:checked":e[9]||(e[9]=r=>a.agreeToTerms=r)},{default:o(()=>[e[17]||(e[17]=m(" 我已阅读并同意 ",-1)),p("a",{onClick:Y(N,["prevent"])},"《婚恋服务机构员工保密协议》")]),_:1},8,["checked"])]),_:1})]),_:1})]),_:1},8,["open","confirmLoading"]),t(q,{open:h.value,"onUpdate:open":e[11]||(e[11]=r=>h.value=r),title:"婚恋服务机构员工保密协议",footer:null,width:"800px",bodyStyle:{maxHeight:"500px",overflowY:"auto"}},{default:o(()=>[p("div",{class:"terms-content",innerHTML:K})]),_:1},8,["open"])])}}}),Z=z(P,[["__scopeId","data-v-b498407e"]]);export{Z as default};
