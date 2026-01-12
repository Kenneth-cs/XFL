<template>
  <div class="register">
    <van-nav-bar title="用户注册" left-arrow @click-left="router.back()" />

    <van-form @submit="onSubmit">
      <van-cell-group inset title="基本信息">
        <van-field
          v-model="form.phone"
          name="phone"
          label="手机号"
          placeholder="请输入11位手机号"
          type="tel"
          maxlength="11"
          :rules="[
            { required: true, message: '请输入手机号' },
            { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号' }
          ]"
        />
        <van-field
          v-model="form.password"
          type="password"
          name="password"
          label="密码"
          placeholder="请输入密码（6-20位）"
          :rules="[
            { required: true, message: '请输入密码' },
            { pattern: /^.{6,20}$/, message: '密码长度为6-20位' }
          ]"
        />
        <van-field
          v-model="form.name"
          name="name"
          label="姓名"
          placeholder="请输入真实姓名"
          :rules="[{ required: true, message: '请输入姓名' }]"
        />
        <van-field
          v-model="form.gender"
          is-link
          readonly
          name="gender"
          label="性别"
          placeholder="请选择性别"
          @click="showGenderPicker = true"
          :rules="[{ required: true, message: '请选择性别' }]"
        />
        <van-field
          v-model="form.birthday"
          is-link
          readonly
          name="birthday"
          label="出生日期"
          placeholder="请选择出生日期"
          @click="showDatePicker = true"
          :rules="[{ required: true, message: '请选择出生日期' }]"
        />
        <van-field
          v-model="form.height"
          type="number"
          name="height"
          label="身高"
          placeholder="请输入身高（cm）"
          :rules="[
            { required: true, message: '请输入身高' },
            { 
              validator: (val: string) => {
                const num = Number(val)
                return num >= 100 && num <= 250
              }, 
              message: '身高应在100-250cm之间' 
            }
          ]"
        />
        <van-field
          v-model="form.weight"
          type="number"
          name="weight"
          label="体重"
          placeholder="请输入体重（kg）"
          :rules="[
            { required: true, message: '请输入体重' },
            { 
              validator: (val: string) => {
                const num = Number(val)
                return num >= 30 && num <= 200
              }, 
              message: '体重应在30-200kg之间' 
            }
          ]"
        />
        <van-field
          v-model="form.education"
          is-link
          readonly
          name="education"
          label="学历"
          placeholder="请选择学历"
          @click="showEducationPicker = true"
          :rules="[{ required: true, message: '请选择学历' }]"
        />
        <van-field
          v-model="form.marriage"
          is-link
          readonly
          name="marriage"
          label="婚况"
          placeholder="请选择婚况"
          @click="showMarriagePicker = true"
          :rules="[{ required: true, message: '请选择婚况' }]"
        />
        <van-field
          v-model="form.ethnicity"
          is-link
          readonly
          name="ethnicity"
          label="民族"
          placeholder="请选择民族"
          @click="showEthnicityPicker = true"
          :rules="[{ required: true, message: '请选择民族' }]"
        />
        <van-field
          v-model="form.storeName"
          is-link
          readonly
          name="storeId"
          label="归属门店"
          placeholder="请选择归属门店"
          @click="showStorePicker = true"
          :rules="[{ required: true, message: '请选择归属门店' }]"
        />
      </van-cell-group>

      <!-- 用户协议 -->
      <van-cell-group inset title="服务协议">
        <van-cell center>
          <template #title>
            <van-checkbox v-model="agreeToTerms" shape="square">
              我已阅读并同意
              <span class="link-text" @click.stop="showAgreement">《用户信息授权使用协议》</span>
            </van-checkbox>
          </template>
        </van-cell>
      </van-cell-group>

      <div class="submit-btn">
        <van-button round block type="primary" native-type="submit" :loading="loading" :disabled="!agreeToTerms">
          注册
        </van-button>
      </div>
    </van-form>

    <!-- 性别选择器 -->
    <van-popup v-model:show="showGenderPicker" position="bottom">
      <van-picker
        :columns="genderColumns"
        @confirm="onGenderConfirm"
        @cancel="showGenderPicker = false"
      />
    </van-popup>

    <!-- 日期选择器 -->
    <van-popup v-model:show="showDatePicker" position="bottom">
      <van-date-picker
        @confirm="onDateConfirm"
        @cancel="showDatePicker = false"
        :min-date="new Date(1950, 0, 1)"
        :max-date="new Date(2010, 11, 31)"
      />
    </van-popup>

    <!-- 学历选择器 -->
    <van-popup v-model:show="showEducationPicker" position="bottom">
      <van-picker
        :columns="educationColumns"
        @confirm="onEducationConfirm"
        @cancel="showEducationPicker = false"
      />
    </van-popup>

    <!-- 婚况选择器 -->
    <van-popup v-model:show="showMarriagePicker" position="bottom">
      <van-picker
        :columns="marriageColumns"
        @confirm="onMarriageConfirm"
        @cancel="showMarriagePicker = false"
      />
    </van-popup>

    <!-- 民族选择器 -->
    <van-popup v-model:show="showEthnicityPicker" position="bottom">
      <van-picker
        :columns="ethnicityColumns"
        @confirm="onEthnicityConfirm"
        @cancel="showEthnicityPicker = false"
      />
    </van-popup>

    <!-- 门店选择器 -->
    <van-popup v-model:show="showStorePicker" position="bottom">
      <van-picker
        :columns="storeColumns"
        @confirm="onStoreConfirm"
        @cancel="showStorePicker = false"
      />
    </van-popup>

    <!-- 用户协议弹窗 -->
    <van-popup v-model:show="showAgreementDialog" position="center" style="width: 90%; max-height: 80vh; overflow: auto; border-radius: 12px;">
      <div class="agreement-content">
        <div class="agreement-header">
          <h3>婚恋服务个人信息授权使用协议</h3>
        </div>
        <div class="agreement-body">
          <p><strong>甲方（授权方）：</strong>本协议项下的授权方为使用乙方婚恋网站服务的注册用户（以下简称"用户"）。</p>
          <p><strong>乙方（被授权方）：</strong>本公司（即运营本婚恋网站的主体，以下简称"运营方"）</p>
          
          <p>鉴于甲方拟使用乙方提供的婚恋服务，乙方为向甲方提供精准、优质的婚恋服务，需收集、使用甲方的相关个人信息，并由乙方员工在服务范围内使用该等信息。根据《中华人民共和国民法典》《中华人民共和国个人信息保护法》等相关法律法规的规定，甲乙双方本着平等、自愿、公平和诚实信用的原则，达成如下协议，以资共同遵守。</p>
          
          <h4>第一条 定义</h4>
          <p>1.1 个人信息：指以电子或者其他方式记录的与已识别或者可识别的自然人有关的各种信息，不包括匿名化处理后的信息，包括但不限于本协议约定的甲方个人基础信息、性格测试结果、访谈信息、服务进度信息等。</p>
          <p>1.2 敏感个人信息：指一旦泄露或者非法使用，容易导致自然人的人格尊严受到侵害或者人身、财产安全受到危害的个人信息，如甲方的婚姻状况、情感经历、家庭背景等（若涉及）。</p>
          <p>1.3 婚恋服务：指乙方通过其运营的网站向甲方提供的婚恋匹配、情感咨询、相亲活动组织等相关服务。</p>
          <p>1.4 授权员工：指乙方内部经正式任命、具备相应权限，为履行婚恋服务职责而需要接触、使用甲方个人信息的工作人员。</p>
          
          <h4>第二条 授权范围</h4>
          <p><strong>2.1 授权信息种类：</strong>甲方同意乙方收集并授权乙方及其授权员工使用甲方在使用乙方婚恋服务过程中填写、提交的各类信息，以及双方沟通交流过程中产生的各类信息，具体包括但不限于：</p>
          <ul>
            <li><strong>个人基础信息：</strong>姓名、性别、年龄、身份证号码、联系方式（电话、电子邮箱、通讯地址）、照片、学历、职业、收入状况、户籍所在地、现居住地等；</li>
            <li><strong>性格测试结果：</strong>甲方参与乙方组织的性格测评、婚恋观测评等产生的全部测试数据及分析结果；</li>
            <li><strong>访谈信息：</strong>甲方与乙方授权员工在服务对接过程中，就个人情感需求、择偶标准、家庭情况、过往情感经历等内容进行沟通所形成的记录（包括文字、音频、视频记录等）；</li>
            <li><strong>服务进度信息：</strong>乙方为甲方提供婚恋服务过程中产生的相关信息，包括匹配对象信息、约会安排记录、服务反馈意见、服务阶段评估结果等；</li>
            <li><strong>其他与婚恋服务相关的信息：</strong>甲方为享受乙方婚恋服务而主动提供的其他私人信息。</li>
          </ul>
          
          <p><strong>2.2 授权使用目的：</strong>甲方授权乙方及其授权员工使用上述信息，仅限于为甲方提供婚恋服务之目的，具体包括：</p>
          <ul>
            <li>进行用户身份核验，确保服务对象信息真实有效；</li>
            <li>分析甲方情感需求与择偶偏好，精准匹配合适的婚恋对象；</li>
            <li>与甲方进行服务对接，反馈服务进展，解答服务相关疑问；</li>
            <li>组织线下相亲活动、情感交流沙龙等服务相关活动；</li>
            <li>优化乙方婚恋服务质量，提升服务体验（相关数据将进行匿名化处理）；</li>
            <li>遵守法律法规规定或响应国家机关的合法要求（需提前告知甲方，法律法规另有规定的除外）。</li>
          </ul>
          
          <p><strong>2.3 授权使用范围：</strong>仅限乙方内部授权员工在履行工作职责范围内使用，不得超出婚恋服务所需范围向任何第三方（乙方关联公司除外，关联公司使用需另行取得甲方同意）披露、共享、转让上述信息。</p>
          
          <p><strong>2.4 授权期限：</strong>自本协议生效之日起至乙方为甲方提供的婚恋服务终止后3年止。服务终止后，乙方应停止使用甲方个人信息，并对已收集的信息进行匿名化处理或安全删除，法律法规另有规定的除外。</p>
          
          <h4>第三条 乙方及授权员工的义务</h4>
          <p>3.1 乙方应建立健全内部个人信息管理制度和操作规程，对授权员工的信息使用权限进行严格管控，明确各岗位员工的信息使用范围和操作规范，确保甲方个人信息安全。</p>
          <p>3.2 乙方应定期对授权员工进行个人信息保护法律法规及内部管理制度培训，提升员工的信息保护意识和合规操作能力。</p>
          <p>3.3 乙方及授权员工在使用甲方个人信息过程中，应采取加密、去标识化等必要的安全技术措施，防止甲方个人信息泄露、篡改、丢失。</p>
          <p>3.4 授权员工不得私自记录、复制、留存、传播甲方个人信息，不得将个人信息用于与婚恋服务无关的其他目的，离职时应向乙方交还全部涉及甲方个人信息的资料，并履行保密义务。</p>
          <p>3.5 乙方应建立个人信息安全事件应急预案，发生信息泄露、篡改、丢失等安全事件时，应立即采取补救措施，并按照法律法规规定及时通知甲方及履行个人信息保护职责的部门。</p>
          <p>3.6 乙方不得违反本协议约定的使用目的和范围使用甲方个人信息，不得通过误导、欺诈、胁迫等方式变相扩大信息使用范围。</p>
          
          <h4>第四条 甲方的权利</h4>
          <p>4.1 甲方有权撤回本协议项下的授权，撤回授权应通过乙方向书面提出，乙方应在收到撤回申请后及时停止相关信息使用，并提供撤回结果反馈。但撤回授权不影响乙方在撤回前基于合法授权已完成的信息处理行为的效力。</p>
          <p>4.2 甲方有权要求乙方对个人信息处理规则进行解释说明，乙方应予以清晰、明确的解答。</p>
          <p>4.3 若乙方或其授权员工违反本协议约定使用甲方个人信息，损害甲方合法权益的，甲方有权要求乙方承担相应的赔偿责任。</p>
          
          <h4>第五条 风险规避与免责条款</h4>
          <p>5.1 乙方严格按照本协议约定及相关法律法规规定处理甲方个人信息，因不可抗力、第三方恶意攻击等非乙方主观过错导致的信息安全事件，乙方已履行合理注意义务并及时采取补救措施的，不承担赔偿责任。</p>
          <p>5.2 甲方应保证其向乙方提供的个人信息真实、准确、完整，因甲方提供虚假信息导致的自身或第三方权益损害，由甲方自行承担责任。</p>
          <p>5.3 甲方知晓并同意，乙方为提升服务质量，可能将匿名化处理后的甲方信息用于服务优化、数据分析等工作，该等匿名化信息无法识别甲方身份，乙方无需另行取得甲方同意。</p>
          
          <h4>第六条 违约责任</h4>
          <p>6.1 若乙方违反本协议约定，超出授权范围使用、泄露甲方个人信息，或未采取有效安全措施导致甲方信息泄露、篡改、丢失，给甲方造成损失的，乙方应依法承担全部赔偿责任；构成违法犯罪的，乙方应承担相应的法律责任。</p>
          <p>6.2 若授权员工违反本协议约定及乙方内部管理制度，违规使用、泄露甲方个人信息，给甲方造成损失的，乙方应先向甲方承担赔偿责任，再有权向该员工追偿。</p>
          <p>6.3 若甲方违反本协议约定，提供虚假信息或不正当干预乙方信息处理活动，给乙方造成损失的，甲方应承担相应的赔偿责任。</p>
          
          <h4>第七条 协议的生效与变更</h4>
          <p>7.1 本协议为用户注册乙方婚恋网站账号时的必备条款，用户点击勾选"我已阅读并同意本协议"并完成注册流程，即视为用户已充分阅读、理解并接受本协议全部条款，本协议自此时生效。乙方应在用户注册页面显著位置提示用户仔细阅读本协议全部条款，特别是涉及用户重大权利义务的条款，并为用户提供便捷的协议查阅方式。</p>
          <p>7.2 乙方如需变更本协议条款，应提前7个工作日通过网站公告、站内信等合理方式通知甲方，变更后的协议条款自甲方确认同意之日起生效；甲方不同意变更的，可要求终止婚恋服务，乙方应按照本协议约定处理相关信息。</p>
          
          <h4>第八条 争议解决</h4>
          <p>因本协议引起的或与本协议有关的任何争议，双方应首先通过友好协商解决；协商不成的，任何一方均有权向乙方住所地有管辖权的人民法院提起诉讼。</p>
          
          <h4>第九条 其他</h4>
          <p>9.1 本协议未尽事宜，按照《中华人民共和国民法典》《中华人民共和国个人信息保护法》等相关法律法规规定执行。</p>
          <p>9.2 本协议采用线上确认的方式签署，与线下签署具有同等法律效力。</p>
          
          <p class="agreement-footer">点击勾选即表示您已充分阅读、理解并接受本协议全部条款。</p>
        </div>
        <div class="agreement-actions">
          <van-button block type="primary" @click="closeAgreement">我已阅读</van-button>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { showToast } from '@/utils/toast'
import request from '@/api/request'

const router = useRouter()
const userStore = useUserStore()

const loading = ref(false)
const agreeToTerms = ref(false)
const showAgreementDialog = ref(false)

const form = ref({
  phone: '',
  password: '',
  name: '',
  gender: '',
  birthday: '',
  height: '',
  weight: '',
  education: '',
  marriage: '',
  ethnicity: '汉族',
  storeId: '',
  storeName: ''
})

// 选择器显示状态
const showGenderPicker = ref(false)
const showDatePicker = ref(false)
const showEducationPicker = ref(false)
const showMarriagePicker = ref(false)
const showEthnicityPicker = ref(false)
const showStorePicker = ref(false)

// 选项数据（根据文档要求）- Vant Picker 需要对象数组格式
const genderColumns = [
  { text: '男' },
  { text: '女' }
]
const educationColumns = [
  { text: '高中及以下' },
  { text: '大专' },
  { text: '本科' },
  { text: '硕士' },
  { text: '博士' }
]
const marriageColumns = [
  { text: '未婚' },
  { text: '离异未育' },
  { text: '离异带孩' },
  { text: '丧偶' }
]
const ethnicityColumns = [
  { text: '汉族' }, { text: '蒙古族' }, { text: '回族' }, { text: '藏族' }, 
  { text: '维吾尔族' }, { text: '苗族' }, { text: '彝族' }, { text: '壮族' }, 
  { text: '布依族' }, { text: '朝鲜族' }, { text: '满族' }, { text: '侗族' }, 
  { text: '瑶族' }, { text: '白族' }, { text: '土家族' }, { text: '哈尼族' },
  { text: '哈萨克族' }, { text: '傣族' }, { text: '黎族' }, { text: '傈僳族' }, 
  { text: '佤族' }, { text: '畲族' }, { text: '高山族' }, { text: '拉祜族' },
  { text: '水族' }, { text: '东乡族' }, { text: '纳西族' }, { text: '景颇族' }, 
  { text: '柯尔克孜族' }, { text: '土族' }, { text: '达斡尔族' },
  { text: '仫佬族' }, { text: '羌族' }, { text: '布朗族' }, { text: '撒拉族' }, 
  { text: '毛南族' }, { text: '仡佬族' }, { text: '锡伯族' },
  { text: '阿昌族' }, { text: '普米族' }, { text: '塔吉克族' }, { text: '怒族' }, 
  { text: '乌孜别克族' }, { text: '俄罗斯族' },
  { text: '鄂温克族' }, { text: '德昂族' }, { text: '保安族' }, { text: '裕固族' }, 
  { text: '京族' }, { text: '塔塔尔族' },
  { text: '独龙族' }, { text: '鄂伦春族' }, { text: '赫哲族' }, { text: '门巴族' }, 
  { text: '珞巴族' }, { text: '基诺族' }
]
const storeColumns = ref<any[]>([])

// 加载门店列表
onMounted(async () => {
  try {
    const stores = await request.get('/stores')
    storeColumns.value = stores.map((s: any) => ({
      text: `${s.id} ${s.name}`,  // 门店ID + 全称
      value: s.id
    }))
  } catch (error) {
    console.error('加载门店列表失败:', error)
  }
})

// 选择器确认事件
function onGenderConfirm({ selectedOptions }: any) {
  form.value.gender = selectedOptions[0].text
  showGenderPicker.value = false
}

function onDateConfirm({ selectedValues }: any) {
  const year = selectedValues[0]
  const month = String(selectedValues[1]).padStart(2, '0')
  const day = String(selectedValues[2]).padStart(2, '0')
  form.value.birthday = `${year}-${month}-${day}`
  showDatePicker.value = false
}

function onEducationConfirm({ selectedOptions }: any) {
  form.value.education = selectedOptions[0].text
  showEducationPicker.value = false
}

function onMarriageConfirm({ selectedOptions }: any) {
  form.value.marriage = selectedOptions[0].text
  showMarriagePicker.value = false
}

function onEthnicityConfirm({ selectedOptions }: any) {
  form.value.ethnicity = selectedOptions[0].text
  showEthnicityPicker.value = false
}

function onStoreConfirm({ selectedOptions }: any) {
  form.value.storeId = selectedOptions[0].value
  form.value.storeName = selectedOptions[0].text
  showStorePicker.value = false
}

// 显示/关闭用户协议
function showAgreement() {
  showAgreementDialog.value = true
}

function closeAgreement() {
  showAgreementDialog.value = false
  agreeToTerms.value = true
}

// 提交注册
async function onSubmit() {
  // 检查是否同意协议
  if (!agreeToTerms.value) {
    showToast('请先阅读并同意用户协议')
    return
  }

  loading.value = true
  console.log('开始提交注册:', form.value)
  try {
    const res = await userStore.registerUser({
      phone: form.value.phone,
      password: form.value.password,
      name: form.value.name,
      gender: form.value.gender,
      birthday: form.value.birthday,
      height: Number(form.value.height),
      weight: Number(form.value.weight),
      education: form.value.education,
      marriage: form.value.marriage,
      ethnicity: form.value.ethnicity,
      storeId: form.value.storeId
    })
    console.log('注册成功:', res)
    showToast('注册成功，请登录')
    setTimeout(() => {
      router.push('/login')
    }, 1500) // 延迟跳转，让用户看到提示
  } catch (error: any) {
    console.error('注册失败:', error)
    
    // 获取后端返回的具体错误信息
    const errorMsg = error.response?.data?.message || error.message || '注册失败，请检查网络'
    console.log('最终错误消息:', errorMsg)
    
    // 显示错误提示
    showToast(Array.isArray(errorMsg) ? errorMsg[0] : errorMsg)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.register {
  min-height: 100vh;
  background-color: #f7f8fa;
  padding-bottom: 20px;
}

.submit-btn {
  margin: 16px;
}

.link-text {
  color: #1989fa;
  text-decoration: underline;
}

.agreement-content {
  padding: 20px;
  background: white;
}

.agreement-header {
  text-align: center;
  margin-bottom: 20px;
}

.agreement-header h3 {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin: 0;
}

.agreement-body {
  max-height: 50vh;
  overflow-y: auto;
  font-size: 14px;
  line-height: 1.8;
  color: #666;
}

.agreement-body p {
  margin: 10px 0;
  text-indent: 0;
}

.agreement-body h4 {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin: 20px 0 10px;
}

.agreement-body ul {
  margin: 10px 0;
  padding-left: 20px;
}

.agreement-body li {
  margin: 8px 0;
  list-style-type: disc;
  color: #666;
}

.agreement-footer {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #eee;
  font-weight: bold;
  color: #1989fa;
  text-align: center;
}

.agreement-actions {
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid #eee;
}
</style>

