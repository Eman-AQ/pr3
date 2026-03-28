// Sidebar Toggle
document.getElementById('menu-toggle').addEventListener('click', function () {
    document.getElementById('wrapper').classList.toggle('toggled');
});

// Function to update User Initials (Like React getInitials)
function updateInitials(name) {
    const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    document.getElementById('userInitials').innerText = initials;
}

// Initial Call
updateInitials("eman");

function toggleDarkMode() {
    alert("Dark mode feature coming soon!");
}

function logout() {
    if (confirm("هل أنت متأكد من تسجيل الخروج؟")) {
        window.location.reload();
    }
}

//courses section
// بيانات تجريبية أو تحميل من LocalStorage
let courses = JSON.parse(localStorage.getItem('courses')) || [];
let currentFilter = 'all';

// دالة التنقل بين الأقسام
function showSection(sectionId) {
    document.getElementById('dashboard-section').style.display = sectionId === 'dashboard' ? 'block' : 'none';
    document.getElementById('courses-section').style.display = sectionId === 'courses' ? 'block' : 'none';

    // تحديث شكل القائمة الجانبية
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.toggle('active', link.getAttribute('onclick').includes(sectionId));
    });

    if (sectionId === 'courses') renderCourses();
}

// دالة تحضير الفورم للإضافة
function prepareAddForm() {
    document.getElementById('courseForm').reset();
    document.getElementById('courseId').value = '';
    document.getElementById('modalTitle').innerText = 'Add New Course';
}

// دالة حفظ الكورس (إضافة أو تعديل)
document.getElementById('courseForm').onsubmit = function (e) {
    e.preventDefault();

    const id = document.getElementById('courseId').value;
    const courseData = {
        id: id || Date.now().toString(),
        name: document.getElementById('courseName').value,
        instructor: document.getElementById('instructor').value,
        credits: document.getElementById('credits').value,
        status: document.getElementById('courseStatus').value
    };

    if (id) {
        // تعديل
        courses = courses.map(c => c.id === id ? courseData : c);
    } else {
        // إضافة جديد
        courses.push(courseData);
    }

    localStorage.setItem('courses', JSON.stringify(courses));
    bootstrap.Modal.getInstance(document.getElementById('courseModal')).hide();
    renderCourses();
    updateDashboardStats(); // تحديث أرقام الداشبورد
};

// دالة عرض الكورسات في الصفحة
function renderCourses() {
    const grid = document.getElementById('coursesGrid');
    grid.innerHTML = '';

    const filtered = currentFilter === 'all' ? courses : courses.filter(c => c.status === currentFilter);

    if (filtered.length === 0) {
        grid.innerHTML = `<div class="text-center py-5"><i class="fas fa-book-open fa-3x opacity-25 mb-3"></i><p>No courses found</p></div>`;
        return;
    }

    filtered.forEach(course => {
        const badgeClass = course.status === 'completed' ? 'icon-green' : (course.status === 'dropped' ? 'icon-pink' : 'icon-blue');

        grid.innerHTML += `
            <div class="col-md-4">
                <div class="card h-100 border-0 shadow-sm rounded-4 position-relative">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-start mb-2">
                            <h5 class="fw-bold mb-0">${course.name}</h5>
                            <div class="dropdown">
                                <i class="fas fa-ellipsis-v text-muted cursor-pointer" data-bs-toggle="dropdown"></i>
                                <ul class="dropdown-menu dropdown-menu-end border-0 shadow">
                                    <li><a class="dropdown-item" href="#" onclick="editCourse('${course.id}')"><i class="fas fa-edit me-2"></i>Edit</a></li>
                                    <li><a class="dropdown-item text-danger" href="#" onclick="deleteCourse('${course.id}')"><i class="fas fa-trash me-2"></i>Delete</a></li>
                                </ul>
                            </div>
                        </div>
                        <span class="badge ${badgeClass} text-capitalize mb-3">${course.status.replace('-', ' ')}</span>
                        <p class="small text-muted mb-2"><i class="fas fa-user me-2"></i>${course.instructor}</p>
                        <p class="small text-muted mb-0"><i class="fas fa-graduation-cap me-2"></i>${course.credits} Credits</p>
                    </div>
                </div>
            </div>
        `;
    });
}

// دالة الحذف
function deleteCourse(id) {
    if (confirm('Are you sure you want to delete this course?')) {
        courses = courses.filter(c => c.id !== id);
        localStorage.setItem('courses', JSON.stringify(courses));
        renderCourses();
        updateDashboardStats();
    }
}

// دالة التعديل (تعبئة الفورم بالبيانات)
function editCourse(id) {
    const course = courses.find(c => c.id === id);
    document.getElementById('courseId').value = course.id;
    document.getElementById('courseName').value = course.name;
    document.getElementById('instructor').value = course.instructor;
    document.getElementById('credits').value = course.credits;
    document.getElementById('courseStatus').value = course.status;

    document.getElementById('modalTitle').innerText = 'Edit Course';
    new bootstrap.Modal(document.getElementById('courseModal')).show();
}

// دالة الفلترة
function filterCourses(status) {
    currentFilter = status;
    renderCourses();
}

// دالة لتحديث أرقام الداشبورد تلقائياً
function updateDashboardStats() {
    // يمكنك هنا ربط الأرقام الموجودة في قسم الـ Dashboard بالـ localStorage
    const total = courses.length;
    const completed = courses.filter(c => c.status === 'completed').length;
    // تحديث العناصر في الـ HTML (تحتاج للتأكد من وجود ID لكل رقم في الـ HTML)
}

