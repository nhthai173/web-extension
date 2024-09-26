const HideList = [
    64, 	// MẠCH ĐIỆN TỬ
    16, 	// LINH KIỆN ĐIỆN TỬ
    66, 	// KỸ THUẬT XUNG SỐ
    78, 	// LÝ THUYẾT MẠCH
    167, 	// THIẾT KẾ MẠCH ĐIỆN TỬ ALTIUM
    50, 	// Kiến trúc máy tính
    198, 	// Kỹ thuật vi xử lý/ Vi điều khiển
    181, 	// Nhập môn lập trình
    200, 	// Cơ sở mạng
    // 240, 	// Nhập môn Internet of Things
    // 224, 	// Công nghệ tính toán mềm
    204, 	// Cảm biến và thiết bị chấp hành
    203, 	// Nhập môn trí tuệ nhân tạo
    195, 	// THI CUỐI KỲ HỌC KỲ 1 NĂM HỌC 21-22
    187, 	// THI GIỮA KỲ HỌC KỲ 1 NĂM HỌC 21-22
    179, 	// GVCN lớp DHIOT17
    178, 	// Toán chuyên đề trí tuệ nhân tạo
    // 173, 	// Điều khiển thông minh
    87, 	// Nhập môn công tác kỹ sư (Ngành AIOT)
    73, 	// Thiết kế mạch điện tử công suất - 2102520
    30, 	// Điện tử công suất
    // 69, 	// Cơ sở kỹ thuật tự động - 2102480
    // 100, 	// Kỹ thuật điều khiển tự động
    // 31, 	// Mạng truyền thông công nghiệp ngành điện tử
    55, 	// 2. Các khóa Training
    22, 	// Hệ thống nhúng
    48, 	// Xử lý tín hiệu số
    11,     // Xử lý tín hiệu
    240,    // Nhập môn Internet of Things
    31,     // Mạng truyền thông công nghiệp ngành điện tử    
]

const CourseSection = {
    '69': 'section-5', // Cơ sở kỹ thuật tự động - 2102480
    '240': 'section-2', // Nhập môn Internet of Things
    '85': 'section-14', // Học máy
};

var COURSE_STATUS = 'SHOW'

/* Hide Course */
setTimeout(() => {
    const $courseHeader = document.querySelector('[data-block=course_overview] .header');
    if (!$courseHeader) return;
    $courseHeader.classList.add('nht_2-side');
    const courseToggleBtn = document.createElement('div');
    courseToggleBtn.innerHTML = `<form><div><input id="courseToggleBtn" type="submit" value="Ẩn khóa đã học"></div></form>`;
    $courseHeader.appendChild(courseToggleBtn);
    document.getElementById('courseToggleBtn').addEventListener('click', e => {
        e.preventDefault();
        ToggleCourse();
    });
    ToggleCourse();
}, 500);

function ToggleCourse() {
    let textconsole = '';
    const _hide = (e) => e.classList.add('d-none-important');
    const _show = (e) => e.classList.remove('d-none-important');
    var action = COURSE_STATUS === 'SHOW' ? _hide : _show;
    COURSE_STATUS = COURSE_STATUS === 'SHOW' ? 'HIDE' : 'SHOW';
    document.querySelectorAll('[data-block=course_overview] .content .course_list .coursebox').forEach($course => {
        const $title = $course.querySelector('.course_title a');
        const courseURL = $title.getAttribute('href');
        HideList.some(course => courseURL.includes(`view.php?id=${course}`)) && action($course);
        /* List all Courses ID */
        // textconsole += `${courseURL.replace('https://ocwfet.iuh.edu.vn/course/view.php?id=', '')}, \t// ${$title.innerText}\n`
    });
    console.log(textconsole);
    // Change button text
    const $btn = document.getElementById('courseToggleBtn');
    $btn.value = COURSE_STATUS === 'SHOW' ? 'Ẩn khóa đã học' : 'Hiện tất cả khóa học'
}



/* Scroll to course section */
setTimeout(() => {
    if (!window.location.href.startsWith('https://ocwfet.iuh.edu.vn/course/view.php?id=')) return
    const courseID = window.location.href
        .replace('https://ocwfet.iuh.edu.vn/course/view.php?id=', '')
        .match(/\d+/)[0]
    const sectionID = CourseSection[courseID]
    if (!sectionID) return
    window.location.href = `https://ocwfet.iuh.edu.vn/course/view.php?id=${courseID}#${sectionID}`
}, 500);