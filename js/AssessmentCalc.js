function populateDateOptions(yearSelect, monthSelect, daySelect, minYear, maxYear) {
    // 填充年份選項
    for (let year = minYear; year <= maxYear; year++) {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        yearSelect.appendChild(option);
    }

    // 填充月份選項
    for (let month = 1; month <= 12; month++) {
        const option = document.createElement('option');
        option.value = month;
        option.textContent = month;
        monthSelect.appendChild(option);
    }

    // 動態更新日期選項
    function updateDays() {
        const year = parseInt(yearSelect.value);
        const month = parseInt(monthSelect.value);
        daySelect.innerHTML = '<option value="">日</option>'; // 清空日期選項

        if (year && month) {
            const gregorianYear = year + 1911;
            const daysInMonth = new Date(gregorianYear, month, 0).getDate();
            for (let day = 1; day <= daysInMonth; day++) {
                const option = document.createElement('option');
                option.value = day;
                option.textContent = day;
                daySelect.appendChild(option);
            }
        }
    }

    yearSelect.addEventListener('change', updateDays);
    monthSelect.addEventListener('change', updateDays);
}

function addTrainingRecord() {
    const trainingList = document.getElementById('training-list');
    const recordDiv = document.createElement('div');
    recordDiv.className = 'training-record';

    // 為每個受訓記錄生成唯一的 ID
    const uniqueId = Date.now();
    recordDiv.innerHTML = `
        <div class="date-input">
            <select class="training-start-year" id="training-start-year-${uniqueId}">
                <option value="">年</option>
            </select>
            <select class="training-start-month" id="training-start-month-${uniqueId}">
                <option value="">月</option>
            </select>
            <select class="training-start-day" id="training-start-day-${uniqueId}">
                <option value="">日</option>
            </select>
        </div>
        <span>至</span>
        <div class="date-input">
            <select class="training-end-year" id="training-end-year-${uniqueId}">
                <option value="">年</option>
            </select>
            <select class="training-end-month" id="training-end-month-${uniqueId}">
                <option value="">月</option>
            </select>
            <select class="training-end-day" id="training-end-day-${uniqueId}">
                <option value="">日</option>
            </select>
        </div>
        <button type="button" onclick="this.parentElement.remove()">刪除</button>
        <small>年份範圍：80-118</small>
    `;
    trainingList.appendChild(recordDiv);

    // 初始化新受訓記錄的日期選項
    const startYearSelect = recordDiv.querySelector(`#training-start-year-${uniqueId}`);
    const startMonthSelect = recordDiv.querySelector(`#training-start-month-${uniqueId}`);
    const startDaySelect = recordDiv.querySelector(`#training-start-day-${uniqueId}`);
    const endYearSelect = recordDiv.querySelector(`#training-end-year-${uniqueId}`);
    const endMonthSelect = recordDiv.querySelector(`#training-end-month-${uniqueId}`);
    const endDaySelect = recordDiv.querySelector(`#training-end-day-${uniqueId}`);

    populateDateOptions(startYearSelect, startMonthSelect, startDaySelect, 80, 118);
    populateDateOptions(endYearSelect, endMonthSelect, endDaySelect, 80, 118);
}

function numberToChinese(num) {
    const chineseNumbers = ['零', '壹', '貳', '參', '肆', '伍', '陸', '柒', '捌', '玖'];
    const units = ['', '拾', '佰', '仟', '萬', '拾萬', '佰萬', '仟萬'];
    
    if (num === 0) return '零元整';
    
    let str = '';
    let numStr = num.toString();
    let len = numStr.length;
    
    for (let i = 0; i < len; i++) {
        let digit = parseInt(numStr[i]);
        let unit = units[len - 1 - i];
        if (digit === 0) {
            if (str[str.length - 1] !== '零') str += '零';
        } else {
            str += chineseNumbers[digit] + unit;
        }
    }
    
    str = str.replace(/零+/g, '零').replace(/零$/, '');
    if (str.endsWith('萬')) str = str.replace('萬', '');
    
    return str + '元整';
}

function parseDate(year, month, day) {
    year = parseInt(year);
    month = parseInt(month);
    day = parseInt(day);
    const gregorianYear = year + 1911;
    return new Date(gregorianYear, month - 1, day);
}

function formatDate(date) {
    const mYear = date.getFullYear() - 1911;
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${mYear}/${month}/${day}`;
}

function calculateAge(birthDate, leaveYear) {
    const birthGregorianYear = birthDate.getFullYear();
    const birthMonth = birthDate.getMonth() + 1;
    const birthDay = birthDate.getDate();
    const leaveGregorianYear = leaveYear + 1911;
    
    let age = leaveGregorianYear - birthGregorianYear;
    const today = new Date(leaveGregorianYear, 11, 31);
    const birthThisYear = new Date(leaveGregorianYear, birthMonth - 1, birthDay);
    
    if (today < birthThisYear) {
        age--;
    }
    return age;
}

function getFitnessStandards(age, gender) {
    let ageGroup;
    if (age >= 19 && age <= 29) ageGroup = '19-29';
    else if (age >= 30 && age <= 44) ageGroup = '30-44';
    else if (age >= 45 && age <= 59) ageGroup = '45-59';
    else return null;

    const standards = {
        male: {
            '19-29': {
                '男子仰臥起坐': { pass: '40 下', good: '21 下', excellent: '5 下' },
                '大字跳': { pass: '55 下', good: '35 下', excellent: '20" 下' },
                '平板撐體': { pass: "1'50\"", good: "1'40\"", excellent: '20" 下' },
                '平板撐': { pass: '3000 公尺', good: '5 分鐘', excellent: '5 公里' },
                '跑跳': { pass: '800 公尺', good: '20 公尺', excellent: '8-11 公尺' },
                '跳躍': { pass: '7-2 公尺', good: '', excellent: '' }
            },
            '30-44': {
                '男子仰臥起坐': { pass: '30 下', good: '15 下', excellent: '3 下' },
                '大字跳': { pass: '45 下', good: '30 下', excellent: '14" 下' },
                '平板撐體': { pass: "1'40\"", good: "1'20\"", excellent: '17" 下' },
                '平板撐': { pass: '16 分', good: '30 秒', excellent: '19\'00"' },
                '跑跳': { pass: '499 公尺', good: '399 公尺', excellent: "41'40\"" },
                '跳躍': { pass: "45'50\"", good: '27\'00"', excellent: '7-10 公尺' },
                '跳躍2': { pass: '6-4 公尺', good: '', excellent: '' }
            },
            '45-59': {
                '男子仰臥起坐': { pass: '20 下', good: '8 下', excellent: '2 下' },
                '大字跳': { pass: '30 下', good: '20 下', excellent: '8" 下' },
                '平板撐體': { pass: "1'20\"", good: "1'15\"", excellent: '15" 下' },
                '平板撐': { pass: "18'00\"", good: "21'00\"", excellent: '462 公尺' },
                '跑跳': { pass: '362 公尺', good: "45'00\"", excellent: "49'00\"" },
                '跳躍': { pass: "28'30\"", good: '31\'30"', excellent: '5-8 公尺' },
                '跳躍2': { pass: '4-7 公尺', good: '', excellent: '' }
            }
        },
        female: {
            '19-29': {
                '女子仰臥起坐': { pass: '20 下', good: '12 下', excellent: '8 下' },
                '仰臥抬腿': { pass: "14'45\"", good: "16'30\"", excellent: "18'00\"" },
                '平板撐體': { pass: "1'50\"", good: "1'40\"", excellent: "1'20\"" },
                '5 分鐘 跳繩': { pass: '530 下', good: '430 下', excellent: '330 下' },
                '5 分鐘 跑步': { pass: "40'20\"", good: "44'20\"", excellent: "25'30\"" },
                '2000 公尺 衝刺': { pass: '72 趟', good: '53 趟', excellent: '30 趟' }
            },
            '30-44': {
                '女子仰臥起坐': { pass: '17 下', good: '10 下', excellent: '6 下' },
                '仰臥抬腿': { pass: "19'00\"", good: "21'00\"", excellent: "22'00\"" },
                '平板撐體': { pass: "1'40\"", good: "1'20\"", excellent: "1'15\"" },
                '5 分鐘 跳繩': { pass: '499 下', good: '399 下', excellent: '299 下' },
                '5 分鐘 跑步': { pass: "41'40\"", good: "45'50\"", excellent: "27'00\"" },
                '2000 公尺 衝刺': { pass: '61 趟', good: '45 趟', excellent: '25 趟' }
            },
            '45-59': {
                '女子仰臥起坐': { pass: '15 下', good: '8 下', excellent: '4 下' },
                '仰臥抬腿': { pass: "21'00\"", good: "22'00\"", excellent: "23'00\"" },
                '平板撐體': { pass: "1'20\"", good: "1'15\"", excellent: "1'10\"" },
                '5 分鐘 跳繩': { pass: '462 下', good: '362 下', excellent: '262 下' },
                '5 分鐘 跑步': { pass: "45'00\"", good: "49'00\"", excellent: "28'30\"" },
                '2000 公尺 衝刺': { pass: '40 趟', good: '30 趟', excellent: '20 趟' }
            }
        }
    };

    return standards[gender][ageGroup] || null;
}

function getClothingPoints(seniority) {
    const years = Math.floor(seniority / 12);
    if (years >= 3) return 9860;
    else if (years === 2) return 6470;
    else if (years === 1) return 4134;
    else return 0;
}

function calculateAllowance(days) {
    // 若實際慰勞假超過10天，則最多按10天計算
    const effectiveDays = Math.min(days, 10);
    const allowance = effectiveDays * 1600;
    const invoiceAmount = effectiveDays * 800;
    return { allowance, invoiceAmount };
}

function clearAll() {
    if (window.confirm('確定要清除所有內容嗎？此操作將刪除所有填寫的資料和計算結果！')) {
        document.getElementById('leave-year').value = '';
        document.getElementById('birth-year').value = '';
        document.getElementById('birth-month').value = '';
        document.getElementById('birth-day').value = '';
        document.getElementById('gender').value = '';
        document.getElementById('use-volunteer-date').checked = true;
        document.getElementById('volunteer-year').value = '';
        document.getElementById('volunteer-month').value = '';
        document.getElementById('volunteer-day').value = '';
        document.getElementById('use-transfer-date').checked = false;
        document.getElementById('transfer-year').value = '';
        document.getElementById('transfer-month').value = '';
        document.getElementById('transfer-day').value = '';
        document.getElementById('is-reenlist').checked = false;
        document.getElementById('reenlist-details').style.display = 'none';
        document.getElementById('reenlist-year').value = '';
        document.getElementById('reenlist-month').value = '';
        document.getElementById('reenlist-day').value = '';
        document.getElementById('first-retire-year').value = '';
        document.getElementById('first-retire-month').value = '';
        document.getElementById('first-retire-day').value = '';
        document.getElementById('has-training').checked = false;
        document.getElementById('training-section').style.display = 'none';
        const trainingList = document.getElementById('training-list');
        trainingList.innerHTML = '';
        addTrainingRecord();

        document.getElementById('result').innerHTML = '';
    }
}

function calculateAll() {
    const leaveYear = parseInt(document.getElementById('leave-year').value);
    const birthYear = document.getElementById('birth-year').value;
    const birthMonth = document.getElementById('birth-month').value;
    const birthDay = document.getElementById('birth-day').value;
    const gender = document.getElementById('gender').value;
    const useVolunteerDate = document.getElementById('use-volunteer-date').checked;
    const volunteerYear = document.getElementById('volunteer-year').value;
    const volunteerMonth = document.getElementById('volunteer-month').value;
    const volunteerDay = document.getElementById('volunteer-day').value;
    const useTransferDate = document.getElementById('use-transfer-date').checked;
    const transferYear = document.getElementById('transfer-year').value;
    const transferMonth = document.getElementById('transfer-month').value;
    const transferDay = document.getElementById('transfer-day').value;
    const isReenlist = document.getElementById('is-reenlist').checked;
    const reenlistYear = isReenlist ? document.getElementById('reenlist-year').value : null;
    const reenlistMonth = isReenlist ? document.getElementById('reenlist-month').value : null;
    const reenlistDay = isReenlist ? document.getElementById('reenlist-day').value : null;
    const firstRetireYear = isReenlist ? document.getElementById('first-retire-year').value : null;
    const firstRetireMonth = isReenlist ? document.getElementById('first-retire-month').value : null;
    const firstRetireDay = isReenlist ? document.getElementById('first-retire-day').value : null;
    const hasTraining = document.getElementById('has-training').checked;
    const trainingRecords = hasTraining ? Array.from(document.querySelectorAll('.training-record')).map(record => ({
        startYear: record.querySelector('.training-start-year').value,
        startMonth: record.querySelector('.training-start-month').value,
        startDay: record.querySelector('.training-start-day').value,
        endYear: record.querySelector('.training-end-year').value,
        endMonth: record.querySelector('.training-end-month').value,
        endDay: record.querySelector('.training-end-day').value
    })) : [];
    const resultDiv = document.getElementById('result');

    // 驗證基本資料必填欄位
    if (!leaveYear || !birthYear || !birthMonth || !birthDay || !gender) {
        resultDiv.innerHTML = '<p class="error">請填寫所有基本資料必填欄位！</p>';
        return;
    }

    // 至少需要勾選一個日期選項
    if (!useVolunteerDate && !useTransferDate) {
        resultDiv.innerHTML = '<p class="error">請至少勾選一個日期選項（志願役生效日期或調任職報到日期）！</p>';
        return;
    }

    // 驗證志願役生效日期（若勾選則必須填寫）
    if (useVolunteerDate && (!volunteerYear || !volunteerMonth || !volunteerDay)) {
        resultDiv.innerHTML = '<p class="error">請填寫志願役生效日期！</p>';
        return;
    }

    // 驗證調任職報到日期（若勾選則必須填寫）
    if (useTransferDate && (!transferYear || !transferMonth || !transferDay)) {
        resultDiv.innerHTML = '<p class="error">請填寫調任職報到日期！</p>';
        return;
    }

    // 驗證再入營/育嬰資料（僅在勾選時檢查）
    if (isReenlist && (!reenlistYear || !reenlistMonth || !reenlistDay || !firstRetireYear || !firstRetireMonth || !firstRetireDay)) {
        resultDiv.innerHTML = '<p class="error">請填寫所有再入營相關欄位！</p>';
        return;
    }

    // 驗證受訓記錄（選填，但若填寫則必須完整）
    if (hasTraining) {
        for (let i = 0; i < trainingRecords.length; i++) {
            const record = trainingRecords[i];
            const isEmpty = !record.startYear && !record.startMonth && !record.startDay && !record.endYear && !record.endMonth && !record.endDay;
            const isComplete = record.startYear && record.startMonth && record.startDay && record.endYear && record.endMonth && record.endDay;
            if (!isEmpty && !isComplete) {
                resultDiv.innerHTML = `<p class="error">請確保受訓記錄 ${i + 1} 的開始和結束日期已完整填寫！</p>`;
                return;
            }
        }
    }

    // 解析日期
    const birthDate = parseDate(birthYear, birthMonth, birthDay);
    const volunteerDate = useVolunteerDate ? parseDate(volunteerYear, volunteerMonth, volunteerDay) : null;
    const transferDate = useTransferDate ? parseDate(transferYear, transferMonth, transferDay) : null;
    const reenlistDate = isReenlist && reenlistYear ? parseDate(reenlistYear, reenlistMonth, reenlistDay) : null;
    const firstRetireDate = isReenlist && firstRetireYear ? parseDate(firstRetireYear, firstRetireMonth, firstRetireDay) : null;
    const trainingDates = hasTraining ? trainingRecords
        .filter(record => record.startYear && record.endYear)
        .map(record => ({
            start: parseDate(record.startYear, record.startMonth, record.startDay),
            end: parseDate(record.endYear, record.endMonth, record.endDay)
        })) : [];

    const gregorianLeaveYear = leaveYear + 1911;
    const leaveYearEnd = new Date(gregorianLeaveYear, 11, 31);

    // 進階日期驗證
    if (useVolunteerDate) {
        if (birthDate > volunteerDate) {
            resultDiv.innerHTML = '<p class="error">出生日期應早於志願役生效日期！</p>';
            return;
        }
        if (volunteerDate > leaveYearEnd) {
            resultDiv.innerHTML = '<p class="error">志願役生效日期不得晚於慰休年度的 12 月 31 日！</p>';
            return;
        }
    }

    if (useTransferDate) {
        if (birthDate > transferDate) {
            resultDiv.innerHTML = '<p class="error">出生日期應早於調任職報到日期！</p>';
            return;
        }
        if (transferDate > leaveYearEnd) {
            resultDiv.innerHTML = '<p class="error">調任職報到日期不得晚於慰休年度的 12 月 31 日！</p>';
            return;
        }
    }

    if (useVolunteerDate && useTransferDate && volunteerDate > transferDate) {
        resultDiv.innerHTML = '<p class="error">志願役生效日期應早於調任職報到日期！</p>';
        return;
    }

    if (isReenlist && firstRetireDate >= reenlistDate) {
        resultDiv.innerHTML = '<p class="error">再入營/復職日期應晚於第一次退伍/育嬰生效日期！</p>';
        return;
    }
    if (isReenlist && (reenlistDate > leaveYearEnd || firstRetireDate > leaveYearEnd)) {
        resultDiv.innerHTML = '<p class="error">再入營相關日期不得晚於慰休年度的 12 月 31 日！</p>';
        return;
    }

    for (let i = 0; i < trainingDates.length; i++) {
        const record = trainingDates[i];
        if (record.start > record.end) {
            resultDiv.innerHTML = `<p class="error">受訓記錄 ${i + 1} 的結束日期應晚於開始日期！</p>`;
            return;
        }
        if (record.start > leaveYearEnd || record.end > leaveYearEnd) {
            resultDiv.innerHTML = `<p class="error">受訓記錄 ${i + 1} 日期不得晚於慰休年度的 12 月 31 日！</p>`;
            return;
        }
    }

    // 計算年齡
    const age = calculateAge(birthDate, leaveYear);
    if (age < 19 || age > 59) {
        resultDiv.innerHTML = '<p class="error">年齡必須在 19 至 59 歲之間！</p>';
        return;
    }

    // 獲取體能標準
    const fitnessStandards = getFitnessStandards(age, gender);
    if (!fitnessStandards) {
        resultDiv.innerHTML = '<p class="error">無法獲取體能標準，年齡不在範圍內！</p>';
        return;
    }

    let resultHTML = '';

    // 根據勾選決定是否計算考核表
    let calculateAssessment = false;
    let assessmentDate;
    if (useTransferDate) {
        calculateAssessment = true;
        assessmentDate = transferDate;
    } else if (useVolunteerDate) {
        calculateAssessment = true;
        assessmentDate = volunteerDate;
    }

    // 考核表計算（若需要）
    if (calculateAssessment) {
        resultHTML += '<h3>考核表計算結果</h3>';
        const months = [];
        let currentDate = new Date(assessmentDate);
        for (let i = 0; i < 3; i++) {
            const startDate = new Date(currentDate);
            currentDate.setMonth(currentDate.getMonth() + 1);
            const endDate = new Date(currentDate);
            months.push(`連續第${i + 1}個月：${formatDate(startDate)} - ${formatDate(endDate)}`);
        }

        const quarters = [];
        const quarterEnds = [
            { month: 2, day: 31 }, // 3月31日
            { month: 5, day: 30 }, // 6月30日
            { month: 8, day: 30 }, // 9月30日
            { month: 11, day: 31 } // 12月31日
        ];

        currentDate.setDate(currentDate.getDate() + 1);
        for (let i = 0; i < 4; i++) {
            const startDate = new Date(currentDate);
            let quarterIndex = 0;
            let endYear = startDate.getFullYear();
            for (let j = 0; j < quarterEnds.length; j++) {
                const qEnd = new Date(endYear, quarterEnds[j].month, quarterEnds[j].day);
                if (startDate < qEnd) {
                    quarterIndex = j;
                    break;
                }
                if (j === quarterEnds.length - 1) {
                    quarterIndex = 0;
                    endYear++;
                }
            }
            const endDate = new Date(endYear, quarterEnds[quarterIndex].month, quarterEnds[quarterIndex].day);
            quarters.push(`連續四季第${i + 1}季：${formatDate(startDate)} - ${formatDate(endDate)}`);
            currentDate = new Date(endDate);
            currentDate.setDate(currentDate.getDate() + 1);
        }

        const quarterEndDate = new Date(currentDate);
        quarterEndDate.setDate(quarterEndDate.getDate() - 1);
        const releaseTime = formatDate(quarterEndDate);

        const halfYear = [];
        const isAfterJuly = quarterEndDate.getMonth() >= 6;
        if (isAfterJuly) {
            const nextYear = quarterEndDate.getFullYear() + 1;
            const halfYear1Start = new Date(nextYear, 0, 1);
            const halfYear1End = new Date(nextYear, 4, 10);
            halfYear.push(`上下半年上半年：${formatDate(halfYear1Start)} - ${formatDate(halfYear1End)}`);
            const halfYear2Start = new Date(nextYear, 6, 1);
            const halfYear2End = new Date(nextYear, 9, 10);
            halfYear.push(`上下半年下半年：${formatDate(halfYear2Start)} - ${formatDate(halfYear2End)}`);
        } else {
            const halfYear1Start = new Date(currentDate);
            let halfYear1EndYear = halfYear1Start.getFullYear();
            let halfYear1End = new Date(halfYear1EndYear, 4, 10);
            if (halfYear1Start > halfYear1End) {
                halfYear1EndYear++;
                halfYear1End = new Date(halfYear1EndYear, 4, 10);
            }
            halfYear.push(`上下半年上半年：${formatDate(halfYear1Start)} - ${formatDate(halfYear1End)}`);
            let halfYear2StartYear = halfYear1End.getFullYear();
            let halfYear2Start = new Date(halfYear2StartYear, 6, 1);
            if (halfYear1End >= halfYear2Start) {
                halfYear2StartYear++;
                halfYear2Start = new Date(halfYear2StartYear, 6, 1);
            }
            const halfYear2End = new Date(halfYear2StartYear, 9, 10);
            halfYear.push(`上下半年下半年：${formatDate(halfYear2Start)} - ${formatDate(halfYear2End)}`);
        }

        resultHTML += `
            <table class="result-table">
                <tr><th>連續三個月</th><td>${months.join('<br>')}</td></tr>
                <tr><th>連續四季</th><td>${quarters.join('<br>')}</td></tr>
                <tr><th>上下半年</th><td>${halfYear.join('<br>')}</td></tr>
                <tr><th style="color: red;">解管時間</th><td style="color: red;">${releaseTime}</td></tr>
            </table>
        `;
    }

    // 慰勞假和服裝APP計算（僅在勾選志願役生效日期時計算）
    if (useVolunteerDate) {
        // 慰勞假計算
        resultHTML += '<h3>慰勞假計算結果</h3>';
        let totalSeniority = 0;
        if (isReenlist) {
            totalSeniority = 
                ((leaveYear - 1 - parseInt(reenlistYear)) * 12 + 12 - parseInt(reenlistMonth)) +
                ((parseInt(firstRetireYear) - parseInt(volunteerYear)) * 12 + (parseInt(firstRetireMonth) - parseInt(volunteerMonth)));
        } else {
            totalSeniority = (leaveYear - 1 - parseInt(volunteerYear)) * 12 + 12 - parseInt(volunteerMonth);
        }

        function getLeaveDays(seniority) {
            const years = seniority / 12;
            if (years >= 14) return 30;
            else if (years >= 9) return 28;
            else if (years >= 6) return 21;
            else if (years >= 3) return 14;
            else return 7;
        }
        let leaveDays = getLeaveDays(totalSeniority);

        const isFirstYear = leaveYear === parseInt(volunteerYear) + 1 && parseInt(volunteerMonth) > 1;
        const adat = Array(13).fill().map(() => Array(32).fill(1));
        let inServiceMonths = 12;

        if (isFirstYear) {
            inServiceMonths = 0;
            for (let i = 1; i <= 12; i++) {
                adat[i].fill(0);
                if (i >= parseInt(volunteerMonth)) {
                    const startDay = i === parseInt(volunteerMonth) ? parseInt(volunteerDay) : 1;
                    const daysInMonth = new Date(gregorianLeaveYear, i, 0).getDate();
                    for (let j = startDay; j <= daysInMonth; j++) {
                        adat[i][j] = 1;
                    }
                    inServiceMonths++;
                }
            }
        }

        if (isReenlist) {
            for (let i = 1; i <= 12; i++) {
                const daysInMonth = new Date(gregorianLeaveYear, i, 0).getDate();
                for (let j = 1; j <= daysInMonth; j++) {
                    const currentDate = new Date(gregorianLeaveYear, i - 1, j);
                    const retireDate = firstRetireDate;
                    const reenlistDate = reenlistDate;
                    if (currentDate >= retireDate && currentDate < reenlistDate) {
                        adat[i][j] = 0;
                    }
                }
            }
        }

        trainingDates.forEach(record => {
            if (record.start.getFullYear() === gregorianLeaveYear) {
                if (record.start.getMonth() === record.end.getMonth()) {
                    for (let j = record.start.getDate(); j <= record.end.getDate(); j++) {
                        adat[record.start.getMonth() + 1][j] = 0;
                    }
                } else {
                    for (let i = record.start.getMonth() + 1; i <= record.end.getMonth() + 1; i++) {
                        const startDay = i === record.start.getMonth() + 1 ? record.start.getDate() : 1;
                        const endDay = i === record.end.getMonth() + 1 ? record.end.getDate() : new Date(gregorianLeaveYear, i, 0).getDate();
                        for (let j = startDay; j <= endDay; j++) {
                            adat[i][j] = 0;
                        }
                    }
                }
            }
        });

        inServiceMonths = 0;
        const monthlyStatus = [];
        for (let i = 1; i <= 12; i++) {
            let isInService = false;
            const daysInMonth = new Date(gregorianLeaveYear, i, 0).getDate();
            for (let j = 1; j <= daysInMonth; j++) {
                if (adat[i][j] === 1) {
                    isInService = true;
                    inServiceMonths++;
                    break;
                }
            }
            monthlyStatus.push({ month: i, inService: isInService });
        }

        let actualLeaveDays = leaveDays * (inServiceMonths / 12);
        actualLeaveDays = Math.round(actualLeaveDays * 100) / 100;

        function roundHalfDay(days) {
            if (days % 1 > 0.5) {
                return Math.floor(days) + 1;
            } else if (days % 1 > 0) {
                return Math.floor(days) + 0.5;
            }
            return Math.floor(days);
        }
        actualLeaveDays = roundHalfDay(actualLeaveDays);

        // 計算慰勞補助費和應繳發票金額
        const { allowance, invoiceAmount } = calculateAllowance(actualLeaveDays);
        const allowanceChinese = numberToChinese(allowance);
        const invoiceAmountChinese = numberToChinese(invoiceAmount);

        // 計算服裝APP核配點數
        const clothingPoints = getClothingPoints(totalSeniority);

        resultHTML += `
            <table class="result-table">
                <tr><th>總年資</th><td>${(totalSeniority / 12).toFixed(2)} 年（${totalSeniority} 個月）</td></tr>
                <tr><th>應得慰勞假</th><td>${leaveDays} 天</td></tr>
                <tr><th>在職月數</th><td>${inServiceMonths} 個月</td></tr>
                <tr><th>實際慰勞假</th><td>${actualLeaveDays} 天</td></tr>
                <tr><th>休假補助費</th><td>${allowance} 元（${allowanceChinese}）</td></tr>
                <tr><th>應繳發票金額</th><td>${invoiceAmount} 元（${invoiceAmountChinese}）</td></tr>
                <tr><th>服裝APP年度核配點數</th><td>${clothingPoints} 點</td></tr>
                <tr><th>出生日期</th><td>${formatDate(birthDate)}</td></tr>
                <tr><th>年齡</th><td>${age} 歲</td></tr>
                <tr><th>性別</th><td>${gender === 'male' ? '男' : '女'}</td></tr>
                <tr><th>志願役生效日期</th><td>${formatDate(volunteerDate)}</td></tr>
                ${isReenlist ? `
                    <tr><th>再入營/復職日期</th><td>${formatDate(reenlistDate)}</td></tr>
                    <tr><th>第一次退伍/育嬰生效日期</th><td>${formatDate(firstRetireDate)}</td></tr>
                ` : ''}
            </table>
            <h4>每月在職狀態</h4>
            <ul class="list-group">
        `;
        monthlyStatus.forEach(status => {
            const className = status.inService ? 'list-group-item-success' : 'list-group-item-danger';
            const hand = status.inService ? '👍' : '👎';
            const text = status.inService ? `${status.month}月 在職 ${hand}` : `${status.month}月 不在職 ${hand}`;
            resultHTML += `<li class="list-group-item ${className}">${text}</li>`;
        });
        resultHTML += '</ul>';
        if (hasTraining && trainingDates.length > 0) {
            resultHTML += `
                <h4>受訓記錄</h4>
                <ul class="list-group">
            `;
            trainingDates.forEach(record => {
                resultHTML += `<li class="list-group-item">${formatDate(record.start)} 至 ${formatDate(record.end)}</li>`;
            });
            resultHTML += '</ul>';
        }
    }

    // 體能標準結果（始終顯示）
    resultHTML += `
        <h3>體能多元標準（${age} 歲，${gender === 'male' ? '上肢肌力（男）' : '腹部核心肌力（女）'}）</h3>
        <table class="result-table">
            <tr><th>項目</th><th>合格</th><th>優秀</th><th>傑出</th></tr>
    `;
    for (let test in fitnessStandards) {
        resultHTML += `
            <tr>
                <td>${test}</td>
                <td>${fitnessStandards[test].pass}</td>
                <td>${fitnessStandards[test].good}</td>
                <td>${fitnessStandards[test].excellent}</td>
            </tr>
        `;
    }
    resultHTML += '</table>';

    resultDiv.innerHTML = resultHTML;
}

// 初始化日期選項和一筆受訓記錄
document.addEventListener('DOMContentLoaded', () => {
    // 初始化慰休年度下拉選單（民國 112-118，對應西元 2023-2029）
    const leaveYearSelect = document.getElementById('leave-year');
    for (let year = 112; year <= 118; year++) {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        leaveYearSelect.appendChild(option);
    }

    // 初始化日期選項
    populateDateOptions(
        document.getElementById('birth-year'),
        document.getElementById('birth-month'),
        document.getElementById('birth-day'),
        65, 118
    );
    populateDateOptions(
        document.getElementById('volunteer-year'),
        document.getElementById('volunteer-month'),
        document.getElementById('volunteer-day'),
        80, 118
    );
    populateDateOptions(
        document.getElementById('transfer-year'),
        document.getElementById('transfer-month'),
        document.getElementById('transfer-day'),
        80, 118
    );
    populateDateOptions(
        document.getElementById('reenlist-year'),
        document.getElementById('reenlist-month'),
        document.getElementById('reenlist-day'),
        80, 118
    );
    populateDateOptions(
        document.getElementById('first-retire-year'),
        document.getElementById('first-retire-month'),
        document.getElementById('first-retire-day'),
        80, 118
    );

    // 初始化一筆受訓記錄
    addTrainingRecord();

    // 確保計算按鈕的事件監聽器正確綁定
    const calculateButton = document.querySelector('.button-group button[onclick="calculateAll()"]');
    if (calculateButton) {
        calculateButton.addEventListener('click', calculateAll);
    }
});

// 動態顯示再入營輸入欄位
document.getElementById('is-reenlist').addEventListener('change', function() {
    const reenlistDetails = document.getElementById('reenlist-details');
    reenlistDetails.style.display = this.checked ? 'block' : 'none';
});

// 動態顯示受訓記錄輸入欄位
document.getElementById('has-training').addEventListener('change', function() {
    const trainingSection = document.getElementById('training-section');
    trainingSection.style.display = this.checked ? 'block' : 'none';
});
