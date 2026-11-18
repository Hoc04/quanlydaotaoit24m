import { API_ENDPOINTS } from './config.js';

const PAGE_SIZE = 10;

const state = {
    schoolYears: [],
    semesters: [],
    courseSections: [],
    registrations: [],
    instructors: [],
    // Catalogs for dropdowns
    allSchoolYears: [],
    allSemesters: [],
    allCourseSections: [],
    allStudents: [],
    allCourses: [],
    allRooms: [],
    allLecturers: [],
    pages: {
        'school-years': 1,
        semesters: 1,
        'course-sections': 1,
        registrations: 1,
        instructors: 1,
    },
    filters: {},
    modal: { type: null, id: null },
};

const configs = {
    'school-years': {
        key: 'schoolYears',
        endpoint: API_ENDPOINTS.SCHOOL_YEARS,
        body: 'schoolYearBody',
        pagination: 'schoolYearPagination',
        message: 'schoolYearMessage',
        title: 'năm học',
    },
    semesters: {
        key: 'semesters',
        endpoint: API_ENDPOINTS.SEMESTERS,
        body: 'semesterBody',
        pagination: 'semesterPagination',
        message: 'semesterMessage',
        title: 'học kỳ',
    },
    'course-sections': {
        key: 'courseSections',
        endpoint: API_ENDPOINTS.COURSE_SECTIONS,
        body: 'courseSectionBody',
        pagination: 'courseSectionPagination',
        message: 'courseSectionMessage',
        title: 'lớp học phần',
    },
    registrations: {
        key: 'registrations',
        endpoint: API_ENDPOINTS.STUDENT_COURSE_SECTIONS,
        body: 'registrationBody',
        pagination: 'registrationPagination',
        message: 'registrationMessage',
        title: 'đăng ký học phần',
    },
    instructors: {
        key: 'instructors',
        endpoint: API_ENDPOINTS.COURSE_CLASS_INSTRUCTORS,
        body: 'instructorBody',
        pagination: 'instructorPagination',
        message: 'instructorMessage',
        title: 'phân công giảng viên',
    },
};

const escapeHtml = (value) =>
    String(value ?? '')
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;');

const formatDate = (value) => {
    if (!value) return '—';
    try {
        return new Intl.DateTimeFormat('vi-VN').format(new Date(value));
    } catch {
        return String(value).slice(0, 10);
    }
};

const formatCourseSectionLabel = (cs) => {
    if (!cs) return '—';
    if (cs.displayName) return cs.displayName;
    if (cs.display_name) return cs.display_name;
    const code = cs.code || 'LHP';
    const name = cs.name || cs.courseName || '';
    const sem = cs.semesterShortName || cs.semesterName || cs.semester?.name || '';
    return `[${code}] - ${name}${sem ? ` (${sem})` : ''}`;
};

const dateInput = (value) => (value ? String(value).slice(0, 10) : '');

const statusBadge = (active) =>
    active !== false
        ? '<span class="badge success">Đang hoạt động</span>'
        : '<span class="badge muted">Ngừng hoạt động</span>';

const openStatusBadge = (status) => {
    const st = String(status || 'Đang mở');
    const isClosed = st.toLowerCase().includes('đóng') || st.toLowerCase().includes('closed');
    return `<span class="badge ${isClosed ? 'closed' : 'open'}">${escapeHtml(st)}</span>`;
};

const learningStatusBadge = (status) => {
    const raw = String(status || 'Đang học').trim();
    const upper = raw.toUpperCase();
    if (upper === 'STUDYING' || raw.toLowerCase().includes('đang học')) {
        return '<span class="badge status-studying">Đang học</span>';
    }
    if (upper === 'REGISTERED' || raw.toLowerCase().includes('đã đăng ký')) {
        return '<span class="badge status-registered">Đã đăng ký</span>';
    }
    if (upper === 'COMPLETED' || raw.toLowerCase().includes('hoàn thành')) {
        return '<span class="badge status-completed">Hoàn thành</span>';
    }
    if (upper === 'CANCELLED' || raw.toLowerCase().includes('hủy')) {
        return '<span class="badge status-cancelled">Đã hủy</span>';
    }
    return `<span class="badge status">${escapeHtml(raw)}</span>`;
};

const showMessage = (id, message) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.textContent = message;
    el.hidden = false;
};

const clearMessage = (id) => {
    const el = document.getElementById(id);
    if (el) el.hidden = true;
};

let toastTimer = null;
function showToast(message, variant = 'success') {
    const banner = document.getElementById('toastBanner');
    if (!banner) return;
    banner.textContent = message;
    banner.className = `toast-banner ${variant}`;
    banner.hidden = false;
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
        banner.hidden = true;
    }, 3200);
}

async function request(url, options = {}) {
    const response = await fetch(url, {
        ...options,
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            ...(options.headers || {}),
        },
    });
    if (!response.ok) {
        let detail = `HTTP ${response.status}`;
        try {
            const body = await response.json();
            detail = body.message || body.error || detail;
        } catch {
            // Ignore non-JSON error body
        }
        throw new Error(detail);
    }
    return response.status === 204 ? null : response.json();
}

function updateSummary() {
    const summaryPairs = [
        ['schoolYear', state.schoolYears],
        ['semester', state.semesters],
        ['courseSection', state.courseSections],
        ['registration', state.registrations],
        ['instructor', state.instructors],
    ];
    for (const [id, items] of summaryPairs) {
        const totalEl = document.getElementById(`${id}Count`);
        const activeEl = document.getElementById(`active${id[0].toUpperCase()}${id.slice(1)}Count`);
        if (totalEl) totalEl.textContent = items.length;
        if (activeEl) activeEl.textContent = items.filter((item) => item.isActive !== false).length;
    }
}

function actionButtons(type, item) {
    const active = item.isActive !== false;
    return `<div class="row-actions">
        <button type="button" class="icon-button edit-action" data-type="${type}" data-id="${item.id}" title="Chỉnh sửa" aria-label="Sửa">✎</button>
        <button type="button" class="icon-button warn toggle-action" data-type="${type}" data-id="${item.id}" title="${active ? 'Chuyển sang Ngừng hoạt động' : 'Kích hoạt Đang hoạt động'}" aria-label="Đổi trạng thái">${active ? '◉' : '○'}</button>
        <button type="button" class="icon-button danger delete-action" data-type="${type}" data-id="${item.id}" title="Xóa mềm (Ngừng hoạt động)" aria-label="Xóa mềm">⌫</button>
    </div>`;
}

function pageItems(type) {
    const config = configs[type];
    const items = state[config.key] || [];
    const start = (state.pages[type] - 1) * PAGE_SIZE;
    return items.slice(start, start + PAGE_SIZE);
}

function renderPagination(type) {
    const config = configs[type];
    const items = state[config.key] || [];
    const total = Math.ceil(items.length / PAGE_SIZE);
    const container = document.getElementById(config.pagination);
    if (!container) return;
    if (total <= 1) {
        container.innerHTML = '';
        return;
    }
    const current = state.pages[type];
    let html = `<button type="button" class="page-button" data-page-type="${type}" data-page="${current - 1}" ${current === 1 ? 'disabled' : ''}>‹</button>`;
    const maxButtons = 7;
    let startPage = Math.max(1, current - 3);
    let endPage = Math.min(total, startPage + maxButtons - 1);
    if (endPage - startPage < maxButtons - 1) {
        startPage = Math.max(1, endPage - maxButtons + 1);
    }
    for (let page = startPage; page <= endPage; page += 1) {
        html += `<button type="button" class="page-button ${page === current ? 'active' : ''}" data-page-type="${type}" data-page="${page}">${page}</button>`;
    }
    html += `<button type="button" class="page-button" data-page-type="${type}" data-page="${current + 1}" ${current === total ? 'disabled' : ''}>›</button>`;
    container.innerHTML = html;
}

// TAB 1 RENDERER
function renderSchoolYears() {
    const items = pageItems('school-years');
    document.getElementById('schoolYearBody').innerHTML = items.length
        ? items
              .map(
                  (item) => `<tr>
            <td><strong>${escapeHtml(item.code || '—')}</strong></td>
            <td>${escapeHtml(item.name || '—')}</td>
            <td>${formatDate(item.startDate)}</td>
            <td>${formatDate(item.endDate)}</td>
            <td>${escapeHtml(item.description || item.note || '—')}</td>
            <td>${statusBadge(item.isActive)}</td>
            <td>${actionButtons('school-years', item)}</td>
        </tr>`
              )
              .join('')
        : '<tr><td colspan="7" class="empty">Không có dữ liệu năm học phù hợp.</td></tr>';
    renderPagination('school-years');
}

// TAB 2 RENDERER
function renderSemesters() {
    const items = pageItems('semesters');
    document.getElementById('semesterBody').innerHTML = items.length
        ? items
              .map(
                  (item) => `<tr>
            <td><strong>${escapeHtml(item.code || '—')}</strong></td>
            <td>${escapeHtml(item.name || '—')}</td>
            <td><span class="badge status">${escapeHtml(item.schoolYearName || item.schoolYear?.name || '—')}</span></td>
            <td>${formatDate(item.startDate)}</td>
            <td>${formatDate(item.endDate)}</td>
            <td>${statusBadge(item.isActive)}</td>
            <td>${actionButtons('semesters', item)}</td>
        </tr>`
              )
              .join('')
        : '<tr><td colspan="7" class="empty">Không có dữ liệu học kỳ phù hợp.</td></tr>';
    renderPagination('semesters');
}

// TAB 3 RENDERER
function renderCourseSections() {
    const items = pageItems('course-sections');
    document.getElementById('courseSectionBody').innerHTML = items.length
        ? items
              .map(
                  (item) => `<tr>
            <td><strong>${escapeHtml(item.code || '—')}</strong></td>
            <td>
                <strong>${escapeHtml(item.name || '—')}</strong>
                <small class="sub-cell">${escapeHtml(item.classType || 'Lý thuyết')}</small>
            </td>
            <td>${escapeHtml(item.courseName || item.name || '—')}</td>
            <td>${escapeHtml(item.semesterName || item.semester?.name || '—')}</td>
            <td>${escapeHtml(item.lecturerName || 'Chưa phân công')}</td>
            <td>${escapeHtml(item.roomName || 'Chưa xếp phòng')}</td>
            <td><span class="badge capacity">${Number(item.currentStudents || 0)} / ${Number(item.maxStudents || 50)}</span></td>
            <td>${openStatusBadge(item.status)}</td>
            <td>${statusBadge(item.isActive)}</td>
            <td>${actionButtons('course-sections', item)}</td>
        </tr>`
              )
              .join('')
        : '<tr><td colspan="10" class="empty">Không có dữ liệu lớp học phần phù hợp.</td></tr>';
    renderPagination('course-sections');
}

// TAB 4 RENDERER (GỒM KHỐI TRA CỨU SV THEO LỚP HỌC PHẦN + BẢNG TỔNG HỢP)
function renderRegistrations() {
    const items = pageItems('registrations');
    document.getElementById('registrationBody').innerHTML = items.length
        ? items
              .map((item) => {
                  const fullLabel =
                      item.courseSectionDisplayName ||
                      (item.courseSection ? formatCourseSectionLabel(item.courseSection) : `[${item.courseSectionCode || 'LHP'}] - ${item.courseSectionName || '—'}`);
                  const semLabel = item.courseSectionSemesterName || item.courseSection?.semester?.name || '';
                  return `<tr>
            <td><strong>${escapeHtml(item.studentCode || '—')}</strong></td>
            <td><strong>${escapeHtml(item.studentName || 'Chưa rõ tên')}</strong></td>
            <td>
                <strong>${escapeHtml(fullLabel)}</strong>
                ${semLabel ? `<small class="sub-cell">Học kỳ: ${escapeHtml(semLabel)}</small>` : ''}
            </td>
            <td>${formatDate(item.registrationDate)}</td>
            <td><span class="badge role">${escapeHtml(item.registrationType || 'Học lần đầu')}</span></td>
            <td>${learningStatusBadge(item.status)}</td>
            <td>${statusBadge(item.isActive)}</td>
            <td>${actionButtons('registrations', item)}</td>
        </tr>`;
              })
              .join('')
        : '<tr><td colspan="8" class="empty">Không có dữ liệu đăng ký học phần phù hợp.</td></tr>';
    renderPagination('registrations');
}

async function renderCourseSectionLookup() {
    const select = document.getElementById('lookupCourseSectionSelect');
    const body = document.getElementById('lookupStudentBody');
    const highlightEl = document.getElementById('lookupStudyingHighlight');
    const metaEl = document.getElementById('lookupSectionMeta');
    if (!select || !body) return;

    const selectedCsId = select.value;
    if (!selectedCsId) {
        if (highlightEl) highlightEl.textContent = '0 / -- sinh viên';
        if (metaEl) metaEl.textContent = 'Vui lòng chọn một lớp học phần từ danh sách.';
        body.innerHTML = '<tr><td colspan="7" class="empty">Vui lòng chọn một lớp học phần để xem danh sách sinh viên.</td></tr>';
        return;
    }

    try {
        const data = await request(`${API_ENDPOINTS.COURSE_REGISTRATIONS}/by-section/${selectedCsId}`);
        const secInfo = data.section_info || {};
        const maxStudents = secInfo.max_students ?? secInfo.maxStudents ?? 50;
        const totalStudying = data.total_studying ?? data.totalStudying ?? 0;
        const totalRegistered = data.total_registered ?? data.totalRegistered ?? 0;
        const students = Array.isArray(data.students) ? data.students : [];

        if (highlightEl) {
            highlightEl.textContent = `${totalStudying} / ${maxStudents} sinh viên`;
        }
        if (metaEl) {
            metaEl.textContent = `${secInfo.display_name || secInfo.name || ''} • Giảng viên: ${secInfo.lecturer_name || 'Chưa phân công'} • Tổng đăng ký: ${totalRegistered}`;
        }

        if (!students.length) {
            body.innerHTML = '<tr><td colspan="7" class="empty">Lớp học phần này hiện chưa có sinh viên đăng ký</td></tr>';
            return;
        }

        body.innerHTML = students
            .map(
                (st, idx) => `<tr>
                <td><strong>${idx + 1}</strong></td>
                <td><strong>${escapeHtml(st.student_code || st.studentCode || '—')}</strong></td>
                <td>
                    <strong>${escapeHtml(st.full_name || st.studentName || '—')}</strong>
                    ${st.email && st.email !== '—' ? `<small class="sub-cell">${escapeHtml(st.email)}</small>` : ''}
                </td>
                <td>${formatDate(st.registered_at || st.registrationDate)}</td>
                <td><span class="badge role">${escapeHtml(st.registration_type || st.registrationType || 'Học lần đầu')}</span></td>
                <td>${learningStatusBadge(st.status)}</td>
                <td>${statusBadge(st.is_active ?? st.isActive)}</td>
            </tr>`
            )
            .join('');
    } catch (error) {
        body.innerHTML = `<tr><td colspan="7" class="empty">Không thể tải dữ liệu lớp học phần: ${escapeHtml(error.message)}</td></tr>`;
    }
}

// TAB 5 RENDERER
function renderInstructors() {
    const items = pageItems('instructors');
    document.getElementById('instructorBody').innerHTML = items.length
        ? items
              .map(
                  (item) => `<tr>
            <td>
                <strong>${escapeHtml(item.employeeName || 'Chưa rõ tên')}</strong>
            </td>
            <td>
                <strong>${escapeHtml(item.courseClassName || item.courseSection?.name || '—')}</strong>
                <small class="sub-cell">${escapeHtml(item.courseSectionCode || item.courseSection?.code || '')}</small>
            </td>
            <td><span class="badge role">${escapeHtml(item.role || 'Giảng viên chính')}</span></td>
            <td><strong>${Number(item.hours || 45)} tiết</strong></td>
            <td>${formatDate(item.createdAt)}</td>
            <td>${statusBadge(item.isActive)}</td>
            <td>${actionButtons('instructors', item)}</td>
        </tr>`
              )
              .join('')
        : '<tr><td colspan="7" class="empty">Không có dữ liệu phân công giảng viên phù hợp.</td></tr>';
    renderPagination('instructors');
}

const renderers = {
    'school-years': renderSchoolYears,
    semesters: renderSemesters,
    'course-sections': renderCourseSections,
    registrations: renderRegistrations,
    instructors: renderInstructors,
};

async function loadCatalogs() {
    try {
        const [schoolYears, semesters, courseSections, students, courses, rooms, lecturers] = await Promise.all([
            request(API_ENDPOINTS.SCHOOL_YEARS).catch(() => []),
            request(API_ENDPOINTS.SEMESTERS).catch(() => []),
            request(API_ENDPOINTS.COURSE_SECTIONS).catch(() => []),
            request(API_ENDPOINTS.STUDENTS).catch(() => []),
            request(API_ENDPOINTS.CATALOG_COURSES).catch(() => []),
            request(API_ENDPOINTS.CATALOG_ROOMS).catch(() => []),
            request(API_ENDPOINTS.CATALOG_LECTURERS).catch(() => []),
        ]);
        state.allSchoolYears = schoolYears || [];
        state.allSemesters = semesters || [];
        state.allCourseSections = courseSections || [];
        state.allStudents = students || [];
        state.allCourses = courses || [];
        state.allRooms = rooms || [];
        state.allLecturers = lecturers || [];
        populateFilterDropdowns();
    } catch {
        // Non-fatal
    }
}

function populateFilterDropdowns() {
    // 1. Semester filter by SchoolYear
    const syFilter = document.getElementById('semesterSchoolYearFilter');
    if (syFilter) {
        const current = syFilter.value;
        syFilter.innerHTML =
            '<option value="">Tất cả năm học</option>' +
            state.allSchoolYears
                .map((sy) => `<option value="${sy.id}">${escapeHtml(sy.code)} - ${escapeHtml(sy.name)}</option>`)
                .join('');
        syFilter.value = current;
    }

    // 2. CourseSection filter by Semester
    const semFilter = document.getElementById('courseSectionSemesterFilter');
    if (semFilter) {
        const current = semFilter.value;
        semFilter.innerHTML =
            '<option value="">Tất cả học kỳ</option>' +
            state.allSemesters
                .map((sem) => `<option value="${sem.id}">${escapeHtml(sem.code)} - ${escapeHtml(sem.name)}</option>`)
                .join('');
        semFilter.value = current;
    }

    // 3. Registration lookup & filter by CourseSection
    const lookupSelect = document.getElementById('lookupCourseSectionSelect');
    const regCsFilter = document.getElementById('registrationCourseSectionFilter');

    // Prioritize course sections that already have students registered so the user sees them at the top
    const sortedCs = [...state.allCourseSections].sort((a, b) => (b.currentStudents || 0) - (a.currentStudents || 0));

    if (lookupSelect) {
        const current = lookupSelect.value;
        lookupSelect.innerHTML =
            '<option value="">-- Chọn lớp học phần để tra cứu --</option>' +
            sortedCs
                .map(
                    (cs) =>
                        `<option value="${cs.id}">${escapeHtml(formatCourseSectionLabel(cs))} — Sĩ số: ${cs.currentStudents || 0}/${cs.maxStudents || 50}</option>`
                )
                .join('');
        if (current) {
            lookupSelect.value = current;
        } else if (sortedCs.length > 0) {
            // Auto-select the first class with students so the lookup table is immediately useful
            const firstWithStudents = sortedCs.find((c) => (c.currentStudents || 0) > 0) || sortedCs[0];
            if (firstWithStudents) lookupSelect.value = firstWithStudents.id;
        }
        renderCourseSectionLookup();
    }

    if (regCsFilter) {
        const current = regCsFilter.value;
        regCsFilter.innerHTML =
            '<option value="">Tất cả lớp học phần</option>' +
            sortedCs
                .map((cs) => `<option value="${cs.id}">${escapeHtml(formatCourseSectionLabel(cs))}</option>`)
                .join('');
        regCsFilter.value = current;
    }
}

async function load(type) {
    const config = configs[type];
    clearMessage(config.message);
    const params = new URLSearchParams(state.filters[type] || {});
    try {
        const url = `${config.endpoint}${params.toString() ? `?${params}` : ''}`;
        state[config.key] = await request(url);
        state.pages[type] = 1;
        renderers[type]();
        updateSummary();
    } catch (error) {
        showMessage(config.message, `Không thể tải ${config.title}: ${error.message}`);
    }
}

function collectFilters(type) {
    if (type === 'school-years') {
        state.filters[type] = {
            keyword: document.getElementById('schoolYearKeyword').value.trim(),
            isActive: document.getElementById('schoolYearStatus').value,
        };
    }
    if (type === 'semesters') {
        state.filters[type] = {
            keyword: document.getElementById('semesterKeyword').value.trim(),
            schoolYearId: document.getElementById('semesterSchoolYearFilter').value,
            isActive: document.getElementById('semesterStatus').value,
        };
    }
    if (type === 'course-sections') {
        state.filters[type] = {
            keyword: document.getElementById('courseSectionKeyword').value.trim(),
            semesterId: document.getElementById('courseSectionSemesterFilter').value,
            status: document.getElementById('courseSectionOpenStatus').value,
            isActive: document.getElementById('courseSectionStatus').value,
        };
    }
    if (type === 'registrations') {
        state.filters[type] = {
            courseSectionId: document.getElementById('registrationCourseSectionFilter').value,
            status: document.getElementById('registrationStatus').value,
            isActive: document.getElementById('registrationActiveStatus').value,
        };
    }
    if (type === 'instructors') {
        state.filters[type] = {
            employeeName: document.getElementById('instructorEmployeeName').value.trim(),
            courseClassName: document.getElementById('instructorCourseClassName').value.trim(),
            role: document.getElementById('instructorRole').value,
            isActive: document.getElementById('instructorStatus').value,
        };
    }
    Object.keys(state.filters[type] || {}).forEach((key) => {
        if (!state.filters[type][key]) delete state.filters[type][key];
    });
}

function fieldsFor(type, item = {}) {
    const isActiveVal = item.isActive !== false ? 'true' : 'false';

    if (type === 'school-years') {
        return `
            <label>Mã năm học *
                <input name="code" required maxlength="100" placeholder="VD: 2026-2027" value="${escapeHtml(item.code || '')}">
            </label>
            <label>Tên năm học *
                <input name="name" required maxlength="255" placeholder="VD: Năm học 2026-2027" value="${escapeHtml(item.name || '')}">
            </label>
            <label>Ngày bắt đầu *
                <input name="startDate" type="date" required value="${dateInput(item.startDate)}">
            </label>
            <label>Ngày kết thúc *
                <input name="endDate" type="date" required value="${dateInput(item.endDate)}">
            </label>
            <label>Mô tả / Ghi chú
                <input name="description" maxlength="255" placeholder="Mô tả năm học" value="${escapeHtml(item.description || item.note || '')}">
            </label>
            <label>Trạng thái hoạt động
                <select name="isActive">
                    <option value="true" ${isActiveVal === 'true' ? 'selected' : ''}>Đang hoạt động</option>
                    <option value="false" ${isActiveVal === 'false' ? 'selected' : ''}>Ngừng hoạt động</option>
                </select>
            </label>`;
    }

    if (type === 'semesters') {
        const selectedSyId = item.schoolYearId || item.schoolYear?.id || '';
        const syOptions = state.allSchoolYears
            .map(
                (sy) =>
                    `<option value="${sy.id}" ${String(sy.id) === String(selectedSyId) ? 'selected' : ''}>${escapeHtml(sy.code)} — ${escapeHtml(sy.name)}</option>`
            )
            .join('');
        return `
            <label>Chọn Năm học *
                <select name="schoolYearId" required>
                    <option value="">-- Chọn năm học --</option>
                    ${syOptions}
                </select>
            </label>
            <label>Mã học kỳ *
                <input name="code" required maxlength="100" placeholder="VD: 20261, 20262, 20263" value="${escapeHtml(item.code || '')}">
            </label>
            <label class="full-width">Tên học kỳ (HK1, HK2, HK Hè) *
                <input name="name" required maxlength="255" list="semesterNameSuggestions" placeholder="VD: Học kỳ 1 năm học 2026-2027" value="${escapeHtml(item.name || '')}">
                <datalist id="semesterNameSuggestions">
                    <option value="Học kỳ 1">
                    <option value="Học kỳ 2">
                    <option value="Học kỳ Hè">
                </datalist>
            </label>
            <label>Ngày bắt đầu *
                <input name="startDate" type="date" required value="${dateInput(item.startDate)}">
            </label>
            <label>Ngày kết thúc *
                <input name="endDate" type="date" required value="${dateInput(item.endDate)}">
            </label>
            <label class="full-width">Trạng thái hoạt động
                <select name="isActive">
                    <option value="true" ${isActiveVal === 'true' ? 'selected' : ''}>Đang hoạt động</option>
                    <option value="false" ${isActiveVal === 'false' ? 'selected' : ''}>Ngừng hoạt động</option>
                </select>
            </label>`;
    }

    if (type === 'course-sections') {
        const selectedCourseId = item.courseId || '';
        const selectedSemId = item.semesterId || item.semester?.id || '';
        const selectedLecturerId = item.lecturerId || '';
        const selectedRoomId = item.roomId || '';
        const courseOptions = state.allCourses
            .map(
                (c) =>
                    `<option value="${c.id}" ${String(c.id) === String(selectedCourseId) ? 'selected' : ''}>${escapeHtml(c.code)} — ${escapeHtml(c.name)}</option>`
            )
            .join('');
        const semOptions = state.allSemesters
            .map(
                (s) =>
                    `<option value="${s.id}" ${String(s.id) === String(selectedSemId) ? 'selected' : ''}>${escapeHtml(s.code)} — ${escapeHtml(s.name)}</option>`
            )
            .join('');
        const lecturerOptions = state.allLecturers
            .map(
                (l) =>
                    `<option value="${l.id}" ${String(l.id) === String(selectedLecturerId) ? 'selected' : ''}>${escapeHtml(l.code)} — ${escapeHtml(l.fullName)}</option>`
            )
            .join('');
        const roomOptions = state.allRooms
            .map(
                (r) =>
                    `<option value="${r.id}" ${String(r.id) === String(selectedRoomId) ? 'selected' : ''}>${escapeHtml(r.code)} — ${escapeHtml(r.name)} (Sức chứa: ${r.capacity || 60})</option>`
            )
            .join('');
        const openSt = item.status || 'Đang mở';

        return `
            <label>Mã lớp học phần *
                <input name="code" required maxlength="100" placeholder="VD: IT301-2605" value="${escapeHtml(item.code || '')}">
            </label>
            <label>Tên lớp học phần *
                <input name="name" required maxlength="255" placeholder="VD: Phân tích & thiết kế hệ thống - Lớp 05" value="${escapeHtml(item.name || '')}">
            </label>
            <label>Học phần *
                <select name="courseId" required>
                    <option value="">-- Chọn học phần --</option>
                    ${courseOptions}
                </select>
            </label>
            <label>Học kỳ *
                <select name="semesterId" required>
                    <option value="">-- Chọn học kỳ --</option>
                    ${semOptions}
                </select>
            </label>
            <label>Giảng viên phụ trách
                <select name="lecturerId">
                    <option value="">-- Chọn giảng viên --</option>
                    ${lecturerOptions}
                </select>
            </label>
            <label>Phòng học
                <select name="roomId">
                    <option value="">-- Chọn phòng học --</option>
                    ${roomOptions}
                </select>
            </label>
            <label>Sĩ số tối đa *
                <input name="maxStudents" type="number" min="1" max="500" required value="${Number(item.maxStudents || 60)}">
            </label>
            <label>Loại lớp học phần
                <select name="classType">
                    <option value="Lý thuyết" ${item.classType === 'Lý thuyết' ? 'selected' : ''}>Lý thuyết</option>
                    <option value="Thực hành" ${item.classType === 'Thực hành' ? 'selected' : ''}>Thực hành</option>
                    <option value="Đồ án" ${item.classType === 'Đồ án' ? 'selected' : ''}>Đồ án</option>
                </select>
            </label>
            <label>Trạng thái mở lớp
                <select name="status">
                    <option value="Đang mở" ${openSt === 'Đang mở' ? 'selected' : ''}>Đang mở</option>
                    <option value="Đã đóng" ${openSt === 'Đã đóng' ? 'selected' : ''}>Đã đóng</option>
                </select>
            </label>
            <label>Trạng thái hoạt động
                <select name="isActive">
                    <option value="true" ${isActiveVal === 'true' ? 'selected' : ''}>Đang hoạt động</option>
                    <option value="false" ${isActiveVal === 'false' ? 'selected' : ''}>Ngừng hoạt động</option>
                </select>
            </label>`;
    }

    if (type === 'registrations') {
        const selectedStudentId = item.studentId || '';
        const selectedCsId = item.courseSectionId || item.courseSection?.id || '';
        const studentOptions = state.allStudents
            .map(
                (st) =>
                    `<option value="${st.id}" ${String(st.id) === String(selectedStudentId) ? 'selected' : ''}>${escapeHtml(st.studentCode)} — ${escapeHtml(st.fullName)} (${escapeHtml(st.className || 'IT24M')})</option>`
            )
            .join('');
        const csOptions = state.allCourseSections
            .map(
                (cs) =>
                    `<option value="${cs.id}" ${String(cs.id) === String(selectedCsId) ? 'selected' : ''}>${escapeHtml(formatCourseSectionLabel(cs))} (Sĩ số: ${cs.currentStudents || 0}/${cs.maxStudents || 50})</option>`
            )
            .join('');
        const regType = item.registrationType || 'Học lần đầu';
        const regStatus = item.status === 'REGISTERED' ? 'Đã đăng ký' : item.status === 'STUDYING' ? 'Đang học' : item.status || 'Đang học';

        return `
            <label class="full-width">Sinh viên *
                <select name="studentId" required>
                    <option value="">-- Chọn sinh viên --</option>
                    ${studentOptions}
                </select>
            </label>
            <label class="full-width">Lớp học phần *
                <select name="courseSectionId" required>
                    <option value="">-- Chọn lớp học phần --</option>
                    ${csOptions}
                </select>
            </label>
            <label>Loại đăng ký *
                <select name="registrationType">
                    <option value="Học lần đầu" ${regType === 'Học lần đầu' ? 'selected' : ''}>Học lần đầu</option>
                    <option value="Học thay thế" ${regType === 'Học thay thế' ? 'selected' : ''}>Học thay thế</option>
                </select>
            </label>
            <label>Trạng thái học tập *
                <select name="status">
                    <option value="Đang học" ${regStatus === 'Đang học' ? 'selected' : ''}>Đang học</option>
                    <option value="Đã đăng ký" ${regStatus === 'Đã đăng ký' ? 'selected' : ''}>Đã đăng ký</option>
                </select>
            </label>
            <label>Trạng thái hoạt động
                <select name="isActive">
                    <option value="true" ${isActiveVal === 'true' ? 'selected' : ''}>Đang hoạt động</option>
                    <option value="false" ${isActiveVal === 'false' ? 'selected' : ''}>Ngừng hoạt động</option>
                </select>
            </label>
            <label>Ghi chú
                <input name="note" maxlength="255" placeholder="Ghi chú đăng ký" value="${escapeHtml(item.note || '')}">
            </label>`;
    }

    // Tab 5: Instructors
    const selectedEmpId = item.employeeId || item.lecturerId || '';
    const selectedClassId = item.courseClassId || item.courseSection?.id || '';
    const lecturerOptions = state.allLecturers
        .map(
            (l) =>
                `<option value="${l.id}" ${String(l.id) === String(selectedEmpId) ? 'selected' : ''}>${escapeHtml(l.code)} — ${escapeHtml(l.fullName)}</option>`
        )
        .join('');
    const csOptions = state.allCourseSections
        .map(
            (cs) =>
                `<option value="${cs.id}" ${String(cs.id) === String(selectedClassId) ? 'selected' : ''}>${escapeHtml(formatCourseSectionLabel(cs))}</option>`
        )
        .join('');
    const roleVal = item.role || 'Giảng viên chính';

    return `
        <label class="full-width">Giảng viên *
            <select name="employeeId" required>
                <option value="">-- Chọn giảng viên --</option>
                ${lecturerOptions}
            </select>
        </label>
        <label class="full-width">Lớp học phần *
            <select name="courseClassId" required>
                <option value="">-- Chọn lớp học phần --</option>
                ${csOptions}
            </select>
        </label>
        <label>Vai trò giảng dạy *
            <select name="role">
                <option value="Giảng viên chính" ${roleVal === 'Giảng viên chính' ? 'selected' : ''}>Giảng viên chính</option>
                <option value="Trợ giảng" ${roleVal === 'Trợ giảng' ? 'selected' : ''}>Trợ giảng</option>
            </select>
        </label>
        <label>Số tiết phân công *
            <input name="hours" type="number" min="1" max="300" required value="${Number(item.hours || 45)}">
        </label>
        <label class="full-width">Trạng thái phân công
            <select name="isActive">
                <option value="true" ${isActiveVal === 'true' ? 'selected' : ''}>Đang hoạt động</option>
                <option value="false" ${isActiveVal === 'false' ? 'selected' : ''}>Ngừng hoạt động</option>
            </select>
        </label>`;
}

function openModal(type, item = null) {
    state.modal = { type, id: item?.id || null };
    document.getElementById('modalTitle').textContent = `${item ? 'Chỉnh sửa' : 'Thêm mới'} ${configs[type].title}`;
    document.getElementById('modalFields').innerHTML = fieldsFor(type, item || {});
    document.getElementById('modalMessage').hidden = true;
    document.getElementById('recordModal').hidden = false;
}

function closeModal() {
    document.getElementById('recordModal').hidden = true;
}

async function saveModal(event) {
    event.preventDefault();
    const { type, id } = state.modal;
    const formData = new FormData(event.currentTarget);
    const payload = Object.fromEntries(formData.entries());

    // Client-side validation for startDate < endDate
    if (payload.startDate && payload.endDate && payload.startDate >= payload.endDate) {
        const msg = document.getElementById('modalMessage');
        msg.textContent = 'Lỗi dữ liệu: Ngày bắt đầu phải nhỏ hơn ngày kết thúc!';
        msg.hidden = false;
        return;
    }

    if (payload.isActive !== undefined) {
        payload.isActive = payload.isActive === 'true';
    }
    if (payload.maxStudents !== undefined) {
        payload.maxStudents = Number(payload.maxStudents);
    }
    if (payload.hours !== undefined) {
        payload.hours = Number(payload.hours);
    }

    ['schoolYearId', 'semesterId', 'courseId', 'lecturerId', 'roomId', 'studentId', 'courseSectionId', 'employeeId', 'courseClassId', 'startDate', 'endDate'].forEach(
        (key) => {
            if (payload[key] === '') delete payload[key];
        }
    );

    try {
        await request(id ? `${configs[type].endpoint}/${id}` : configs[type].endpoint, {
            method: id ? 'PUT' : 'POST',
            body: JSON.stringify(payload),
        });
        closeModal();
        showToast(`Đã lưu ${configs[type].title} thành công!`);
        await loadCatalogs();
        await load(type);
        if (type === 'registrations' || type === 'instructors') {
            await load('course-sections');
        }
    } catch (error) {
        const message = document.getElementById('modalMessage');
        message.textContent = `Không thể lưu dữ liệu: ${error.message}`;
        message.hidden = false;
    }
}

async function deleteItem(type, id) {
    if (!window.confirm(`Bạn có chắc muốn xóa mềm (ngừng hoạt động) ${configs[type].title} này không?`)) return;
    try {
        await request(`${configs[type].endpoint}/${id}`, { method: 'DELETE' });
        showToast(`Đã xóa mềm ${configs[type].title}.`);
        await loadCatalogs();
        await load(type);
        if (type === 'registrations') await load('course-sections');
    } catch (error) {
        showMessage(configs[type].message, `Không thể xóa: ${error.message}`);
    }
}

async function toggleItem(type, id) {
    const item = state[configs[type].key].find((record) => String(record.id) === String(id));
    if (!item) return;
    const nextState = !(item.isActive !== false);
    try {
        await request(`${configs[type].endpoint}/${id}/status?isActive=${nextState}`, { method: 'PATCH' });
        showToast(`Đã chuyển trạng thái sang: ${nextState ? 'Đang hoạt động' : 'Ngừng hoạt động'}`);
        await load(type);
    } catch (error) {
        showMessage(configs[type].message, `Không thể đổi trạng thái: ${error.message}`);
    }
}

function setupTabs() {
    document.querySelectorAll('.tab-button').forEach((button) =>
        button.addEventListener('click', () => {
            document.querySelectorAll('.tab-button').forEach((item) => item.classList.remove('active'));
            document.querySelectorAll('.data-panel').forEach((panel) => {
                panel.hidden = true;
            });
            button.classList.add('active');
            const target = document.getElementById(`tab-${button.dataset.tab}`);
            if (target) target.hidden = false;
        })
    );
}

async function refreshAll() {
    await loadCatalogs();
    await Promise.all(Object.keys(configs).map((type) => load(type)));
}

document.addEventListener('DOMContentLoaded', async () => {
    setupTabs();

    document.getElementById('refreshAllBtn')?.addEventListener('click', async () => {
        await refreshAll();
        showToast('Đã làm mới toàn bộ dữ liệu!');
    });

    document.querySelectorAll('.add-button').forEach((button) =>
        button.addEventListener('click', () => openModal(button.dataset.create))
    );
    document.querySelectorAll('[data-close-modal]').forEach((button) =>
        button.addEventListener('click', closeModal)
    );
    document.getElementById('recordModal').addEventListener('click', (event) => {
        if (event.target.id === 'recordModal') closeModal();
    });
    document.getElementById('recordForm').addEventListener('submit', saveModal);

    // Search buttons
    document.getElementById('schoolYearSearch').addEventListener('click', () => {
        collectFilters('school-years');
        load('school-years');
    });
    document.getElementById('semesterSearch').addEventListener('click', () => {
        collectFilters('semesters');
        load('semesters');
    });
    document.getElementById('courseSectionSearch').addEventListener('click', () => {
        collectFilters('course-sections');
        load('course-sections');
    });
    document.getElementById('registrationSearch').addEventListener('click', () => {
        collectFilters('registrations');
        load('registrations');
    });
    document.getElementById('instructorSearch').addEventListener('click', () => {
        collectFilters('instructors');
        load('instructors');
    });

    // Course section lookup dropdown listener in Tab 4
    document.getElementById('lookupCourseSectionSelect')?.addEventListener('change', () => {
        renderCourseSectionLookup();
    });

    document.addEventListener('click', (event) => {
        const button = event.target.closest('button');
        if (!button) return;
        if (button.classList.contains('edit-action')) {
            const type = button.dataset.type;
            const record = state[configs[type].key].find((item) => String(item.id) === String(button.dataset.id));
            openModal(type, record);
        }
        if (button.classList.contains('delete-action')) {
            deleteItem(button.dataset.type, button.dataset.id);
        }
        if (button.classList.contains('toggle-action')) {
            toggleItem(button.dataset.type, button.dataset.id);
        }
        if (button.classList.contains('page-button') && !button.disabled) {
            const pType = button.dataset.pageType;
            state.pages[pType] = Number(button.dataset.page);
            renderers[pType]();
        }
    });

    await refreshAll();
});
