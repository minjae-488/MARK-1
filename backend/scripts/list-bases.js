require('dotenv').config();
const axios = require('axios');

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;

async function listBases() {
    console.log('🔍 Airtable Base 목록 조회 중...\n');

    try {
        const response = await axios.get(
            'https://api.airtable.com/v0/meta/bases',
            {
                headers: {
                    'Authorization': `Bearer ${AIRTABLE_API_KEY}`
                }
            }
        );

        const bases = response.data.bases;

        if (bases.length === 0) {
            console.log('⚠️  계정에 Base가 하나도 없습니다.');
            console.log('👉 Airtable 웹사이트에서 "MARK-1-Production" Base를 생성해주세요.');
        } else {
            console.log(`✅ 총 ${bases.length}개의 Base를 찾았습니다:\n`);
            bases.forEach(base => {
                console.log(`- 이름: [${base.name}]`);
                console.log(`  ID:   ${base.id}`);
                console.log(`  권한: ${base.permissionLevel}`);
                console.log('');

                if (base.name === 'MARK-1-Production') {
                    console.log('✨ "MARK-1-Production" Base를 찾았습니다!');
                    console.log('👉 위 ID를 .env 파일의 AIRTABLE_BASE_ID에 설정하세요.');
                }
            });
        }

    } catch (error) {
        console.error('❌ Base 목록 조회 실패!');
        console.error('에러:', error.response?.data || error.message);
        if (error.response?.status === 403) {
            console.log('\n💡 힌트: 토큰 생성 시 "schema.bases:read" 권한을 체크했는지 확인하세요.');
        }
    }
}

listBases();
