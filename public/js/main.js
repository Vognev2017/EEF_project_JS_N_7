let url = ''
window.onload = function () {

    url = document.location.pathname

    urls(url);
}

function urls() {
    if (url == '/') {
        myPreloader()
    }
    if (url.includes('album')) {
        album();
    }
    if (url.includes('order')) {
        order();
    }
    if (url.includes('pay')) {
        localStorage.clear();
    }
    if (url.includes('login')) {
        userPage();
    }
    if (url.includes('user')) {
        userPage();
    }
    if (url.includes('upload-page')) {
        uploadPage()
    }
    if (url.includes('upload')) {

    }
}

function index() {
    const form = document.querySelector('#login');

    document.querySelector('input[type="submit"]').addEventListener('click', (e) => {
        e.preventDefault();
        var loginForm = new FormData();
        const name = document.querySelector('input[name="name"]');
        const pass = document.querySelector('input[name="pass"]');
        loginForm.append("name", name.value);
        loginForm.append("pass", pass.value);

        getLoginForm(loginForm);
    });
    async function getLoginForm(formData) {

        try {

            const response = await axios.post("/admin/login/", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

        } catch (error) {
            // console.error("error", error);

        }
        document.querySelector('input[name="name"]').value = ''
        document.querySelector('input[name="pass"]').value = ''
    }
}


function album() {
    let photoMap = new Map();
    let indexKey = 0;
    const orderLink = document.querySelector("#order_link");

    if (orderLink) {
        orderLink.addEventListener('click', () => {
            let orderList = [];
            for (let el of photoMap.values()) {
                orderList.push(el)
            }
            localStorage.setItem('basked', JSON.stringify(orderList));
        });
    }
    document.querySelectorAll('input[type="button"]').forEach(el => {
        el.addEventListener('click', () => {
            elementBasket(el.value);
        })
    })

    const elementBasket = (value) => {
        var tbody = document.querySelector("tbody");
        var template = document.querySelector('#photorow');
        indexKey++;
        let obj = {
            "name": value,
            "type": "Gloss",
            "photo_size": "40X60"
        };
        photoMap.set(indexKey, obj);

        var clone = template.content.cloneNode(true);
        var td = clone.querySelectorAll("td");
        td[0].textContent = value;
        td[1].classList.add(indexKey);
        td[2].classList.add(indexKey);
        td[3].classList.add(indexKey);
        td[3].textContent = "X";
        td[3].addEventListener("click", (el) => {
            let key = Number(el.target.className);
            photoMap.delete(key);
            el.target.parentNode.remove();
            orderLinkActive(photoMap.size);
        });
        tbody.appendChild(clone);

        document.querySelectorAll('select[name="photostyle"]')
            .forEach(el => el.addEventListener('change', (el) => {
                let key = Number(el.target.parentNode.className);
                let tempObj = photoMap.get(key);
                tempObj.type = el.target.options[el.target.options.selectedIndex].text;
                photoMap.set(key, tempObj);
            }));
        document.querySelectorAll('select[name="photosize"]')
            .forEach(el => el.addEventListener('change', (el) => {
                let key = Number(el.target.parentNode.className);
                let tempObj = photoMap.get(key);
                tempObj.photo_size = el.target.options[el.target.options.selectedIndex].text;
                photoMap.set(key, tempObj);
            }));

        orderLinkActive(photoMap.size);
    }
    const orderLinkActive = (size) => {
        if (size > 0) {
            orderLink.classList.remove("disabled");
        } else {
            orderLink.classList.add("disabled");
        }
    }
}


function order() {
    let basked = JSON.parse(localStorage.getItem('basked'));
    if (basked != null) {
        let table = document.createElement('table')
        let html = `<table>
            <thead>
                <tr>
                    <th>Name photo</th>
                    <th>Type photo</th>
                    <th>Size photo</th>
                    </tr>
                    </thead>
                    <tbody>`
        for (let i = 0; i < basked.length; i++) {
            html += `<tr>
                    <td>${basked[i].name}</td>
                    <td>${basked[i].type}</td>
                    <td>${basked[i].photo_size}</td>
                    </tr>`
        }
        html += `</tbody></table>`;
        table.innerHTML = html;
        document.querySelector(".table").innerHTML = html;
    } else {
        document.querySelector(".table").innerText = "Sorry. You  do not have nothing."
    }
    document.querySelectorAll("input").forEach(el => {
        el.addEventListener('input', () => {
            const nameInput = document.querySelector('input[name="name"]')
            const phoneInput = document.querySelector('input[name="phone"]')

            if (nameInput.value !== '' && phoneInput.value !== '' && basked != null) {
                document.querySelector('#pay').classList.remove('disabled');
            } else {
                document.querySelector('#pay').classList.add('disabled');
            }
        });
    });
}


function uploadPage() {
    const titleInp = document.querySelector('input[name="title"]');
    const submitInp = document.querySelector('input[type="submit"]');
    const categorySel = document.querySelector('#category');
    const myImage = document.querySelector('input[name="myImage"]');
    if (categorySel) {
        categorySel.addEventListener('change', (el) => {
            titleInp.value = el.target.options[el.target.options.selectedIndex].value;

            activeSubmit();
        });
    }

    titleInp.addEventListener('input', (el) => {

        activeSubmit();
    })
    const form = document.querySelector('#uploads');
    submitInp.addEventListener('click', (e) => {
        e.preventDefault();
        var formData = new FormData(form);
        Object.keys(myImage).forEach(x => formData.append("images[]", x));
        getForm(formData)
    });

    const activeSubmit = () => {

        if (titleInp.value != '') {
            submitInp.removeAttribute('disabled')
        } else {
            submitInp.setAttribute('disabled', 'disabled')
        }
    }

    async function getForm(formData) {
        const result = document.querySelector(".result");
        try {

            const response = await axios.post("/admin/upload/", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            titleInp.value = ''
            myImage.value = ''
            result.style.color = 'green';
            result.innerText = response.data
        } catch (error) {

            result.style.color = 'red';
            result.innerText = "You not select correct file or amount selected file more five"
        }
    }
}


function userPage() {
    if (document.querySelector('#category') != null) {
        document.querySelector('#category').addEventListener('change', (el) => {
            let category = el.target.options[el.target.options.selectedIndex].text;
            document.querySelectorAll('.img-view').forEach(im => {
                if (!im.className.includes(category)) {
                    im.style.display = 'none'
                } else {
                    im.style.display = 'block'
                }
                if (category === "All") {
                    im.style.display = 'block'
                }
            })

        })
    }
}


function myPreloader() {
    window.onload = function () {
        let preloader = document.getElementById('preloader');
        preloader.classList.add('hide-preloader');
        setInterval(function () {
            preloader.classList.add('preloader-hidden');
        }, 990);
    }
}