function CreateObjectHtml(html){
	const template = document.createElement("template");

	template.innerHTML = html.trim();

	return template.content.firstElementChild;
}

function cleanWork(){
    bloc_projets.innerHTML ='';
}

async function refreshWork(){
    return (await fetch("http://localhost:5678/api/works")).json();
}

function loadWork(_cat){
    let listWork;

    cleanWork();
    btn_cat[prevSelect].classList.remove("input--select");


    if(!_cat){
        listWork = works;
        prevSelect = 0;
    }else{
        listWork = works.filter(work=>work.categoryId===_cat);
        prevSelect = _cat;
    }

    btn_cat[prevSelect].classList.add("input--select");

    listWork.forEach(b => {
        bloc_projets.insertAdjacentElement('beforeend',
            CreateObjectHtml(`
                <figure>
                    <img 
                        src="${ b.imageUrl }" 
                        alt="${ b.title }"
                    >
                    <figcaption>
                    ${ b.title }
                    </figcaption>
                </figure>
            `)
        );
    });
}

//simplifier MAP
function loadCat(){
    let i=0;
    let tempHTML;
    let btn;

    tempHTML = CreateObjectHtml(`
        <input 
            type="button" 
            value="Tous" 
            id="btn_cat_${i}"
            class="input_filter"
        >
    `);

    bloc_filter.insertAdjacentElement('beforeend', tempHTML);
    btn = document.getElementById(`btn_cat_${i}`);

    btn_cat.push(btn);

    categories.forEach(b => {
        i++;

        tempHTML = CreateObjectHtml(`
            <input 
                type="button" 
                value="${b.name}" 
                id="btn_cat_${i}"
                class="input_filter"
            >
        `);

        bloc_filter.insertAdjacentElement('beforeend',tempHTML);
        btn = document.getElementById(`btn_cat_${i}`);

        btn_cat.push(btn);
    });
}

function loadCatForm(){
    let tempHTML;
    categories.forEach(b => {
        tempHTML = CreateObjectHtml(`
            <option 
                value="${b.id}" 
            >
                ${b.name}
            </option>
        `);

        file_cat.insertAdjacentElement('beforeend',tempHTML);
    });
}

function checkLogin(){
    if(localStorage.getItem('authTK'))
        return 1;
    else
        return null;
}

function loadModal(){
    modal_works.innerHTML ='';
    btn_supr = [];
    works.forEach(b => {
        modal_works.insertAdjacentElement('beforeend',
            CreateObjectHtml(`
                <figure>
                    <img 
                        src="${ b.imageUrl }" 
                        alt="${ b.title }"
                    >
                    <figcaption>
                        <i 
                            class="fa-regular fa-trash-can fa-2xs" 
                            id="id_${b.id}"
                        ></i>
                    </figcaption>
                </figure>
            `)
        );

        btn_supr.push(document.getElementById(`id_${b.id}`));
    });

    for(let i=0;i<btn_supr.length;i++){
        btn_supr[i].addEventListener('click', function(){deleteWork(btn_supr[i].getAttribute('id'))});
    }

    loadCatForm();
}

async function deleteWork(_id){
    const id = parseInt(_id.replace("id_", ""));

    try{
        const rep = await fetch(`http://localhost:5678/api/works/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type':'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('authTK')
            },
        })
        if(rep.ok){
            works = await refreshWork();
            loadWork(0);
            loadModal();

        }else{
            console.error(rep.status + ' => ' + rep.statusText);
        }
    } catch (e){
        console.error('ERREUR => ', e);
    }
}

async function addWork(){
    const data = new FormData();

    data.append('image', file.files[0]);
    data.append('title', file_titre.value);
    data.append('category', file_cat.value);

    try{
        const rep = await fetch(`http://localhost:5678/api/works`, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('authTK')
            },
            body: data
        })
        if(rep.ok){
            works = await refreshWork();
            await loadWork(0);
            loadModal();

        }else{
            console.error(rep.status + ' => ' + rep.statusText);
        }
    } catch (e){
        console.error('ERREUR => ', e);
    }
}

function Out_file_show(){
    

    if(tempFile){
        bloc_show_add_photo.style.display = "none";

        let tempHTML;
        file_out.innerHTML='';
        tempHTML = CreateObjectHtml(`
            <div 
                class="img_out" 
            >
                <img src="${URL.createObjectURL(tempFile)}">
                <span id="out_change">changer</span>
            </div>
        `);

        file_out.insertAdjacentElement('beforeend', tempHTML);
        tempEventOut = document.getElementById("out_change");
        tempEventOut.addEventListener('click', function(){Out_file_deleted()});
    }
    else{
        bloc_show_add_photo.style.display = "block";
        file_out.innerHTML='';
    }
}

function Out_file_deleted(){
    tempFile=null;
    Out_file_show();
}

function deco(){
    localStorage.clear();
}

let works = await refreshWork();
const reponseCat = await fetch("http://localhost:5678/api/categories");
const categories = await reponseCat.json();

const login = document.getElementById("login");
const bloc_porfolio = document.getElementById("portfolio");
const bloc_projets = document.getElementById("bloc_projets");
const bloc_filter = document.getElementById("bloc_filter");
const bloc_header = document.getElementById("header");
const modal = document.getElementById("Modal");
const close_modal = document.getElementById("close");
const modal_works = document.getElementById("modal_works");
const sup_works = document.getElementById("modal_supr");
const add_works = document.getElementById("modal_form");
const add_works_photo = document.getElementById("add_works");

const retour = document.getElementById("rtr");
const file = document.getElementById("fichier");
const file_titre = document.getElementById("titre");
const file_cat = document.getElementById("cat");
const file_envoyer = document.getElementById("envoyer");
const file_out = document.getElementById("out_file"); 
const bloc_show_add_photo = document.getElementById("bloc_show_add_photo"); 

let tempFile;
let tempEventOut;

file_envoyer.addEventListener('click', function(){addWork()});


file.addEventListener("change", () => {
    tempFile=file.files[0];
    Out_file_show();
});

let btn_cat = [];
let btn_supr = [];
let prevSelect = 0;

loadCat();
await loadWork(0);

//a faire
btn_cat[0].addEventListener('click', function(){loadWork(0)});
btn_cat[1].addEventListener('click', function(){loadWork(1)});
btn_cat[2].addEventListener('click', function(){loadWork(2)});
btn_cat[3].addEventListener('click', function(){loadWork(3)});

close_modal.addEventListener('click', function(){modal.style.display = "none"});
add_works_photo.addEventListener('click', function(){
    sup_works.style.display = "none";
    add_works.style.display = "block";
    retour.style.display = "inline-block"
});
retour.addEventListener('click', function(){
    sup_works.style.display = "block";
    add_works.style.display = "none";
    retour.style.display = "none"
});

if(checkLogin()){
    console.log("connecté");
    await loadModal();

    login.innerHTML ='<a href=".">logout</a>';
    login.addEventListener('click', function(){deco()});

    bloc_filter.style.display = "none";

    bloc_header.insertAdjacentElement('beforeend',
    CreateObjectHtml(`
    <div class="mode_edit">
        <i class="fa-regular fa-pen-to-square"></i>
        <p>
            Mode édition
        </p>
    </div>
    `)).addEventListener('click', function(){modal.style.display = "block"});

    bloc_porfolio.children[0].insertAdjacentElement('afterend',
    CreateObjectHtml(`
    <div id="mode_edit_prjct">
			<i class="fa-regular fa-pen-to-square"></i>
			<p>
				modifier
			</p>
    </div>
    `)).addEventListener('click', function(){modal.style.display = "block"});
}
else{
    console.log("non connecté");
}


