require('dotenv').config();
const axios = require('axios');

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;

async function testAirtableConnection() {
    console.log('🔍 Airtable 연결 테스트 시작...\n');

    // 환경 변수 확인
    if (!AIRTABLE_API_KEY) {
        console.error('❌ AIRTABLE_API_KEY가 설정되지 않았습니다!');
        console.log('💡 backend/.env 파일에 다음을 추가하세요:');
        console.log('   AIRTABLE_API_KEY=your_api_key_here');
        process.exit(1);
    }

    if (!AIRTABLE_BASE_ID) {
        console.error('❌ AIRTABLE_BASE_ID가 설정되지 않았습니다!');
        console.log('💡 backend/.env 파일에 다음을 추가하세요:');
        console.log('   AIRTABLE_BASE_ID=your_base_id_here');
        process.exit(1);
    }

    try {
        // Base 메타데이터 가져오기
        const response = await axios.get(
            `https://api.airtable.com/v0/meta/bases/${AIRTABLE_BASE_ID}/tables`,
            {
                headers: {
                    'Authorization': `Bearer ${AIRTABLE_API_KEY}`
                }
            }
        );

        console.log('✅ Airtable 연결 성공!\n');
        console.log(`📊 Base ID: ${AIRTABLE_BASE_ID}`);
        console.log(`📋 테이블 수: ${response.data.tables.length}`);

        if (response.data.tables.length > 0) {
            console.log('\n테이블 목록:');
            response.data.tables.forEach((table, index) => {
                console.log(`  ${index + 1}. ${table.name} (${table.fields?.length || 0}개 필드)`);
            });
        } else {
            console.log('\n💡 아직 테이블이 없습니다. TASK-008부터 테이블을 생성하세요!');
        }

        console.log('\n🎉 TASK-003 완료! 다음 단계로 진행하세요.');

    } catch (error) {
        console.error('\n❌ Airtable 연결 실패!\n');

        if (error.response?.status === 401) {
            console.error('인증 실패: API 키가 올바르지 않습니다.');
            console.log('💡 https://airtable.com/account에서 API 키를 확인하세요.');
        } else if (error.response?.status === 404) {
            console.error('Base를 찾을 수 없습니다.');
            console.log('💡 Base ID를 확인하세요. (appXXXXXXXXXXXXXX 형식)');
        } else {
            console.error('에러:', error.response?.data || error.message);
        }

        process.exit(1);
    }
}

testAirtableConnection();
